/********************
 * Author: Williams BRETT 
 * PI: Sandra Lerouge
 * Input: 5
 * Subject: frequecemeter
 * Info: range of measurment : 1kHz and more (max: 8MHz) 
 ********************/
#include <FreqCount.h>
void setup() {
  Serial.begin(57600);
  FreqCount.begin(1000);
}
void loop() {
  if (FreqCount.available()) {
    unsigned long count = FreqCount.read();
    Serial.println(count);
  }
}
