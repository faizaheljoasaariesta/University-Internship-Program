#include <Fuzzy.h>

Fuzzy *fuzzy = new Fuzzy();

float bearing = 0; 
float rotation = 0;

void setup() {
  Serial.begin(115200);
  
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
  ifBearingNorth->joinSingle(bearingNorth);                                 // Utara
  FuzzyRuleConsequent *thenRotationStay = new FuzzyRuleConsequent();
  thenRotationStay->addOutput(rotateStay);                                  // Tetap
  FuzzyRule *fuzzyRule1 = new FuzzyRule(1, ifBearingNorth, thenRotationStay);
  fuzzy->addFuzzyRule(fuzzyRule1);
  
  FuzzyRuleAntecedent *ifBearingNortheast = new FuzzyRuleAntecedent();
  ifBearingNortheast->joinSingle(bearingNortheast);                         // Timur Laut
  FuzzyRuleConsequent *thenRotationSlightRight = new FuzzyRuleConsequent();
  thenRotationSlightRight->addOutput(rotateSlightRight);                    // Sedikit Kanan
  FuzzyRule *fuzzyRule2 = new FuzzyRule(2, ifBearingNortheast, thenRotationSlightRight);
  fuzzy->addFuzzyRule(fuzzyRule2);
  
  FuzzyRuleAntecedent *ifBearingEast = new FuzzyRuleAntecedent();
  ifBearingEast->joinSingle(bearingEast);                                   // Timur
  FuzzyRuleConsequent *thenRotationRight = new FuzzyRuleConsequent();
  thenRotationRight->addOutput(rotateRight);                                // Kanan
  FuzzyRule *fuzzyRule3 = new FuzzyRule(3, ifBearingEast, thenRotationRight);
  fuzzy->addFuzzyRule(fuzzyRule3);
  
  FuzzyRuleAntecedent *ifBearingSoutheast = new FuzzyRuleAntecedent();
  ifBearingSoutheast->joinSingle(bearingSoutheast);                         // Tenggara
  FuzzyRuleConsequent *thenRotationMoreRight = new FuzzyRuleConsequent();
  thenRotationMoreRight->addOutput(rotateMoreRight);                        // Lebih Kanan
  FuzzyRule *fuzzyRule4 = new FuzzyRule(4, ifBearingSoutheast, thenRotationMoreRight);
  fuzzy->addFuzzyRule(fuzzyRule4);
  
  FuzzyRuleAntecedent *ifBearingSouth = new FuzzyRuleAntecedent();
  ifBearingSouth->joinSingle(bearingSouth);                                // Selatan
  FuzzyRuleConsequent *thenRotationFullRight = new FuzzyRuleConsequent();
  thenRotationFullRight->addOutput(rotateFullRight);                       // Kanan Penuh
  FuzzyRuleConsequent *thenRotationFullLeft = new FuzzyRuleConsequent();
  thenRotationFullLeft->addOutput(rotateFullLeft);                         // Kiri Penuh
  FuzzyRule *fuzzyRule5 = new FuzzyRule(5, ifBearingSouth, thenRotationFullRight);
  FuzzyRule *fuzzyRule6 = new FuzzyRule(6, ifBearingSouth, thenRotationFullLeft);
  fuzzy->addFuzzyRule(fuzzyRule5);
  fuzzy->addFuzzyRule(fuzzyRule6);
  
  FuzzyRuleAntecedent *ifBearingSouthwest = new FuzzyRuleAntecedent();
  ifBearingSouthwest->joinSingle(bearingSouthwest);                       // Barat Daya
  FuzzyRuleConsequent *thenRotationMoreLeft = new FuzzyRuleConsequent();
  thenRotationMoreLeft->addOutput(rotateMoreLeft);                        // Lebih Kiri
  FuzzyRule *fuzzyRule7 = new FuzzyRule(7, ifBearingSouthwest, thenRotationMoreLeft);
  fuzzy->addFuzzyRule(fuzzyRule7);
  
  FuzzyRuleAntecedent *ifBearingWest = new FuzzyRuleAntecedent();
  ifBearingWest->joinSingle(bearingWest);                                 // Barat
  FuzzyRuleConsequent *thenRotationLeft = new FuzzyRuleConsequent();
  thenRotationLeft->addOutput(rotateLeft);                                // Kiri
  FuzzyRule *fuzzyRule8 = new FuzzyRule(8, ifBearingWest, thenRotationLeft);
  fuzzy->addFuzzyRule(fuzzyRule8);
  
  FuzzyRuleAntecedent *ifBearingNorthwest = new FuzzyRuleAntecedent();
  ifBearingNorthwest->joinSingle(bearingNorthwest);                       // Barat Laut
  FuzzyRuleConsequent *thenRotationSlightLeft = new FuzzyRuleConsequent();
  thenRotationSlightLeft->addOutput(rotateSlightLeft);                    // Sedikit Kiri
  FuzzyRule *fuzzyRule9 = new FuzzyRule(9, ifBearingNorthwest, thenRotationSlightLeft);
  fuzzy->addFuzzyRule(fuzzyRule9);
}

void loop() {
  bearing = getBearingFromWebSocket();
  
  fuzzy->setInput(1, bearing);
  
  fuzzy->fuzzify();
  
  rotation = fuzzy->defuzzify(1);
  
  controlStepperMotor(rotation);
  
  delay(1000);
}

float getBearingFromWebSocket() {
  return 257; // Contoh nilai sementara
}

void controlStepperMotor(float rotation) {
  Serial.print("Bearing     : ");
  Serial.println(bearing);
  Serial.print("Rotasi motor: ");
  Serial.println(rotation);
}
