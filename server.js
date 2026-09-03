const express = require('express');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Endpoints
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString(), uptime: `${Math.floor(process.uptime())}s` });
});

app.get('/api/v1/metrics', (req, res) => {
  res.status(200).json({
    memory: { totalMB: (os.totalmem() / 1024 / 1024).toFixed(2), heapUsedMB: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) },
    cpuCores: os.cpus().length,
    hostname: os.hostname(),
  });
});

// Command Center Portal UI
app.get('/', (req, res) => {
  const heapUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
  const uptime = Math.floor(process.uptime());

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cloud Kinetics Dashboard</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Inter', sans-serif; background-color: #0b111e; }
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
        .glass-panel { background: rgba(16, 26, 44, 0.75); backdrop-filter: blur(12px); border: 1px solid rgba(0, 229, 255, 0.15); }
        .glow-cyan { text-shadow: 0 0 15px rgba(0, 229, 255, 0.6); }
        .ring-glow { box-shadow: 0 0 25px rgba(0, 229, 255, 0.25); }
      </style>
    </head>
    <body class="text-slate-100 min-h-screen p-4 md:p-8 relative overflow-x-hidden">
      
      <!-- Top Navigation -->
      <nav class="max-w-7xl mx-auto flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 font-bold text-lg shadow-[0_0_10px_rgba(0,229,255,0.4)]">CK</div>
          <span class="font-orbitron text-xl font-extrabold text-cyan-400 tracking-wider glow-cyan">CLOUD KINETICS</span>
        </div>
        <div class="flex items-center gap-3 bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-700">
          <div class="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-xs font-bold text-cyan-300">BM</div>
          <span class="text-sm font-semibold text-slate-300 tracking-wide">BOOPATHI</span>
        </div>
      </nav>

      <!-- Main Layout -->
      <main class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Hero Text -->
        <div class="lg:col-span-4 space-y-4 pt-8">
          <h1 class="font-orbitron text-3xl md:text-4xl font-extrabold leading-tight text-slate-200">
            INTEGRATED <br/><span class="text-cyan-400 glow-cyan">CLOUD</span> <br/>DEPLOYMENT <br/>PORTAL
          </h1>
          <p class="text-slate-400 text-sm leading-relaxed">
            Enterprise microservice architecture deployed continuously to serverless AWS ECS Fargate via GitHub Actions CI/CD pipeline.
          </p>
        </div>

        <!-- Main Telemetry Glass Card -->
        <div class="lg:col-span-8 glass-panel p-6 md:p-8 rounded-3xl ring-glow space-y-6">
          
          <div class="flex justify-between items-center">
            <h2 class="font-orbitron text-sm font-bold text-cyan-400 tracking-wider flex items-center gap-2">
              <span class="text-amber-400">⚡</span> LIVE DEPLOYMENT STATUS
            </h2>
            <span class="text-xs text-slate-500 font-mono">TASK ID: ${os.hostname().substring(0, 10)}</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <!-- Radial Progress -->
            <div class="flex flex-col items-center justify-center p-4 relative">
              <div class="w-48 h-48 rounded-full border-8 border-slate-800 border-t-cyan-400 border-r-cyan-400 flex flex-col items-center justify-center ring-glow">
                <span class="font-orbitron text-4xl font-extrabold text-slate-100">100%</span>
                <span class="text-[10px] text-slate-400 uppercase tracking-widest mt-1">COMPLETE</span>
              </div>
              <p class="text-xs text-slate-400 text-center mt-3 max-w-[200px]">Deployed to AWS ECS Fargate via GitHub Actions CI/CD</p>
              <div class="mt-4 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span class="text-emerald-400 font-orbitron text-xs font-semibold tracking-wider">ALL SYSTEMS NOMINAL</span>
              </div>
            </div>

            <!-- Chart -->
            <div class="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div class="flex justify-between items-center text-xs text-slate-400 mb-2 font-mono">
                <span>SYSTEM PERFORMANCE</span>
                <span class="text-emerald-400">UPTIME: ${uptime}s</span>
              </div>
              <canvas id="telemetryChart" class="w-full h-40"></canvas>
            </div>
          </div>

          <!-- Bottom Action Links -->
          <div class="border-t border-slate-800/80 pt-4 space-y-3">
            <a href="/health" target="_blank" class="flex justify-between items-center p-3 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 text-cyan-400 text-xs font-orbitron font-semibold tracking-wider transition-all">
              <span>📋 SERVICE HEALTH CHECK</span>
              <span>↗</span>
            </a>
            <a href="/api/v1/metrics" target="_blank" class="flex justify-between items-center p-3 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 text-cyan-400 text-xs font-orbitron font-semibold tracking-wider transition-all">
              <span>📊 LIVE CONTAINER METRICS</span>
              <span>↗</span>
            </a>
          </div>

        </div>

      </main>

      <script>
        const ctx = document.getElementById('telemetryChart').getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['10m ago', '8m ago', '6m ago', '4m ago', '2m ago', 'Now'],
            datasets: [{
              label: 'CPU usage (%)',
              data: [15, 22, 18, 28, 24, 20],
              borderColor: '#00e5ff',
              borderWidth: 2,
              tension: 0.4,
              fill: false
            }, {
              label: 'Memory usage (%)',
              data: [35, 38, 36, 42, 40, ${Math.min(heapUsed * 2, 80)}],
              borderColor: '#10b981',
              borderWidth: 2,
              tension: 0.4,
              fill: false
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { labels: { color: '#94a3b8', font: { size: 10 } } } },
            scales: {
              x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 9 } } },
              y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 9 } }, min: 0, max: 100 }
            }
          }
        });
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));