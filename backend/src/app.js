'use strict';
const express = require('express');
const cors = require('cors');

const moviesRouter    = require('./routes/movies');
const authRouter      = require('./routes/auth');
const favoritesRouter = require('./routes/favorites');
const usersRouter     = require('./routes/users');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'authorization', 'Accept'],
  optionsSuccessStatus: 200,
}));
app.use(express.json());

app.use('/api/movies',    moviesRouter);
app.use('/api/auth',      authRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/users',     usersRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
