const { data } = require('./constants');
const express = require("express");
const http = require('http');
const WebSocketServer = require('websocket').server;
const cors = require('cors');

let valueMessage = null;
let jsonData = null;

const app = express();

app.use(cors());

const server = http.createServer(app);

const wsServer = new WebSocketServer({
  httpServer: server,
});

app.use(express.json());

app.post('/control', (req, res) => {
  const data = req.body.data;

  wsServer.connections.forEach((connection) => {
    connection.sendUTF(JSON.stringify({ data }), (err) => {
      if (err) {
        console.log("error :", err);
        res.status(500).json({ error: "write data error!" });
      } else {
        console.log("data terkirim ->", JSON.stringify({ data }));
        res.end();
      }
    });
  });
});

app.get('/receiver', async (req, res) => {
  try {
    const response = await fetch("http://10.110.180.25/VirtualRadar/AircraftList.json?ldv=638569561247171075&stm=1721362383529&lat=-6.8961484062892975&lng=107.57571995302902&selAc=9045370&trFmt=fa");
    if (response.ok) {
      const data = await response.json();
      res.json(data);
    } else {
      res.status(404).send('Data tidak tersedia');
    }
  } catch (error) {
    res.status(500).send('Error mengambil data');
  }
});

app.get('/data', (req, res) => {
  if (data && data.length > 0) {
    res.json(data);
  } else {
    res.status(404).send('Data tidak tersedia');
  }
});

wsServer.on('request', function (request) {
  const connection = request.accept(null, request.origin);
  console.log('Client terhubung');

  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      console.log(`Menerima pesan: ${message.utf8Data}`);
      const data = message.utf8Data;
      valueMessage = data;

      jsonData = JSON.parse(valueMessage);
    }
  });

  connection.on('close', function (reasonCode, description) {
    console.log('Client terputus');
  });
});

server.listen(3000, function () {
  console.log('Server berjalan pada port 3000');
});
