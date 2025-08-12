const calculate52WeekHighLow = (data) => {
  if (!data || data.length < 252) {
    return { high: null, low: null };
  }
  const lastYearData = data.slice(0, 252);
  const closingPrices = lastYearData.map(d => parseFloat(d.close));
  const high = Math.max(...closingPrices);
  const low = Math.min(...closingPrices);
  return { high, low };
};

const calculateMovingAverage = (data, period) => {
  if (!data || data.length < period) {
    return null;
  }
  const closingPrices = data.map(d => parseFloat(d.close));
  const sum = closingPrices.slice(0, period).reduce((acc, curr) => acc + curr, 0);
  return (sum / period).toFixed(2);
};

const simplePrediction = (data) => {
  if (!data || data.length < 20) {
    return null;
  }

  const recentPrices = data.slice(0, 20).map(d => parseFloat(d.close)).reverse();
  const n = recentPrices.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += recentPrices[i];
    sumXY += i * recentPrices[i];
    sumXX += i * i;
  }
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  const nextDayPrice = slope * n + intercept;
  
  return nextDayPrice.toFixed(2);
};

module.exports = {
  calculate52WeekHighLow,
  calculateMovingAverage,
  simplePrediction
};
