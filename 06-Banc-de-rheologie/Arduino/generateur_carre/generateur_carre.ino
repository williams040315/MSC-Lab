const byte Led = 13; // Pour utiliser la LED du module
#define LedToggle digitalWrite (Led, !digitalRead(Led))
long r = 256 - 1 ; // 1 * 8 µS = 8 µs
 
void setup (){
  pinMode (Led, OUTPUT);
/*  cli();                        //désactive l'interruption globale
  bitClear (TCCR2A, WGM20);
  bitClear (TCCR2A, WGM21); 
  TCCR2B = 0b00000101;          //pré-diviseur de fréquence
  TIMSK2 = 0b00000001;           //interruption locale
  //TCNT2 = r;
  sei();                        //autorise l'interruption globale*/
}
 
/*long varCompteur = 0;           // La variable compteur
ISR(TIMER2_OVF_vect){
    TCNT2 = r;                  // Rechargement du timer à r
    if (varCompteur++ > 10) {   // Incrémentation et a atteint 125 ?
      varCompteur = 0;          // On recommence un nouveau cycle
      LedToggle;
    }
}*/
void loop () {
    LedToggle;
   delayMicroseconds(100);
    LedToggle;
   delayMicroseconds(100);
}
