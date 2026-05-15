'use strict';
const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { pool } = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Every query uses these aliases to match the frontend Movie interface:
//   _id    (frontend expects MongoDB-style string id)
//   imgUrl (frontend uses camelCase)
const MOVIE_COLUMNS = `
  id::TEXT        AS "_id",
  title,
  year,
  director,
  actors,
  description,
  img_url         AS "imgUrl",
  genre,
  created_at
`;

// GET /api/movies?search=title&genre=Drama
router.get(
  '/',
  [
    query('search').optional().isString().trim(),
    query('genre').optional().isString().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { search, genre } = req.query;
    const values = [];
    const conditions = [];

    if (search) {
      values.push(`%${search.toLowerCase()}%`);
      conditions.push(`LOWER(title) LIKE $${values.length}`);
    }
    if (genre) {
      values.push(genre);
      conditions.push(`genre @> ARRAY[$${values.length}]::TEXT[]`);
    }

    const WHERE = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    try {
      const result = await pool.query(
        `SELECT ${MOVIE_COLUMNS} FROM movies ${WHERE} ORDER BY created_at ASC`,
        values
      );
      res.json(result.rows);
    } catch (err) {
      console.error('GET /movies error:', err);
      res.status(500).json({ error: 'Failed to fetch movies' });
    }
  }
);

// GET /api/genres — flat sorted string array consumed by SelectGenre component
router.get('/genres', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT unnest(genre) AS genre
      FROM movies
      ORDER BY genre ASC
    `);
    res.json(result.rows.map(r => r.genre));
  } catch (err) {
    console.error('GET /genres error:', err);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

// GET /api/movies/:id
router.get(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('Invalid movie ID')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const result = await pool.query(
        `SELECT ${MOVIE_COLUMNS} FROM movies WHERE id = $1`,
        [req.params.id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('GET /movies/:id error:', err);
      res.status(500).json({ error: 'Failed to fetch movie' });
    }
  }
);

// POST /api/movies — body from AddNewMovie.tsx uses imgUrl (camelCase)
router.post(
  '/',
  requireAuth,
  [
    body('title').notEmpty().trim().withMessage('Title required'),
    body('year').isInt({ min: 1800, max: 2100 }).withMessage('Valid year required'),
    body('director').notEmpty().trim().withMessage('Director required'),
    body('actors').isArray({ min: 1 }).withMessage('At least one actor required'),
    body('actors.*').isString().trim(),
    body('genre').isArray({ min: 1 }).withMessage('At least one genre required'),
    body('genre.*').isString().trim(),
    body('description').notEmpty().trim().withMessage('Description required'),
    body('imgUrl').optional({ values: 'falsy' }).isURL().withMessage('imgUrl must be a valid URL'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, year, director, actors, genre, description, imgUrl = '' } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO movies (title, year, director, actors, description, img_url, genre)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING ${MOVIE_COLUMNS}`,
        [title, parseInt(year, 10), director, actors, description, imgUrl, genre]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('POST /movies error:', err);
      res.status(500).json({ error: 'Failed to create movie' });
    }
  }
);

// PUT /api/movies/:id — partial update, only provided fields are changed
router.put(
  '/:id',
  requireAuth,
  [
    param('id').isInt({ min: 1 }),
    body('title').optional().notEmpty().trim(),
    body('year').optional().isInt({ min: 1800, max: 2100 }),
    body('director').optional().notEmpty().trim(),
    body('actors').optional().isArray({ min: 1 }),
    body('genre').optional().isArray({ min: 1 }),
    body('description').optional().notEmpty().trim(),
    body('imgUrl').optional().isURL(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, year, director, actors, genre, description, imgUrl } = req.body;
    const setClauses = [];
    const values = [];

    if (title !== undefined)       { values.push(title);              setClauses.push(`title = $${values.length}`); }
    if (year !== undefined)        { values.push(parseInt(year, 10)); setClauses.push(`year = $${values.length}`); }
    if (director !== undefined)    { values.push(director);           setClauses.push(`director = $${values.length}`); }
    if (actors !== undefined)      { values.push(actors);             setClauses.push(`actors = $${values.length}`); }
    if (genre !== undefined)       { values.push(genre);              setClauses.push(`genre = $${values.length}`); }
    if (description !== undefined) { values.push(description);        setClauses.push(`description = $${values.length}`); }
    if (imgUrl !== undefined)      { values.push(imgUrl);             setClauses.push(`img_url = $${values.length}`); }

    if (setClauses.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.params.id);

    try {
      const result = await pool.query(
        `UPDATE movies SET ${setClauses.join(', ')} WHERE id = $${values.length}
         RETURNING ${MOVIE_COLUMNS}`,
        values
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Movie not found' });
      res.json(result.rows[0]);
    } catch (err) {
      console.error('PUT /movies/:id error:', err);
      res.status(500).json({ error: 'Failed to update movie' });
    }
  }
);

// DELETE /api/movies/:id
router.delete(
  '/:id',
  requireAuth,
  [param('id').isInt({ min: 1 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const result = await pool.query(
        'DELETE FROM movies WHERE id = $1 RETURNING id',
        [req.params.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Movie not found' });
      res.json({ message: 'Movie deleted', id: req.params.id });
    } catch (err) {
      console.error('DELETE /movies/:id error:', err);
      res.status(500).json({ error: 'Failed to delete movie' });
    }
  }
);

module.exports = router;
