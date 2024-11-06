const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const nmea = require('nmea-simple');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

const serviceAccount = require('../config/lumiconn-60b88-firebase-adminsdk-ztmry-4ca0db4331.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
dotenv.config();

let gpsData = {
  location: { latitude: null, longitude: null },
  altitude: null,
  speed: null,
  course: null,
  date: null,
  localTime: null,
  hdop: null,
  fixType: null,
  satellitesInView: null,
  pdop: null,
  vdop: null,
  geoidalSeparation: null,
  faaMode: null
};

const gpsPort = new SerialPort({ path: process.env.GPS_PORT_PATH, baudRate: 9600 });
const parser = gpsPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

function updateGPSData(data) {
  try {
    const sentence = nmea.parseNmeaSentence(data);

    if (sentence.sentenceId === 'RMC') {
      gpsData.location = {
        latitude: sentence.latitude || gpsData.location.latitude,
        longitude: sentence.longitude || gpsData.location.longitude
      };
      gpsData.speed = sentence.speedKnots ? (sentence.speedKnots * 1.852).toFixed(2) : gpsData.speed;
      gpsData.course = sentence.trackTrue || gpsData.course;
      gpsData.date = sentence.datetime ? `${sentence.datetime.getUTCDate()}/${sentence.datetime.getUTCMonth() + 1}/${sentence.datetime.getUTCFullYear()}` : gpsData.date;
      gpsData.localTime = sentence.datetime ? `${(sentence.datetime.getUTCHours() + 7) % 24}:${String(sentence.datetime.getUTCMinutes()).padStart(2, '0')}:${String(sentence.datetime.getUTCSeconds()).padStart(2, '0')}` : gpsData.localTime;
    }

    if (sentence.sentenceId === 'GGA') {
      gpsData.altitude = sentence.altitudeMeters || gpsData.altitude;
      gpsData.satellitesInView = sentence.satellitesInView || gpsData.satellitesInView;
      gpsData.hdop = sentence.horizontalDilution || gpsData.hdop;
      gpsData.geoidalSeparation = sentence.geoidalSeparation || gpsData.geoidalSeparation;
    }

    if (sentence.sentenceId === 'GSA') {
      gpsData.fixType = sentence.fixMode || gpsData.fixType;
      gpsData.pdop = sentence.PDOP || gpsData.pdop;
      gpsData.vdop = sentence.VDOP || gpsData.vdop;
    }

    if (sentence.sentenceId === 'GLL') {
      gpsData.location = {
        latitude: sentence.latitude || gpsData.location.latitude,
        longitude: sentence.longitude || gpsData.location.longitude
      };
    }

    if (sentence.sentenceId === 'VTG') {
      gpsData.speed = sentence.speedKmph || gpsData.speed;
      gpsData.course = sentence.trackTrue || gpsData.course;
    }

    if (sentence.sentenceId === 'RMC') {
      gpsData.faaMode = sentence.faaMode || gpsData.faaMode;
    }

  } catch (error) {
    console.log("Invalid NMEA sentence:", data);
  }
}

parser.on('data', (data) => {
  if (data.startsWith('$G')) {
    updateGPSData(data);
  }
});

function updateGPSDataInFirestore(gpsData) {
  const gpsRef = db.collection('gpsRaspaberryPi0').doc('uZdjnzjR6UB14qGfGJNW');
  
  gpsRef.update({
    location: gpsData.location,
    altitude: gpsData.altitude,
    speed: gpsData.speed,
    course: gpsData.course,
    date: gpsData.date,
    localTime: gpsData.localTime,
    hdop: gpsData.hdop,
    fixType: gpsData.fixType,
    satellitesInView: gpsData.satellitesInView,
    pdop: gpsData.pdop,
    vdop: gpsData.vdop,
    geoidalSeparation: gpsData.geoidalSeparation,
    faaMode: gpsData.faaMode,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  })
  .catch((error) => {
    console.error("Error memperbarui data GPS ke Firestore: ", error);
  });
}

function getGPSData() {
  return gpsData;
}

setInterval(() => {
  const gpsData = getGPSData();
  updateGPSDataInFirestore(gpsData);
}, 5000);

module.exports = {
  getGPSData
};
