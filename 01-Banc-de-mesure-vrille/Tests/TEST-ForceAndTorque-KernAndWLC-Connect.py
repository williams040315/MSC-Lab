import numpy
import serial
import time
import datetime
import os
import binascii
import argparse
import re
from signal import signal, SIGINT
from sys import exit

os.system('clear')
								
# External args
ap = argparse.ArgumentParser()
ap.add_argument("-t", "--tacq", type=float, required=True, help="time in s to write datas in output file")
args = vars(ap.parse_args())
tacq = args["tacq"]

# User informations
input("> Switch on VLC-Connect & press ENTER to continue ....")

# Balance KERN PLS
print('> Connect Kern PLS - Balance > Done')
serKern = serial.Serial('/dev/ttyUSB0', 9600, timeout=1, writeTimeout=1)
serKern.flushInput()
serKern.flushOutput()

# Deconnect WLC Connect - Torqmeter :
print('> Deconnect WLC Connect - Torqmeter')
cmd="sudo bt-device -r 80:1F:12:B6:DB:16"
os.system(cmd)

# Create virtual port comm
print('> Connect WLC Connect - Torqmeter Create virtual port comm')
cmd="sudo rfcomm bind 0 80:1F:12:B6:DB:16"    
os.system(cmd)

# Création du link serial avec Python
print('> Open virtual port comm')
serWLC = serial.Serial('/dev/rfcomm0', 9600, timeout=1)

# Globals variables
binary_string = ''			#
busySerial = False			#
freq_WLC = '0064'			# 100Hz 0x64 > 0064

# Globals functions
def frequencyDataLogger(freq_WLC):
	binary_string = binascii.unhexlify('0203F0'+freq_WLC+'03')
	print("> Frequency data logger", end='\n')
	serWLC.flushInput()
	serWLC.write(binary_string)
	return readAnswer()
	
def stopDataLogger():
	binary_string = binascii.unhexlify('0201F703')
	print("> Stop data logger", end='\n')
	serWLC.flushInput()
	serWLC.write(binary_string)
	return readAnswer()

def startDataLogger():
	binary_string = binascii.unhexlify('0201FD03')
	print("> Start data logger", end='\n')
	serWLC.flushInput()
	serWLC.write(binary_string)
	
def readAnswer():
	print('> Received data')
	bytes = serWLC.readline()
	return(bytes)

def readDataLogger():
	busySerial = True
	bytes = serWLC.read(40)
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

def handler(signal_received, frame):
	print('CTRL+C detected > finished')
	print('Resultats des mesures: ')
	cmd = 'more '+ saveData
	os.system(cmd)
	exit(0)
	
# Waiting configuration
time.sleep(5)
print('> Initialize WLC-Connect >> done',end='\n')

# Main soft
print('> Start main soft >>',end='\n')
answer = stopDataLogger()
answer = frequencyDataLogger(freq_WLC)
answer = startDataLogger()
countLoop = -1
print('> Pressed CTRL + C to quit ....')

print("> Lancement des mesures, patientez ....")
saveData = 'ForceAndTorque1_'+str(datetime.datetime.now().strftime('%Y-%m-%d_%Hh%M'))+'.dat'


while True:
	time.sleep(tacq)
	
	#Ecriture du temps
	cetemps = str(datetime.datetime.now().strftime('%Y-%m-%d-%H:%M:%S '))
	
	#Balance
	bytesToRead = serKern.inWaiting()
	lectureBalance = serKern.read(bytesToRead)
	lecturestrBalance=str(lectureBalance)
	morceaux = lecturestrBalance.split(' ')	
	l=[]
	for m in morceaux:
		if m.find('.')>=0:
			#print(m)
			while 1:
				if m[0]=='b' or m[0]=="'":
					m=m[1:]
				elif m[-1]=="'":
					m=m[:-1]
				else:
					break
			l.append(float(m))
	valuesBalance=numpy.array(l)
	moyenneBalance = numpy.mean(valuesBalance)
	chaineBalance=str(moyenneBalance)

	#Torqmeter
	serWLC.flushInput()
	if busySerial == False:
		if countLoop >= 0:
			os.system('echo -n "'+cetemps+'" >> ' + saveData)
			answerWLC = readDataLogger() 
			goodDatasWLC = cleanAnswer(answerWLC)
			meanDatasWLC = numpy.mean(goodDatasWLC)
			count = countLoop * tacq
			try:
				os.system('echo  "'+chaineBalance+' '+str(meanDatasWLC)+'" >> ' + saveData)
				os.system('clear')
				print('> '+ saveData)
				print('> Mesures en cours, tacq = '+str(tacq)+(' s'))
				print('> '+cetemps+' p[g]='+chaineBalance+' c[mN.m]='+str(meanDatasWLC))
				print('> Pressed CTRL + C to quit ....')
			except TypeError:
				os.system('echo  "Problem" >> ' + saveData)
		countLoop = countLoop + 1 
	signal(SIGINT, handler)		

