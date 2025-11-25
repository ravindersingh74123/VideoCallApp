// Simple Express server to serve Vite build with SPA fallback routing
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle API proxy (optional - if you want to proxy from frontend server)
// Uncomment if needed:
// const { createProxyMiddleware } = require('http-proxy-middleware');
// app.use('/api', createProxyMiddleware({
//   target: process.env.API_URL || 'https://videocallapp-q3f0.onrender.com',
//   changeOrigin: true,
// }));

// SPA fallback: serve index.html for all routes that don't match static files
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

