#include <FreqPeriodCounter.h>

double lfrq;
long int pp;
//Use pin 25 for a faster interrupt since it's the first pin on PIOD.
int periodPin = 25;
int frequency = 40000; //Frequency to generate on pin 7.

void setup() {
  Serial.begin(115200);
  FreqPeriod::begin(periodPin); 
  Serial.println("FreqPeriod Library Test");

}

void loop() {
  pp = FreqPeriod::getPeriod();
  if (pp){
  
    Serial.print("period: ");
    Serial.print(pp);
    Serial.print(" 1/42us  /  frequency: ");

    lfrq= 42000000 / pp;
    Serial.print(lfrq);
    Serial.print(" Hz");
    Serial.println();
  }

}
