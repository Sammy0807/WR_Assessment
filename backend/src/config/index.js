require('dotenv').config();

module.exports = {
  databaseURL: process.env.DATABASE_URL,
  port: process.env.PORT || 3000,
};
