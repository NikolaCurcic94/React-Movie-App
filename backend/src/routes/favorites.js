'use strict';
const express = require('express');
const { param, validationResult } = require('express-validator');
const { pool } = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const MOVIE_COLUMNS = `
  m.id::TEXT      AS "_id",
  m.title,
  m.year,
  m.director,
  m.actors,
  m.description,
  m.img_url       AS "imgUrl",
  m.genre,
  m.created_at
`;

// GET /api/favorites — returns full movie objects for the logged-in user
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ${MOVIE_COLUMNS}
       FROM user_favorites uf
       JOIN movies m ON m.id = uf.movie_id
       WHERE uf.user_id = $1
       ORDER BY uf.created_at ASC`,
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /favorites error:', err);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// POST /api/favorites/:movieId
router.post(
  '/:movieId',
  requireAuth,
  [param('movieId').isInt({ min: 1 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      await pool.query(
        `INSERT INTO user_favorites (user_id, movie_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [req.user.userId, req.params.movieId]
      );
      res.status(201).json({ message: 'Added to favorites' });
    } catch (err) {
      console.error('POST /favorites/:movieId error:', err);
      res.status(500).json({ error: 'Failed to add favorite' });
    }
  }
);

// DELETE /api/favorites/:movieId
router.delete(
  '/:movieId',
  requireAuth,
  [param('movieId').isInt({ min: 1 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      await pool.query(
        'DELETE FROM user_favorites WHERE user_id = $1 AND movie_id = $2',
        [req.user.userId, req.params.movieId]
      );
      res.json({ message: 'Removed from favorites' });
    } catch (err) {
      console.error('DELETE /favorites/:movieId error:', err);
      res.status(500).json({ error: 'Failed to remove favorite' });
    }
  }
);

module.exports = router;
