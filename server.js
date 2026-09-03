const express = require('express');
const app = express();

// Use PORT provided by environment or default to 3000
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and static assets
app.use(express.json());
app.use(express.static('public'));

// Root Route (Home Page)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cloud Kinetics</title>
      <style>
        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f4f6f8; }
        .card { background: white; padding: 2.5rem; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); text-align: center; max-width: 500px; }
        h1 { color: #0066cc; margin-bottom: 0.5rem; }
        p { color: #555; line-height: 1.5; }
        .status { display: inline-block; padding: 0.3rem 0.8rem; background: #e6fffa; color: #047857; border-radius: 9999px; font-weight: bold; font-size: 0.875rem; margin-top: 1rem; }
        a { color: #0066cc; text-decoration: none; font-weight: bold; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Cloud Kinetics Web Application</h1>
        <p>Deployed successfully to AWS ECS Fargate via GitHub Actions CI/CD.</p>
        <div class="status">● Container Running</div>
        <p style="margin-top: 1.5rem;">Check out the <a href="/docs">API Documentation</a></p>
      </div>
    </body>
    </html>
  `);
});

// Documentation Route (Fixes 'Cannot GET /docs')
app.get('/docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Documentation - Cloud Kinetics</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 2rem; background-color: #f4f6f8; color: #333; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        h1 { color: #0066cc; }
        code { background: #eef2f5; padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; }
        a { color: #0066cc; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>API Documentation</h1>
        <p>Welcome to the Cloud Kinetics API documentation.</p>
        <hr />
        <h3>Available Endpoints:</h3>
        <ul>
          <li><code>GET /</code> - Main Application Landing Page</li>
          <li><code>GET /docs</code> - API Documentation</li>
          <li><code>GET /health</code> - ECS Task Healthcheck Endpoint</li>
        </ul>
        <p><a href="/">← Back to Home</a></p>
      </div>
    </body>
    </html>
  `);
});

// Healthcheck Route for AWS Target Group / ECS Health Checks
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Explicitly listen on '0.0.0.0' for AWS Fargate container networking
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[INFO] Server actively listening on http://0.0.0.0:${PORT}`);
});