#include <WiFi.h>
#include <WebSocketsClient.h>
#include <AccelStepper.h>
#include <ArduinoJson.h>
#include <Fuzzy.h>

Fuzzy *fuzzy = new Fuzzy();

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

float calibrate = 12;

int currentBearing = 0;
int targetBearing = 0;

void setup() {
  Serial.begin(115200);
  delay(10);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi Terhubung");

  webSocket.begin(serverAddress, serverPort);
  webSocket.onEvent(onWebSocketEvent);
  Serial.println("WebSocket Terhubung");

  FuzzyInput *inputBearing = new FuzzyInput(1);
  FuzzySet *bearingNorth = new FuzzySet(0, 0, 5, 30);               // Utara
  FuzzySet *bearingNortheast = new FuzzySet(15, 40, 50, 75);        // Timur Laut
  FuzzySet *bearingEast = new FuzzySet(60, 85, 95, 120);            // Timur
  FuzzySet *bearingSoutheast = new FuzzySet(105, 130, 140, 165);    // Tenggara
  FuzzySet *bearingSouth = new FuzzySet(150, 175, 185, 210);        // Selatan
  FuzzySet *bearingSouthwest = new FuzzySet(195, 220, 230, 255);    // Barat Daya
  FuzzySet *bearingWest = new FuzzySet(240, 265, 275, 300);         // Barat
  FuzzySet *bearingNorthwest = new FuzzySet(285, 310, 335, 360);    // Barat Laut
  
  inputBearing->addFuzzySet(bearingNorth);
  inputBearing->addFuzzySet(bearingNortheast);
  inputBearing->addFuzzySet(bearingEast);
  inputBearing->addFuzzySet(bearingSoutheast);
  inputBearing->addFuzzySet(bearingSouth);
  inputBearing->addFuzzySet(bearingSouthwest);
  inputBearing->addFuzzySet(bearingWest);
  inputBearing->addFuzzySet(bearingNorthwest);
  
  fuzzy->addFuzzyInput(inputBearing);
  
  FuzzyOutput *outputRotation = new FuzzyOutput(1);
  FuzzySet *rotateStay = new FuzzySet(-22.5, -5, 5, 22.5);              // Tetap
  FuzzySet *rotateSlightRight = new FuzzySet(22.5, 40, 50, 67.5);       // Sedikit Kanan
  FuzzySet *rotateRight = new FuzzySet(67.5, 85, 95, 112.5);            // Kanan
  FuzzySet *rotateMoreRight = new FuzzySet(112.5, 130, 140, 157.5);     // Lebih Kanan
  FuzzySet *rotateFullRight = new FuzzySet(157.5, 175, 180, 180);       // Kanan Penuh
  FuzzySet *rotateMoreLeft = new FuzzySet(-157.5, -140, -130, -112.5);  // Lebih Kiri
  FuzzySet *rotateLeft = new FuzzySet(-112.5, -95, -85, -67.5);         // Kiri
  FuzzySet *rotateSlightLeft = new FuzzySet(-67.5, -40, -30, -22.5);    // Sedikit Kiri
  FuzzySet *rotateFullLeft = new FuzzySet(-180, -175, -165, -157.5);    // Kiri Penuh
  
  outputRotation->addFuzzySet(rotateStay);
  outputRotation->addFuzzySet(rotateSlightRight);
  outputRotation->addFuzzySet(rotateRight);
  outputRotation->addFuzzySet(rotateMoreRight);
  outputRotation->addFuzzySet(rotateFullRight);
  outputRotation->addFuzzySet(rotateMoreLeft);
  outputRotation->addFuzzySet(rotateLeft);
  outputRotation->addFuzzySet(rotateSlightLeft);
  outputRotation->addFuzzySet(rotateFullLeft);
  
  fuzzy->addFuzzyOutput(outputRotation);
  
  FuzzyRuleAntecedent *ifBearingNorth = new FuzzyRuleAntecedent();
  ifBearingNorth->joinSingle(bearingNorth);                                 
  FuzzyRuleConsequent *thenRotationStay = new FuzzyRuleConsequent();
  thenRotationStay->addOutput(rotateStay);                                  
  FuzzyRule *fuzzyRule1 = new FuzzyRule(1, ifBearingNorth, thenRotationStay);
  fuzzy->addFuzzyRule(fuzzyRule1);
  
  FuzzyRuleAntecedent *ifBearingNortheast = new FuzzyRuleAntecedent();
  ifBearingNortheast->joinSingle(bearingNortheast);                         
  FuzzyRuleConsequent *thenRotationSlightRight = new FuzzyRuleConsequent();
  thenRotationSlightRight->addOutput(rotateSlightRight);                    
  FuzzyRule *fuzzyRule2 = new FuzzyRule(2, ifBearingNortheast, thenRotationSlightRight);
  fuzzy->addFuzzyRule(fuzzyRule2);
  
  FuzzyRuleAntecedent *ifBearingEast = new FuzzyRuleAntecedent();
  ifBearingEast->joinSingle(bearingEast);                                   
  FuzzyRuleConsequent *thenRotationRight = new FuzzyRuleConsequent();
  thenRotationRight->addOutput(rotateRight);                                
  FuzzyRule *fuzzyRule3 = new FuzzyRule(3, ifBearingEast, thenRotationRight);
  fuzzy->addFuzzyRule(fuzzyRule3);
  
  FuzzyRuleAntecedent *ifBearingSoutheast = new FuzzyRuleAntecedent();
  ifBearingSoutheast->joinSingle(bearingSoutheast);                         
  FuzzyRuleConsequent *thenRotationMoreRight = new FuzzyRuleConsequent();
  thenRotationMoreRight->addOutput(rotateMoreRight);                       
  FuzzyRule *fuzzyRule4 = new FuzzyRule(4, ifBearingSoutheast, thenRotationMoreRight);
  fuzzy->addFuzzyRule(fuzzyRule4);
  
  FuzzyRuleAntecedent *ifBearingSouth = new FuzzyRuleAntecedent();
  ifBearingSouth->joinSingle(bearingSouth);                                
  FuzzyRuleConsequent *thenRotationFullRight = new FuzzyRuleConsequent();
  thenRotationFullRight->addOutput(rotateFullRight);                       
  FuzzyRuleConsequent *thenRotationFullLeft = new FuzzyRuleConsequent();
  thenRotationFullLeft->addOutput(rotateFullLeft);                         
  FuzzyRule *fuzzyRule5 = new FuzzyRule(5, ifBearingSouth, thenRotationFullRight);
  FuzzyRule *fuzzyRule6 = new FuzzyRule(6, ifBearingSouth, thenRotationFullLeft);
  fuzzy->addFuzzyRule(fuzzyRule5);
  fuzzy->addFuzzyRule(fuzzyRule6);
  
  FuzzyRuleAntecedent *ifBearingSouthwest = new FuzzyRuleAntecedent();
  ifBearingSouthwest->joinSingle(bearingSouthwest);                       
  FuzzyRuleConsequent *thenRotationMoreLeft = new FuzzyRuleConsequent();
  thenRotationMoreLeft->addOutput(rotateMoreLeft);                        
  FuzzyRule *fuzzyRule7 = new FuzzyRule(7, ifBearingSouthwest, thenRotationMoreLeft);
  fuzzy->addFuzzyRule(fuzzyRule7);
  
  FuzzyRuleAntecedent *ifBearingWest = new FuzzyRuleAntecedent();
  ifBearingWest->joinSingle(bearingWest);                               
  FuzzyRuleConsequent *thenRotationLeft = new FuzzyRuleConsequent();
  thenRotationLeft->addOutput(rotateLeft);                               
  FuzzyRule *fuzzyRule8 = new FuzzyRule(8, ifBearingWest, thenRotationLeft);
  fuzzy->addFuzzyRule(fuzzyRule8);
  
  FuzzyRuleAntecedent *ifBearingNorthwest = new FuzzyRuleAntecedent();
  ifBearingNorthwest->joinSingle(bearingNorthwest);                      
  FuzzyRuleConsequent *thenRotationSlightLeft = new FuzzyRuleConsequent();
  thenRotationSlightLeft->addOutput(rotateSlightLeft);                   
  FuzzyRule *fuzzyRule9 = new FuzzyRule(9, ifBearingNorthwest, thenRotationSlightLeft);
  fuzzy->addFuzzyRule(fuzzyRule9);

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
        Serial.print("Gagal parse pesan: ");
        Serial.println(error.f_str());
        return;
      }

      const char* actived = doc["data"][0];
      const char* mode = doc["data"][1];
      int bearing = doc["data"][2];

      if (strcmp(actived, "on") == 0) {
        Serial.print("mode: ");
        Serial.println(mode);

        if (strcmp(mode, "auto") == 0) {
          fuzzy->setInput(1, bearing);
          fuzzy->fuzzify();
          
          float rotation = fuzzy->defuzzify(1);

          targetBearing = bearing;

          Serial.print("Bearing     : ");
          Serial.println(bearing);
          Serial.print("Rotasi motor: ");
          Serial.println(rotation);

          if (rotation < 0) {
            rotation = rotation - calibrate;
          } else if (rotation > 0) {
            rotation = rotation + calibrate;
          }
          
          stepper.moveTo(rotation * (2048 / 360));

        } else if (strcmp(mode, "manual") == 0) {
          targetBearing = bearing;
          int stepsToMove = calculateStepsToMove(currentBearing, targetBearing);

          if (stepsToMove != 0) {
            stepper.moveTo(stepper.currentPosition() + stepsToMove);
          }

          currentBearing = targetBearing;
          Serial.print("Bearing: ");
          Serial.println(bearing);
        }
      } else if (strcmp(actived, "off") == 0) {
        int stepsToMove = calculateStepsToMove(currentBearing, 0);

        if (stepsToMove != 0) {
          stepper.moveTo(stepper.currentPosition() + stepsToMove);
        }

        currentBearing = 0;
        Serial.println("Kembali ke posisi awal (Utara)");
      }
      break;
  }
}

int calculateStepsToMove(int currentBearing, int targetBearing) {
  int stepsToMove = targetBearing - currentBearing;
  int setStep = 2048 / 360;

  if (stepsToMove > 180 || stepsToMove < -180) {
    stepsToMove = (stepsToMove > 0) ? stepsToMove - 360 : stepsToMove + 360;
  }

  if (stepsToMove == 180) {
    stepsToMove = 180;
  } else if (stepsToMove == -180) {
    stepsToMove = -180; 
  }

  return stepsToMove * setStep;
}

