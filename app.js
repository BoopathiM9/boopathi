const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Health check endpoint for ECS / ALB
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Main root route
app.get('/', (req, res) => {
  res.status(200).send('Hello World from ECS!');
});

// Express must explicitly bind to '0.0.0.0' inside Docker containers
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Application started and listening on http://0.0.0.0:${PORT}`);
});

module.exports = app;