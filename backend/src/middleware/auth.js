'use strict';
const jwt = require('jsonwebtoken');

// The frontend sends the raw JWT string in the `authorization` header
// (no "Bearer " prefix). We accept both styles for flexibility.
function requireAuth(req, res, next) {
  const header = req.headers['authorization'] || req.headers['Authorization'];
  if (!header) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = header.startsWith('Bearer ') ? header.slice(7) : header;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, email, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { requireAuth };
