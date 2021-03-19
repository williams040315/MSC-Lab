/********************
 * Author: Williams BRETT 
 * PI: Sandra Lerouge
 * Input: 8
 * Subject: frequecemeter
 * Info: range of measurment : < 1kHz  
 ********************/
#include <FreqMeasure.h>

void setup() {
  Serial.begin(57600);
  FreqMeasure.begin();
}

double sum=0;
int count=0;

void loop() {
  if (FreqMeasure.available()) {
    // average several reading together
    sum = sum + FreqMeasure.read();
    count = count + 1;
    //if (count > 1000) {
      float frequency = FreqMeasure.countToFrequency(sum / count);
      Serial.println(frequency);
      sum = 0;
      count = 0;
    //}
  }
}
