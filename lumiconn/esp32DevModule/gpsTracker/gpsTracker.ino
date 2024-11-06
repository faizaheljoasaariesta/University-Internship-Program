#include <TinyGPS++.h>
#include <HardwareSerial.h>

HardwareSerial GPSSerial(1);
TinyGPSPlus gps;
const int timezoneOffset = 7;

void setup() {
  Serial.begin(115200);
  GPSSerial.begin(9600, SERIAL_8N1, 16, 17);
  Serial.println("GPS Mulai");
}

void loop() {
  while (GPSSerial.available()) {
    gps.encode(GPSSerial.read());
  }

  // Location (Latitude and Longitude)
  Serial.print(F("Location: "));
  if (gps.location.isValid()) {
    Serial.print(gps.location.lat(), 6);
    Serial.print(F(","));
    Serial.println(gps.location.lng(), 6);
  } else {
    Serial.println(F("INVALID"));
  }

  // Altitude
  Serial.print(F("Altitude: "));
  if (gps.altitude.isValid()) {
    Serial.print(gps.altitude.meters());
    Serial.println(F(" meters"));
  } else {
    Serial.println(F("INVALID"));
  }

  // Speed
  Serial.print(F("Speed: "));
  if (gps.speed.isValid()) {
    Serial.print(gps.speed.kmph());
    Serial.println(F(" km/h"));
  } else {
    Serial.println(F("INVALID"));
  }

  // Course
  Serial.print(F("Course: "));
  if (gps.course.isValid()) {
    Serial.print(gps.course.deg());
    Serial.println(F(" degrees"));
  } else {
    Serial.println(F("INVALID"));
  }

  // Date
  Serial.print(F("Date: "));
  if (gps.date.isValid()) {
    Serial.print(gps.date.day());
    Serial.print(F("/"));
    Serial.print(gps.date.month());
    Serial.print(F("/"));
    Serial.println(gps.date.year());
  } else {
    Serial.println(F("INVALID"));
  }

  // Tampilkan waktu dengan penyesuaian zona waktu
  Serial.print(F("Local Time: "));
  if (gps.time.isValid()) {
    int localHour = gps.time.hour() + timezoneOffset;

    // Menyesuaikan jika waktu lebih dari 24 atau kurang dari 0
    if (localHour >= 24) localHour -= 24;
    if (localHour < 0) localHour += 24;

    Serial.print(localHour);
    Serial.print(F(":"));
    Serial.print(gps.time.minute());
    Serial.print(F(":"));
    Serial.println(gps.time.second());
  } else {
    Serial.println(F("INVALID"));
  }

  // Satellites
  Serial.print(F("Satellites: "));
  if (gps.satellites.isValid()) {
    Serial.println(gps.satellites.value());
  } else {
    Serial.println(F("INVALID"));
  }

  // HDOP
  Serial.print(F("HDOP: "));
  if (gps.hdop.isValid()) {
    Serial.println(gps.hdop.value());
  } else {
    Serial.println(F("INVALID"));
  }

  delay(500);
}
