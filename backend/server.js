'use strict';
require('dotenv').config();

const app = require('./src/app');
const { testConnection } = require('./src/config/db');

const PORT = process.env.PORT || 3001;

(async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`Movie API server running on http://localhost:${PORT}`);
  });
})();
