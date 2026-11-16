const { sequelize } = require('../models');
const app = require('../index');
require('dotenv').config();

const connectToDatabase = async () => {
    if (sequelize.connectionManager.pool) {
        return;
    }
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
};

module.exports = async (req, res) => {
    try {
        await connectToDatabase();
        return app(req, res);
    } catch (err) {
        console.error('PostgreSQL connection error:', err);
        res.status(500).json({ error: 'Database connection failed' });
    }
};