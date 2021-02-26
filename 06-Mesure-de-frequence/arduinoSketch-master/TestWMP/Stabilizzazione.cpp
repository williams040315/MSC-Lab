//=====================================================================================================
// IMU.c
// S.O.H. Madgwick
// 25th September 2010
//
// IMU.cpp
// Modified as class for arduino by Lestofante
// 27th December 2010
//=====================================================================================================
// Description:
//
// Quaternion implementation of the 'DCM filter' [Mayhony et al].
//
// User must define 'halfT' as the (sample period / 2), and the filter gains 'Kp' and 'Ki'.
//
// Global variables 'q0', 'q1', 'q2', 'q3' are the quaternion elements representing the estimated
// orientation.  See my report for an overview of the use of quaternions in this application.
//
// User must call 'IMUupdate()' every sample period and parse calibrated gyroscope ('gx', 'gy', 'gz')
// and accelerometer ('ax', 'ay', 'ay') data.  Gyroscope units are radians/second, accelerometer 
// units are irrelevant as the vector is normalised.
//
//=====================================================================================================

//----------------------------------------------------------------------------------------------------
// Header files

#include "Stabilizzazione.h"
//#include <math.h>

//----------------------------------------------------------------------------------------------------
// Definitions

float Kp = 10.0f;		// proportional gain governs rate of convergence to accelerometer/magnetometer
float Ki = 0.005f;		// integral gain governs rate of convergence of gyroscope biases
//#define Ki 0
float halfT = 0.00125f;		// half the sample period

//---------------------------------------------------------------------------------------------------
// Variable definitions

//float q0 = 1, q1 = 0, q2 = 0, q3 = 0;	// quaternion elements representing the estimated orientation
//float exInt = 0, eyInt = 0, ezInt = 0;	// scaled integral error

//====================================================================================================
// Function
//====================================================================================================

Stabilizzazione::Stabilizzazione(){
  exInt=0;
  eyInt=0;
  ezInt=0;
  q0=x=1;
  q1=y=0;
  q2=z=0;
  q3=w=0;
  
  sumTimePart0 = sumTimePart1 = sumTimePart2 = updateNumber = 0;
}

void Stabilizzazione::start(){
  Serial.println("Starting IMU");
  //imu.start();
}

void Stabilizzazione::update(float gx,float gy,float gz,float ax,float ay,float az) {
	
	
	time1 = micros();
	updateNumber++;
	
	float norm;
	float vx, vy, vz;
	float ex, ey, ez;
	
	//imu.update(deltaTmicros);
	
	sumTimePart0+= micros()-time1;
	time1 = micros();
	
	//float *data = imu.leggi();
	sumTimePart1+= micros()-time1;
	
	time1 = micros();
	
	//float gx=data[2], gy=-data[1], gz=data[0], ax=data[5], ay=-data[4],az=data[3];
	
        
	/*FOR DEBUG*/
        //float gx=data[2], gy=-data[1], gz=data[0], ax=0, ay=0,az=1;
        /*END FOR DEBUG*/
	
        //eliminate bad data:
        /*
        Serial.print(gx);
        Serial.print(" ");
        Serial.print(gy);
        Serial.print(" ");
        Serial.print(gz);
        Serial.print(" ");
        Serial.println();
        */
        if (ax==0 && ay==0 && az==0){
          //Serial.println("Accelerometer bad data");
          return;
        }

	// normalise the measurements

	norm = sqrt(ax*ax + ay*ay + az*az);
	ax = ax / norm;
	ay = ay / norm;
	az = az / norm;
/*
        norm = invSqrt(ax*ax + ay*ay + az*az);
        ax = ax * norm;
	ay = ay * norm;
	az = az * norm;
*/
	// estimated direction of gravity
	vx = 2*(q1*q3 - q0*q2);
	vy = 2*(q0*q1 + q2*q3);
	vz = q0*q0 - q1*q1 - q2*q2 + q3*q3;
        
	// error is sum of cross product between reference direction of field and direction measured by sensor
	ex = (ay*vz - az*vy);
	ey = (az*vx - ax*vz);
	ez = (ax*vy - ay*vx);


	// integral error scaled integral gain
	exInt = exInt + ex*Ki;
	eyInt = eyInt + ey*Ki;
	ezInt = ezInt + ez*Ki;

	// adjusted gyroscope measurements
	gx = gx + Kp*ex + exInt;
	gy = gy + Kp*ey + eyInt;
	gz = gz + Kp*ez + ezInt;
        
	// integrate quaternion rate and normalise
	q0 = q0 + (-q1*gx - q2*gy - q3*gz)*halfT;
	q1 = q1 + (q0*gx + q2*gz - q3*gy)*halfT;
	q2 = q2 + (q0*gy - q1*gz + q3*gx)*halfT;
	q3 = q3 + (q0*gz + q1*gy - q2*gx)*halfT;  
	
	// normalise quaternion

	norm = sqrt(q0*q0 + q1*q1 + q2*q2 + q3*q3);
	q0 = x = q0 / norm;
	q1 = y = q1 / norm;
	q2 = z = q2 / norm;
	q3 = w = q3 / norm;
	sumTimePart2+= micros()-time1;
/*
	norm = invSqrt(q0*q0 + q1*q1 + q2*q2 + q3*q3);
	q0 = q0 * norm;
	q1 = q1 * norm;
	q2 = q2 * norm;
	q3 = q3 * norm;
*/
}

void Stabilizzazione::setTime(float t){
  halfT = (t/1000000.0)/2.0;
  //Serial.print("halfT:");
  //Serial.println(halfT, 5);
}

float Stabilizzazione::invSqrt(float number) {
  long i;
  float x, y;
  const float f = 1.5F;

  x = number * 0.5F;
  y = number;
  i = * ( long * ) &y;
  i = 0x5f375a86 - ( i >> 1 );
  y = * ( float * ) &i;
  y = y * ( f - ( x * y * y ) );
  return y;
}

void Stabilizzazione::setKi(float i){
  Ki=i;
}

void Stabilizzazione::setKp(float p){
  Kp=p;
}

float Stabilizzazione::getKi(){
  return Ki;
}

float Stabilizzazione::getKp(){
  return Kp;
}

void Stabilizzazione::debug(){
  Serial.print("orizon PI:");
  Serial.print( getKp() );
  Serial.print(" ");
  Serial.println( getKi() );
  
  Serial.print("halfT:");
  Serial.println(halfT, 5);
  /*
  float *data = imu.leggi();
  Serial.print("dati IMU:");
  for (int i=0;i<6;i++){
    Serial.print(" ");
    Serial.print(data[i]);
  }
  
  
  Serial.println();
  float g=0;
  for (int i=3;i<6;i++){
    g+=data[i]*data[i];
  }
  g=sqrt(g);
  Serial.print("Gravity:");
  Serial.println(g);
  */
  Serial.print("Part0:");
  Serial.println(sumTimePart0/updateNumber);
  
  Serial.print("Part1:");
  Serial.println(sumTimePart1/updateNumber);
  
  Serial.print("Part2:");
  Serial.println(sumTimePart2/updateNumber);
  sumTimePart0 = sumTimePart1 = sumTimePart2 = updateNumber = 0;
  //imu.debug();
}
