const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Basic health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('Hello World from ECS!');
});

// Start listening on 0.0.0.0:3000 (Required to keep ECS container running)
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;