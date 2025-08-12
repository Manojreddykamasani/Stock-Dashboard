const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const stockRoutes = require('./routes/stockRoutes');
const { refreshAllStocks, setupDatabase } = require('./services/dataService');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', stockRoutes);

const dbPath = process.env.NODE_ENV === 'production'
  ? path.resolve('/var/data/stock_data.db')
  : path.resolve(__dirname, 'stock_data.db');

const db = new (require('better-sqlite3'))(dbPath);
setupDatabase(db);

cron.schedule('0 * * * *', () => {
  console.log('Running scheduled stock data refresh...');
  refreshAllStocks(db);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  refreshAllStocks(db);
});