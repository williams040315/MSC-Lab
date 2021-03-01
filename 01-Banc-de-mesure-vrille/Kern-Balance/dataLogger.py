
import numpy as np
import serial
import time
import datetime
import os

# pour la petite balance KERN PLS
ser = serial.Serial('/dev/ttyUSB0', 9600, timeout=1, writeTimeout=1)#, xonxoff=False, rtscts=False, dsrdtr=False) #Tried with and without the last 3 parameters, and also at 1Mbps, same happens.

# le menu de la kern est un  peu relou : il faut acceder au menu par appuii long
#1"baud rt".et il faut changer deux sous menus : baud rate = 9600
#2."pc prnt" menu mettre la balance en printer mode = "pc cont"
#print pour valider 
#et menu long pour sortir dnas le muni simple
# pour la grosse balance Sartorius:
#ser = serial.Serial('/dev/serial/by-id/usb-Prolific_Technology_Inc._USB-Serial_Controller_D-if00-port0', 9600, timeout=1, writeTimeout=1)#, xonxoff=False, rtscts=False, dsrdtr=False) #Tried with and without the last 3 parameters, and also at 1Mbps, same happens.

ser.flushInput()
ser.flushOutput()

print("debut des mesures")
nom = 'mesures_poids_balance_'+str(datetime.datetime.now().strftime('%Y-%m-%d_%Hh%M'))+'.dat'

os.system('echo "# temps (%Y %m %d %H %M %S)  poids (g) " >> '+nom)

while True:
	time.sleep(0.5)
	bytesToRead = ser.inWaiting()
	lecture = ser.read(bytesToRead)
	lecturestr=str(lecture)
	morceaux = lecturestr.split(' ')	
	l=[]
	for m in morceaux:
		if m.find('.')>=0:
			print(m)
			while 1:
				if m[0]=='b' or m[0]=="'":
					m=m[1:]
				elif m[-1]=="'":
					m=m[:-1]
				else:
					break
			print(m)
			l.append(float(m))
	values=np.array(l)
	# ~ print(values)
	print(np.mean(values))
	# ~ print(np.std(values))
	moyenne = np.mean(values)
	chaine=str(moyenne)
	cetemps = str(datetime.datetime.now().strftime('%Y %m %d %H %M %S '))
	os.system('echo -n "'+cetemps+'" >> ' + nom)

	try:
		os.system('echo  "'+chaine+'" >> ' + nom)
	except TypeError:
		os.system('echo  "Problem" >> ' + nom)



