const axios = require('axios');

const companies = [
  { name: 'Apple', symbol: 'AAPL' },
  { name: 'Microsoft', symbol: 'MSFT' },
  { name: 'Google', symbol: 'GOOGL' },
  { name: 'Amazon', symbol: 'AMZN' },
  { name: 'Tesla', symbol: 'TSLA' },
  { name: 'NVIDIA', symbol: 'NVDA' },
  { name: 'Meta', symbol: 'META' },
  { name: 'JPMorgan Chase', symbol: 'JPM' },
  { name: 'Johnson & Johnson', symbol: 'JNJ' },
  { name: 'Exxon Mobil', symbol: 'XOM' },
];

let db;

const setupDatabase = (database) => {
  db = database;
  db.exec(`
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      symbol TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS historical_data (
      id INTEGER PRIMARY KEY,
      company_id INTEGER,
      date TEXT NOT NULL,
      open REAL,
      high REAL,
      low REAL,
      close REAL,
      volume INTEGER,
      FOREIGN KEY(company_id) REFERENCES companies(id),
      UNIQUE(company_id, date)
    );
  `);
  
  const insertCompanyStmt = db.prepare('INSERT OR IGNORE INTO companies (name, symbol) VALUES (?, ?)');
  const transaction = db.transaction((companies) => {
    for (const company of companies) {
      insertCompanyStmt.run(company.name, company.symbol);
    }
  });
  transaction(companies);
};

const getCompanies = () => {
  const getCompaniesStmt = db.prepare('SELECT name, symbol FROM companies ORDER BY name ASC');
  return getCompaniesStmt.all();
};

const getHistoricalDataFromDb = (symbol) => {
  const getCompanyIdStmt = db.prepare('SELECT id FROM companies WHERE symbol = ?');
  const companyId = getCompanyIdStmt.get(symbol)?.id;
  if (!companyId) {
    return null;
  }
  const getHistoricalDataStmt = db.prepare('SELECT date, open, high, low, close, volume FROM historical_data WHERE company_id = ? ORDER BY date DESC');
  return getHistoricalDataStmt.all(companyId);
};

const fetchAndStoreData = async (symbol) => {
  const FMP_API_KEY = process.env.FMP_API_KEY;

  const company = companies.find(c => c.symbol === symbol);
  if (!company) {
    return [];
  }
  const getCompanyIdStmt = db.prepare('SELECT id FROM companies WHERE symbol = ?');
  const companyId = getCompanyIdStmt.get(symbol).id;
  
  const response = await axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}`, {
    params: {
      apikey: FMP_API_KEY
    }
  });

  const historicalData = response.data.historical;
  if (!historicalData) {
    return [];
  }
  
  const insertDataStmt = db.prepare(`
    INSERT OR IGNORE INTO historical_data (company_id, date, open, high, low, close, volume)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const transaction = db.transaction((data) => {
    for (const dataPoint of data) {
      insertDataStmt.run(
        companyId,
        dataPoint.date,
        dataPoint.open,
        dataPoint.high,
        dataPoint.low,
        dataPoint.close,
        dataPoint.volume
      );
    }
  });
  transaction(historicalData);
  return getHistoricalDataFromDb(symbol);
};

const refreshAllStocks = () => {
  for (const company of companies) {
    fetchAndStoreData(company.symbol);
  }
};

module.exports = {
  getCompanies,
  getHistoricalDataFromDb,
  fetchAndStoreData,
  refreshAllStocks,
  setupDatabase
};