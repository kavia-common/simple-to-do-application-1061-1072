require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

// Graceful shutdown
async function shutdown(signal) {
  console.log(`${signal} signal received: closing HTTP server`);
  server.close(async () => {
    console.log('HTTP server closed');
    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
      }
    } catch (e) {
      console.error('Error closing MongoDB connection:', e);
    }
    process.exit(0);
  });
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = server;
