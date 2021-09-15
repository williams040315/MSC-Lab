# -*- coding: utf-8 -*-
"""
@author: williams brett
@lab: msc
@pi: sandra lerouge
@date: 28/06/2021
@descrition: connexion python <> NodeRed
"""

import serial
import binascii
from websocket import create_connection
from sys import exit

###############################################################################
def sendCmd(c):
    binary_string = binascii.unhexlify(c)
    ser.flushInput()
    ser.write(binary_string)
    bytes = ser.read(12)
#    if c =='4D860140693000000000009E':
#		vitesseMesuree = 0
    return len(bytes)
###############################################################################

###############################################################################
def handler(signal_received, frame):
    ser.close()
    print('CTRL+C detected > finished')
    exit(0)
###############################################################################

###############################################################################
def twos_complements(hexstr,bits):
	value = int(hexstr,16)
	print(value)
	if value & (1<<(bits-1)):
		value-= 1<<bits
	return (value*4000)/4369066 # 4000 tr/s = (int) 4369066 ou (hex) 0042AAAA  
###############################################################################


###############################################################################
'''Reveil du moteur et du controlleur'''
wakeUp = True
'''Tunnel de communication serie avec le moteur'''
ser = serial.Serial('COM10', 19200, timeout=0.3,parity = serial.PARITY_NONE)
'''Tunnel de communication avec NR'''
consigne = create_connection("ws://127.0.0.1:1880/consigne")
vitesse = create_connection("ws://127.0.0.1:1880/vitesse")
order = '' 
'''Récupération des valeurs des trames avec inclusion des CRC'''
fichierCRC = open("All.txt", "r")
contenuCRC = fichierCRC.read()
CRC = contenuCRC.split("\n")
fichierCRC.close()
'''Mesure de la vitesse'''
vitesseMesuree = 20


if wakeUp:
    print('WakeUp !')
    #reveil
    sendCmd('4D860140893000000000007E')
    sendCmd('4D86014041600000000000E6')
    sendCmd('4D86014001200000000000E6')
    sendCmd('4D8601406C600000000000CB')
    sendCmd('4D860140693000000000009E')
    sendCmd('4D86014001360200000000F2')
    sendCmd('4D86014064600000000000C3')
    sendCmd('4D86014004340200000000F5')
    sendCmd('4D86014061600000000000C6')
    sendCmd('4D860140FE6002000000005B')
    sendCmd('4D860140FE60010000000058')
    #marche (bouton marche de l'interface)
    sendCmd('4D860123FF6000000000003B')
    sendCmd('4D86014040600000000000E7')
    sendCmd('4D86012B406000000000008C')
    sendCmd('4D86012B406000060000008A')
    sendCmd('4D86012B4060000F00000083')

while True :
    c = consigne.recv()
    if c == 'STOP':
        break
    if c == '4D860140693000000000009E' :
        a = 1
    #    print(c)
        #sendCmd(c)
    else :
        print(c,CRC[round(int(c))])
        sendCmd(CRC[round(int(c))])
        #sendCmd(CRC[round(int(c)/10)])
    #vitesse.send(str(vitesseMesuree))
     
ser.close()
print('''Fini !''')