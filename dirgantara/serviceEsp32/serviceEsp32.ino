#include <WiFi.h>
#include <WebSocketsClient.h>
#include <AccelStepper.h>
#include <ArduinoJson.h>

const char* ssid = "FT2300";
const char* password = "";
const char* serverAddress = "10.110.180.231";
const int serverPort = 3000;

WebSocketsClient webSocket;

#define IN1 12
#define IN2 14
#define IN3 27
#define IN4 26

AccelStepper stepper(AccelStepper::FULL4WIRE, IN2, IN4, IN1, IN3);

int currentBearing = 0;
int targetBearing = 0;

float membershipDegree(float value, float a, float b, float c, float d) {
  if (value <= a || value >= d) return 0.0;
  if (value > a && value <= b) return (value - a) / (b - a);
  if (value > b && value <= c) return 1.0;
  if (value > c && value < d) return (d - value) / (d - c);
  return 0.0;
}

float calculateFuzzySpeed(int bearing) {
  float small = membershipDegree(bearing, 0, 0, 50, 100);
  float medium = membershipDegree(bearing, 50, 100, 100, 150);
  float large = membershipDegree(bearing, 100, 150, 200, 200);

  float slow = 500;
  float normal = 1000;
  float fast = 2000;

  float numerator = small * slow + medium * normal + large * fast;
  float denominator = small + medium + large;

  if (denominator == 0) return 0;
  return numerator / denominator;
}

void setup() {
  Serial.begin(115200);
  delay(10);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi Connected");

  webSocket.begin(serverAddress, serverPort);
  webSocket.onEvent(onWebSocketEvent);
  Serial.println("WebSocket connected");

  stepper.setMaxSpeed(2000);
  stepper.setAcceleration(500);
}

void loop() {
  webSocket.loop();
  stepper.run();
}

void onWebSocketEvent(WStype_t type, uint8_t *payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.println("Terputus dari server");
      webSocket.begin(serverAddress, serverPort);
      Serial.println("Terhubung ke server WebSocket");
      Serial.println(WiFi.localIP());
      break;
    case WStype_TEXT:
      Serial.print("Menerima pesan: ");
      Serial.println((char*)payload);
      
      StaticJsonDocument<200> doc;
      DeserializationError error = deserializeJson(doc, payload);
      if (error) {
        Serial.print("Failed to parse message: ");
        Serial.println(error.f_str());
        return;
      }

      const char* actived = doc["data"][0];
      const char* mode = doc["data"][1];
      int bearing = doc["data"][2];

      if (strcmp(actived, "on") == 0) {
        float motorSpeed = calculateFuzzySpeed(bearing);
        stepper.setSpeed(motorSpeed);

        int stepsToMove = bearing - currentBearing;
        if (stepsToMove > 180) {
          stepsToMove -= 360;
        } else if (stepsToMove < -180) {
          stepsToMove += 360;
        } 
        
        stepper.moveTo(stepper.currentPosition() + stepsToMove * (2000 / 360));
        currentBearing = bearing;
        Serial.print("Bearing: ");
        Serial.print(bearing);
        Serial.print(" Speed: ");
        Serial.println(motorSpeed);
      } else if (strcmp(actived, "off") == 0) {
        int stepsToMove = -currentBearing;
        stepper.moveTo(stepper.currentPosition() + stepsToMove * (2000 / 360));
        currentBearing = 0;
        Serial.println("Returning to initial position (North)");
      }
      break;
  }
}
