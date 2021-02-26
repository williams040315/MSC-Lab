#include <Wire.h>
#include "Adafruit_MCP9808.h"

// Create the MCP9808 temperature sensor object
Adafruit_MCP9808 tempsensor = Adafruit_MCP9808();

void setup() {
  Serial.begin(9600);
  while (!Serial); //waits for serial terminal to be open, necessary in newer arduino boards.
  if (!tempsensor.begin(0x18)) {
    while (1);
  }

  tempsensor.setResolution(3); // sets the resolution mode of reading, the modes are defined in the table bellow:
  // Mode Resolution SampleTime
  //  0    0.5°C       30 ms
  //  1    0.25°C      65 ms
  //  2    0.125°C     130 ms
  //  3    0.0625°C    250 ms
  //Serial.print("ON\n");
}

void printCelsius() {
  tempsensor.wake();
  float c = tempsensor.readTempC();
  Serial.print(c, 4);
  Serial.print("\n");
  tempsensor.shutdown_wake(1);
}

void printFahrenheit() {
  tempsensor.wake();
  float f = tempsensor.readTempF();
  Serial.print(f, 4);
  Serial.print("\n");
  tempsensor.shutdown_wake(1);
}

void loop() {
  printCelsius();
  delay(1000);
  
  /*while (Serial.available() > 0) {
      int input = Serial.parseInt();
      if (Serial.read() == '\n') {
          if (input == 1) {
            printCelsius();
          }
          if (input == 2) {
            printFahrenheit();
          }
      }
  }*/
}
