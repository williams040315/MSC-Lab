/********************
 * Author: Williams BRETT 
 * PI: Sandra Lerouge
 * Subject: mesure de periode base fréquence
 * Info: range of measurment : < 1kHz  
 ********************/

const byte A = 2; 
float compteurA = 0 ;
float dateEvent = 0.000000000000000000000000;

void setup () {
  Serial.begin(57600);
  pinMode (A, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(A), ISR_A, RISING); //déclenchement sur front montant  
  cli(); // Désactive l'interruption globale
  TCCR1A = 0;
  TCCR1B = 0b00000001; // prediviseur 1024, duree de pas 64 µs, ICES1 front descendant
  TIMSK1 = 0b00100001; // autorisation interruption TOV et Input Capture
  TCNT1 = 0; 
  ICR1 = 0; 
  sei(); // Active l'interruption globale
}

ISR(TIMER1_OVF_vect) {
  compteurA++; 
}

void ISR_A(){
  dateEvent = (compteurA * 65536  + ICR1) * 62,5 * pow(10,-9);
  Serial.println(String(dateEvent));
  TCNT1 = 0;
  compteurA = 0;
}
 
void loop () {
}
