const { getCompanies, getHistoricalDataFromDb, fetchAndStoreData } = require('../services/dataService');
const { calculate52WeekHighLow, calculateMovingAverage, simplePrediction } = require('../utils/technicalIndicators');

const getStocks = (req, res) => {
  try {
    const companies = getCompanies();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve company list.' });
  }
};

const getStockData = async (req, res) => {
  const { symbol } = req.params;
  try {
    let data = getHistoricalDataFromDb(symbol);
    if (!data || data.length === 0) {
      data = await fetchAndStoreData(symbol);
    }
    if (data && data.length > 0) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'Stock data not found.' });
    }
  } catch (err) {
    console.error('Error fetching stock data:', err);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
};

const getStockIndicators = async (req, res) => {
  const { symbol } = req.params;
  const { period = 50 } = req.query;
  try {
    const data = getHistoricalDataFromDb(symbol);
    if (!data || data.length < 252) {
      await fetchAndStoreData(symbol);
    }
    const fullData = getHistoricalDataFromDb(symbol);
    if (fullData && fullData.length > 0) {
      const highLow = calculate52WeekHighLow(fullData);
      const sma = calculateMovingAverage(fullData, parseInt(period));
      res.json({
        symbol,
        '52_week_high_low': highLow,
        'moving_average': sma
      });
    } else {
      res.status(404).json({ error: 'Insufficient data for indicators.' });
    }
  } catch (err) {
    console.error('Error calculating indicators:', err);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
};

const getStockPrediction = async (req, res) => {
  const { symbol } = req.params;
  try {
    const data = getHistoricalDataFromDb(symbol);
    if (!data || data.length < 20) {
      await fetchAndStoreData(symbol);
    }
    const fullData = getHistoricalDataFromDb(symbol);
    if (fullData && fullData.length > 0) {
      const prediction = simplePrediction(fullData);
      res.json({
        symbol,
        'next_day_price_prediction': prediction,
      });
    } else {
      res.status(404).json({ error: 'Insufficient data for prediction.' });
    }
  } catch (err) {
    console.error('Error predicting stock price:', err);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
};

module.exports = {
  getStocks,
  getStockData,
  getStockIndicators,
  getStockPrediction
};