const express = require('express');
const dotenv = require('dotenv');
const gpsService = require('./src/services/gpsService');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.get('/gps', (req, res) => {
  const gpsData = gpsService.getGPSData();
  res.json(gpsData);
});

app.listen(port, () => {
  console.log(`Server GPS berjalan pada http://localhost:${port}/gps`);
});
