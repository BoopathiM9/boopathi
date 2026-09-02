const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World from AWS ECS Fargate!');
});

// Binds to 0.0.0.0 to allow external network access inside container
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});