#include <WiFi.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>
#include <FirebaseESP32.h>

#define FIREBASE_HOST "monitoring-gps-tracker-95bbc-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "HtWiZTgeoERvyHvpeLej0EOCuMUup5tH8lOBciek"

FirebaseData firebaseData;
FirebaseConfig config;
FirebaseAuth auth;
FirebaseJson json;

HardwareSerial GPSSerial(1);
TinyGPSPlus gps;

const char* ssid = "privatWiFiNotlyPublic";
const char* password = "faingganteng9";

void setup() {
  Serial.begin(115200);
  GPSSerial.begin(9600, SERIAL_8N1, 16, 17);

  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Menyambung ke WiFi...");
  }
  Serial.println("Terhubung ke WiFi");

  Firebase.begin(&config, &auth);
  firebaseData = new FirebaseData();

  Firebase.reconnectWiFi(true);
}

void loop() {
  while (GPSSerial.available()) {
    gps.encode(GPSSerial.read());
  }

  String latitude = gps.location.isValid() ? String(gps.location.lat(), 6) : "null";
  String longitude = gps.location.isValid() ? String(gps.location.lng(), 6) : "null";
  String altitude = gps.altitude.isValid() ? String(gps.altitude.meters()) : "null";
  String speed = gps.speed.isValid() ? String(gps.speed.kmph()) : "null";
  String course = gps.course.isValid() ? String(gps.course.deg()) : "null";
  String date = gps.date.isValid() ? "\"" + String(gps.date.day()) + "/" + String(gps.date.month()) + "/" + String(gps.date.year()) + "\"" : "null";
  String satellites = gps.satellites.isValid() ? String(gps.satellites.value()) : "null";
  String hdop = gps.hdop.isValid() ? String(gps.hdop.value()) : "null";

  json.set("latitude", latitude);
  json.set("longitude", longitude);
  json.set("altitude", altitude);
  json.set("speed", speed);
  json.set("course", course);
  json.set("date", date);
  json.set("satellites", satellites);
  json.set("hdop", hdop);

  if (WiFi.status() == WL_CONNECTED) {
    if (Firebase.RTDB.setJSON(&firebaseData, "/gps_data", &json)) {
      Serial.println("Data berhasil dikirim ke Firebase");
    } else {
      Serial.println("Gagal mengirim data ke Firebase");
    }
  } else {
    Serial.println("WiFi not connected");
  }

  delay(1000);
}
