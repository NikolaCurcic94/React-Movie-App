'use strict';
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { pool } = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// PUT /api/users/:id
// Called by the Star component (AllComponets.tsx) with a full replacement array:
//   { "favorites": ["1", "2", "3"] }
// Replaces all user favorites atomically in a transaction.
router.put(
  '/:id',
  requireAuth,
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid user ID'),
    body('favorites').isArray().withMessage('favorites must be an array'),
    body('favorites.*').isString().withMessage('Each favorite must be a string movie ID'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const requestedId = parseInt(req.params.id, 10);

    if (req.user.userId !== requestedId) {
      return res.status(403).json({ error: 'Forbidden: cannot modify another user\'s favorites' });
    }

    const { favorites } = req.body;
    const movieIds = favorites
      .map(id => parseInt(id, 10))
      .filter(id => !isNaN(id) && id > 0);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM user_favorites WHERE user_id = $1', [requestedId]);

      if (movieIds.length > 0) {
        const placeholders = movieIds.map((_, i) => `($1, $${i + 2})`).join(', ');
        await client.query(
          `INSERT INTO user_favorites (user_id, movie_id) VALUES ${placeholders} ON CONFLICT DO NOTHING`,
          [requestedId, ...movieIds]
        );
      }

      await client.query('COMMIT');

      const favResult = await pool.query(
        'SELECT movie_id FROM user_favorites WHERE user_id = $1 ORDER BY created_at ASC',
        [requestedId]
      );
      const updatedFavorites = favResult.rows.map(r => String(r.movie_id));

      res.json({
        _id: String(requestedId),
        email: req.user.email,
        favorites: updatedFavorites,
      });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('PUT /users/:id error:', err);
      res.status(500).json({ error: 'Failed to update favorites' });
    } finally {
      client.release();
    }
  }
);

module.exports = router;
