
#include "Arduino.h"

char inputPin = 47; // entrée T5 pour Timer5
uint16_t diviseur[6] = {0,1,8,64,256,1024};
volatile uint16_t count;
                
void start_count(uint32_t period) {
  char clockBits;
  // Timer 3 : génération d'interruptions périodiques
  TCCR3A = 0;
  TCCR3A |= (1 << COM3A1) | (1 << COM3A0);
  TCCR3B = 1 << WGM13; // phase and frequency correct pwm mode, top = ICR3
  uint32_t icr = (F_CPU/1000000*period/2);
  int d = 1;
  while ((icr>0xFFFF)&&(d<5)) {
     d++;
     icr = (F_CPU/1000000*period/2/diviseur[d]);
   } 
  clockBits = d;
  ICR3 = icr;
  OCR3A = icr >> 1;
  TIMSK3 = 1 << TOIE3; // overflow interrupt enable
  TCNT3 = 0;
  
  
  // Timer 5 : compteur d'impulsion
  TCCR5A = 0;
  TCCR5B = 0;
  TCNT5 = 0;
  count = 0;
  
  sei();
  TCCR3B |= clockBits;
  TCCR5B |= (1 << CS32) | (1 << CS31) | (1 << CS30); // external clock on rising edge
  
}
                
ISR(TIMER3_OVF_vect) { // Overflow interrupt
   count = TCNT5;
   TCNT5 = 0;
   
}
                
void setup() {
  Serial.begin(115200);
  pinMode(47,INPUT);
  pinMode(6,OUTPUT);
  pinMode(5,OUTPUT);
  analogWrite(6,128); // sortie 6 branchée sur l'entrée 47  pour test
  start_count(1000000);
}
                
void loop() {
  delay(1000);
  Serial.println(count);
}
                