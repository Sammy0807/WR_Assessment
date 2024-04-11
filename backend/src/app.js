const express = require('express');
const gameRoutes = require('./routes/gameRoutes');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());
app.use(rateLimiter);
// ... other middleware

app.use('/api', gameRoutes);

app.use(errorHandler); // Keep this as the last middleware

module.exports = app;
