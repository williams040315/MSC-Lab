import numpy as np
import serial
import time
from datetime import date
import datetime
import os
import binascii

dataTorqmeter = open("dataTorqmeter_test1.txt", "w")
tacq = 1 # in second

            
#globals variables
binary_string = ''

#globals functions
def frequencyDataLogging():
	binary_string = binascii.unhexlify('0203F000FA030D')
	print("> Frequency data logging", end='\n')
	ser.write(binary_string)
	return readAnswer()
	
def stopDataLogging():
	binary_string = binascii.unhexlify('0201F7030D')
	print("> Stop data logging", end='\n')
	ser.write(binary_string)
	return readAnswer(False)

def startDataLogging():
	binary_string = binascii.unhexlify('0201FD030D')
	print("> Start data logging", end='\n')
	ser.write(binary_string)
	
def capacitySensor():
	binary_string = binascii.unhexlify('0201D4030D')
	print("> Request Capacity sensor", end='\n')
	ser.write(binary_string)
	return readAnswer()
	
def unitySensor():
	binary_string = binascii.unhexlify('0201D5030D')
	print("> Request Unity sensor", end='\n')
	ser.write(binary_string)
	return readAnswer()
	
def readAnswer(saveData):
	print('> Received data')
	if saveData == True:
		dataTorqmeter.write(str(date.today())+'\t')
	while True:
		bytes = ser.read(1)
		if bytes == b'\r' or len(bytes)==0:
			if saveData == True:
				dataTorqmeter.write("\n")
			break
		else :
			print(bytes)
			if saveData == True:
				dataTorqmeter.write(bytes.decode('ASCII'))
	return('> Read done')



#Main soft
time.sleep(3)
print('> Start main soft',end='\n')

#stopping datalogger block, update boolean to True 	
if False:
	#Deconnexion du module WLC Connect - Torqmeter :
	cmd="sudo bt-device -r 80:1F:12:B6:DB:16"
	os.system(cmd)
	#Créer le port serie virtuel + jumelage
	cmd="sudo rfcomm bind 0 80:1F:12:B6:DB:16"    
	os.system(cmd)
	#Création du link serial avec Python
	ser = serial.Serial('/dev/rfcomm0', 9600, timeout=1)
	time.sleep(2)
	answer = stopDataLogging()
	print(answer,end='\n')
	
#frequency datalogger block, update boolean to True 	
if False :
	#Deconnexion du module WLC Connect - Torqmeter :
	cmd="sudo bt-device -r 80:1F:12:B6:DB:16"
	os.system(cmd)
	#Créer le port serie virtuel + jumelage
	cmd="sudo rfcomm bind 0 80:1F:12:B6:DB:16"    
	os.system(cmd)
	#Création du link serial avec Python
	ser = serial.Serial('/dev/rfcomm0', 9600, timeout=1)
	time.sleep(2)
	answer = frequencyDataLogging()
	print(answer,end='\n')

#capacity sensor block, update boolean to True 	
if False:
	#Deconnexion du module WLC Connect - Torqmeter :
	cmd="sudo bt-device -r 80:1F:12:B6:DB:16"
	os.system(cmd)
	#Créer le port serie virtuel + jumelage
	cmd="sudo rfcomm bind 0 80:1F:12:B6:DB:16"    
	os.system(cmd)
	#Création du link serial avec Python
	ser = serial.Serial('/dev/rfcomm0', 9600, timeout=1)
	time.sleep(2)
	answer = capacitySensor()
	print(answer,end='\n')

#unity sensor block, update boolean to True 	
if False:
	#Deconnexion du module WLC Connect - Torqmeter :
	cmd="sudo bt-device -r 80:1F:12:B6:DB:16"
	os.system(cmd)
	#Créer le port serie virtuel + jumelage
	cmd="sudo rfcomm bind 0 80:1F:12:B6:DB:16"    
	os.system(cmd)
	#Création du link serial avec Python
	ser = serial.Serial('/dev/rfcomm0', 9600, timeout=1)
	time.sleep(2)
	answer = unitySensor()
	print(answer,end='\n')

	
#starting datalogger block, update boolean to True (if and while)	
if True:
	#Deconnexion du module WLC Connect - Torqmeter :
	cmd="sudo bt-device -r 80:1F:12:B6:DB:16"
	os.system(cmd)
	#Créer le port serie virtuel + jumelage
	cmd="sudo rfcomm bind 0 80:1F:12:B6:DB:16"    
	os.system(cmd)
	#Création du link serial avec Python
	ser = serial.Serial('/dev/rfcomm0', 9600, timeout=1)
	time.sleep(2)
	startDataLogging()
	
	#wait 
	answer = readAnswer(False) 
	answer = readAnswer(False) 
	answer = readAnswer(False) 
	answer = readAnswer(False) 
	answer = readAnswer(False) 
	answer = readAnswer(False) 
	answer = readAnswer(False) 
	time.sleep(2)
	
while True:
	answer = readAnswer(True) 
	print(answer,end='\n')
	#time.sleep(tacq)
	
dataTorqmeter.close()
print("Finished")
	
