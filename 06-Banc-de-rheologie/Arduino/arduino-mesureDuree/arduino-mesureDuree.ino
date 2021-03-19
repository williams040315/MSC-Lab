
#include "Arduino.h"

char readPin = 2; // lecture et RAZ compteur
char startPin = 3; // facultatif : RAZ compteur
float clock_period;
uint16_t diviseur[6] = {0,1,8,64,256,1024};
volatile int32_t high_count;
                   
void config_timer(uint8_t clock) {
  /*  clock_period = 1.0/F_CPU*diviseur[clock];
    cli();
    TCCR1A = 0; // normal counting
    TCCR1B = 0;
    TIMSK1 = (1<<TOIE1); // Overflow interrupt 
    sei();
    high_count = 0;
    TCCR1B |= clock;
*/}
                    
ISR(TIMER1_OVF_vect) { // overflow interrupt
    high_count++;
    
}
                     
void start_counter() {
/*  TCNT1 = 0; // RAZ compteur
  high_count = 0;
  
*/}
                     
void read_counter() {
/*   uint32_t count;
   count = TCNT1;
   TCNT1 = 0;
   Serial.println(((high_count << 16) + count)*clock_period*1000000); // em ms
   high_count = 0;
*/}
                      
void setup() {
  Serial.begin(115200);
  pinMode(readPin,INPUT);
  pinMode(startPin,INPUT);
  attachInterrupt(digitalPinToInterrupt(startPin), start_counter, RISING);
  attachInterrupt(digitalPinToInterrupt(readPin), read_counter, RISING);
  config_timer(5);
  
}
                       
void loop() {
  digitalWrite(13, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(1000);                       // wait for a second
  digitalWrite(13, LOW);    // turn the LED off by making the voltage LOW
  delay(1000);   

}
                       
