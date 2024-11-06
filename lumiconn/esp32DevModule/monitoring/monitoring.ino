#include <WiFi.h>
#include <HTTPClient.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>

HardwareSerial GPSSerial(1);
TinyGPSPlus gps;
const int timezoneOffset = 7;

const char* ssid = "privatWiFiNotlyPublic";
const char* password = "faingganteng9";

void setup() {
  Serial.begin(115200);
  GPSSerial.begin(9600, SERIAL_8N1, 16, 17);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Menyambung ke WiFi...");
  }
  Serial.println("Terhubung ke WiFi");
}

void loop() {
  while (GPSSerial.available()) {
    gps.encode(GPSSerial.read());
  }

  // Periksa setiap data GPS, jika tidak valid set nilai null
  String latitude = gps.location.isValid() ? String(gps.location.lat(), 6) : "null";
  String longitude = gps.location.isValid() ? String(gps.location.lng(), 6) : "null";
  String altitude = gps.altitude.isValid() ? String(gps.altitude.meters()) : "null";
  String speed = gps.speed.isValid() ? String(gps.speed.kmph()) : "null";
  String course = gps.course.isValid() ? String(gps.course.deg()) : "null";
  String date = gps.date.isValid() ? "\"" + String(gps.date.day()) + "/" + String(gps.date.month()) + "/" + String(gps.date.year()) + "\"" : "null";

  // Penyesuaian waktu lokal dengan timezoneOffset
  String time;
  if (gps.time.isValid()) {
    int localHour = gps.time.hour() + timezoneOffset;
    if (localHour >= 24) localHour -= 24;
    if (localHour < 0) localHour += 24;
    time = "\"" + String(localHour) + ":" + String(gps.time.minute()) + ":" + String(gps.time.second()) + "\"";
  } else {
    time = "null";
  }

  String satellites = gps.satellites.isValid() ? String(gps.satellites.value()) : "null";
  String hdop = gps.hdop.isValid() ? String(gps.hdop.value()) : "null";

  // Membuat JSON payload dengan data-data yang sudah diatur
  String payload = "{";
  payload += "\"lat\": " + latitude + ",";
  payload += "\"lng\": " + longitude + ",";
  payload += "\"altitude\": " + altitude + ",";
  payload += "\"speed\": " + speed + ",";
  payload += "\"course\": " + course + ",";
  payload += "\"date\": " + date + ",";
  payload += "\"time\": " + time + ",";
  payload += "\"satellites\": " + satellites + ",";
  payload += "\"hdop\": " + hdop;
  payload += "}";

  // Kirim data jika terhubung dengan WiFi
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin("http://192.168.145.222:3000/api/gps");
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {
      Serial.println("Data sent successfully");
    } else {
      Serial.printf("Error sending data: %s\n", http.errorToString(httpResponseCode).c_str());
    }
    http.end();
  } else {
    Serial.println("WiFi not connected");
  }

  delay(1000); // Kirim data setiap 1 detik
}
