const express = require('express');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ==========================================
// 1. JSON API ROUTES (NO LIBRARIES REQUIRED)
// ==========================================

// Health Check Endpoint (Used by AWS ECS)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    environment: 'AWS ECS Fargate',
  });
});

// System Metrics API Endpoint
app.get('/api/v1/metrics', (req, res) => {
  res.status(200).json({
    platform: process.platform,
    nodeVersion: process.version,
    memory: {
      totalMB: (os.totalmem() / 1024 / 1024).toFixed(2),
      freeMB: (os.freemem() / 1024 / 1024).toFixed(2),
      heapUsedMB: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
    },
    cpuCores: os.cpus().length,
    hostname: os.hostname(),
  });
});

// ==========================================
// 2. IMPRESSIVE EXECUTIVE DASHBOARD (HOME)
// ==========================================
app.get('/', (req, res) => {
  const heapUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
  const uptime = Math.floor(process.uptime());

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cloud Kinetics Ops Portal</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-950 text-slate-100 min-h-screen p-6 md:p-12 font-sans antialiased">
      <div class="max-w-5xl mx-auto space-y-8">
        
        <!-- Header -->
        <header class="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-3xl font-extrabold text-sky-400 tracking-tight">Cloud Kinetics</h1>
              <span class="bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold px-2.5 py-0.5 rounded-full">Production</span>
            </div>
            <p class="text-slate-400 text-sm mt-1">Microservice Gateway • AWS ECS Fargate & GitHub Actions CI/CD</p>
          </div>
          <div class="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
            <span class="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
            <span class="text-emerald-400 text-sm font-medium">Container Operational</span>
          </div>
        </header>

        <!-- Live Telemetry Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Target Provider</p>
            <p class="text-xl font-bold mt-2 text-slate-100">AWS Fargate</p>
            <p class="text-xs text-sky-400 mt-1">us-east-1 Region</p>
          </div>

          <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Process Uptime</p>
            <p class="text-xl font-bold mt-2 text-slate-100">${uptime}s</p>
            <p class="text-xs text-emerald-400 mt-1">Active Lifecycle</p>
          </div>

          <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Heap Allocation</p>
            <p class="text-xl font-bold mt-2 text-slate-100">${heapUsed} MB</p>
            <p class="text-xs text-amber-400 mt-1">Node.js Runtime</p>
          </div>

          <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Container ID</p>
            <p class="text-xl font-bold mt-2 text-slate-100 font-mono text-sm truncate">${os.hostname()}</p>
            <p class="text-xs text-slate-400 mt-1">ECS Task Instance</p>
          </div>
        </div>

        <!-- Verification Actions -->
        <div class="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-4">
          <h2 class="text-xl font-bold text-slate-100">Live API Verification Endpoints</h2>
          <p class="text-slate-400 text-sm">
            Click below to inspect live JSON response contracts directly from the running container:
          </p>
          <div class="flex flex-wrap gap-4 pt-2">
            <a href="/health" target="_blank" class="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-sky-500/20">
              Test Container Health JSON →
            </a>
            <a href="/api/v1/metrics" target="_blank" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium rounded-xl text-sm transition-all">
              Inspect System Metrics Endpoint →
            </a>
          </div>
        </div>

      </div>
    </body>
    </html>
  `);
});

// ==========================================
// 3. SERVER BINDING
// ==========================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server live on port ${PORT}`);
});