require('dotenv').config();
const http = require('http');
const app = require('./index');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;
let server;

async function connectDatabase() {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('PostgreSQL connected and tables synced');
}

async function startServer() {
    if (server && server.listening) {
        return server;
    }
    try {
        await connectDatabase();
    } catch (err) {
        console.error('PostgreSQL connection error:', err);
        process.exit(1);
    }
    server = http.createServer(app);
    await new Promise((resolve) => {
        server.listen(PORT, resolve);
    });
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
    return server;
}

async function stopServer() {
    if (!server || !server.listening) return;
    await new Promise((resolve, reject) => {
        server.close((err) => {
            if (err) return reject(err);
            resolve();
        });
    });
    await sequelize.close();
    console.log('Server stopped and PostgreSQL disconnected');
}

async function shutdown(signal) {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    try {
        await stopServer();
        process.exit(0);
    } catch (err) {
        console.error('Shutdown error:', err);
        process.exit(1);
    }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    shutdown('uncaughtException');
});
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
    shutdown('unhandledRejection');
});

if (require.main === module) {
    startServer().catch((err) => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });
}

module.exports = { app, startServer, stopServer };