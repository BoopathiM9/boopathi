const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World from AWS ECS Fargate!');
});

// Binding to '0.0.0.0' is required for ECS containers to receive external traffic
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});