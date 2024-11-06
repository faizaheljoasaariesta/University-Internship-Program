const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

let gpsData = {};

app.get('/api/gps', (req, res) => {
  res.json(gpsData);
});

app.post('/api/gps', (req, res) => {
  gpsData = req.body;
  res.status(200).send('Data GPS diterima');
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://192.168.118.222:${PORT}`);
});
