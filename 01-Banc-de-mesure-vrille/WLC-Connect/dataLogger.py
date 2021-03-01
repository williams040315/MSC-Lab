import serial
import time
import datetime
import os
import binascii
import argparse
import re
import numpy
import keyboard

print('''
name:		dataLogger.py
date:		2020-10
author:	Julien, Drazen, Williams
lab:		MSC
room:		842A
explain:	drive the VLC-Connect module (bluetooth > virtual port com)	
''')

# User informations
print(' !!!!!!!!!!!! PLEASE CHECK IF VCL-CONNECT IS SWITCH ON !!!!!!!!!!!! ')
input("Switch on VLC-Connect & press any key to continue the program")

# Deconnect WLC Connect - Torqmeter :
print('> Deconnect WLC Connect - Torqmeter')
cmd="sudo bt-device -r 80:1F:12:B6:DB:16"
os.system(cmd)

# Create virtual port comm
print('> Create virtual port comm')
cmd="sudo rfcomm bind 0 80:1F:12:B6:DB:16"    
os.system(cmd)

# Création du link serial avec Python
print('> Open virtual port comm')
ser = serial.Serial('/dev/rfcomm0', 9600, timeout=1)

# External args
ap = argparse.ArgumentParser()
ap.add_argument("-t", "--tacq", type=float, required=True, help="time in s to write datas in output file")
ap.add_argument("-o", "--output", type=str, required=True, help="path to the output file data")
args = vars(ap.parse_args())
            
# Globals variables
binary_string = ''			#
busySerial = False			#
tacq = args["tacq"]			# writing time in a file (folder data)
fileData = args["output"]		# output file
freq_WLC = '0064'			# 100Hz 0x64 > 0064

# Globals functions
def frequencyDataLogger(freq_WLC):
	binary_string = binascii.unhexlify('0203F0'+freq_WLC+'03')
	print("> Frequency data logger", end='\n')
	ser.flushInput()
	ser.write(binary_string)
	return readAnswer()
	
def stopDataLogger():
	binary_string = binascii.unhexlify('0201F703')
	print("> Stop data logger", end='\n')
	ser.flushInput()
	ser.write(binary_string)
	return readAnswer()

def startDataLogger():
	binary_string = binascii.unhexlify('0201FD03')
	print("> Start data logger", end='\n')
	ser.flushInput()
	ser.write(binary_string)
	
def readAnswer():
	print('> Received data')
	bytes = ser.readline()
	return(bytes)

def readDataLogger():
	busySerial = True
	bytes = ser.read(40)
	busySerial = False
	return bytes

def cleanAnswer(answer):
	try : 
		answer = str(answer)
		datas = re.findall("(-)?([0-9]+)(.)([0-9]+)", answer)
		goodDatas = numpy.zeros((1, len(datas)), dtype = float)
		for data in range (len(datas)):
			build = ''
			for element in range (len(datas[data])) :
				build = build + datas[data][element]
			goodDatas[0][data] = float(build)
		return (goodDatas)	
	except ValueError:
		print('> No ASCII caractere valid') 
		
# Waiting configuration
time.sleep(5)
print('> Initialize WLC-Connect >> done',end='\n')

# Main soft
print('> Start main soft >>',end='\n')
answer = stopDataLogger()
#print(answer,end='\n')
answer = frequencyDataLogger(freq_WLC)
#print(answer,end='\n')
answer = startDataLogger()
#print(answer,end='\n')

# Read datas in continu
countLoop = -1
dataTorqmeter = open("data/"+fileData, "w")
print('> Capture, analyse & save data frame each '+str(tacq)+' s')
print('> Pressed q to quit ....')
while True:
	ser.flushInput()
	time.sleep(tacq)
	if busySerial == False:
		if countLoop >= 0:
			answer = readDataLogger() 
			goodDatas = cleanAnswer(answer)
			meanDatas = numpy.mean(goodDatas)
			date = datetime.datetime.now().strftime("%H:%M:%S")
			count = countLoop * tacq
			dataTorqmeter.write("%.*f" %(2, count)+'\t'+date+'\t'+str(meanDatas)+'\n')
			print("%.*f" %(2, count)+'\t'+date+'\t'+str(meanDatas),end='\n')
		countLoop = countLoop + 1 
			
	#if keyboard.is_pressed("q"):
	#	break			
dataTorqmeter.close()
print("<< Main soft finished, have a nive day !")
