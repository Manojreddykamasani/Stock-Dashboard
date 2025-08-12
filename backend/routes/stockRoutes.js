const express = require('express');
const { getStocks, getStockData, getStockIndicators, getStockPrediction } = require('../controllers/stockController');

const router = express.Router();

router.get('/stocks', getStocks);
router.get('/stocks/:symbol', getStockData);
router.get('/stocks/:symbol/indicators', getStockIndicators);
router.get('/stocks/:symbol/predict', getStockPrediction);

module.exports = router;