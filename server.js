const express = require('express');
const app = express();

// Use PORT assigned by environment or default to 3000
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

// 1. Root Route
app.get('/', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Express App on AWS ECS</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; background-color: #f4f4f9; }
        h1 { color: #232f3e; }
        p { color: #555; }
        a { color: #ff9900; text-decoration: none; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>🚀 Application Deployed Successfully!</h1>
      <p>Running on AWS ECS Fargate (us-east-1)</p>
      <p>Visit the <a href="/docs">API Documentation (/docs)</a> or check <a href="/health">Health Status (/health)</a>.</p>
    </body>
    </html>
  `);
});

// 2. Documentation Route
app.get('/docs', (req, res) => {
  res.status(200).json({
    title: "API Documentation",
    version: "1.0.0",
    endpoints: [
      { path: "/", method: "GET", description: "Home page UI" },
      { path: "/docs", method: "GET", description: "API documentation overview" },
      { path: "/health", method: "GET", description: "Container health check endpoint" }
    ],
    environment: process.env.NODE_ENV || "production"
  });
});

// 3. Health Check Route for ECS Target Group
app.get('/health', (req, res) => {
  res.status(200).json({
    status: "UP",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Bind server to '0.0.0.0' to accept external container traffic
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});