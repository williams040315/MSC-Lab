# -*- coding: utf-8 -*-
"""
Created on Tue May 25 14:47:12 2021
@author: williams
@description: test port com + calcul des crc
"""

import serial
import binascii
import datetime
from signal import signal, SIGINT

output = 'crc.dat'
fichier = open(output, "a")

def sendCmd(c):
    #print(c)
    binary_string = ''			
    binary_string = binascii.unhexlify(c)
    ser.flushInput()
    ser.write(binary_string)
    bytes = ser.read(12)
    #print(bytes)
    return len(bytes)

def valueToHexa(value):
    convert = hex(value)[2:]
    if len(convert) == 1 :
        convert = '0'+convert
    if len(convert) == 3 :
        convert = '0'+convert
    if len(convert) == 5 :
        convert = '0'+convert
    
    if len(convert) == 2 :
        convert = '0000'+convert
    if len(convert) == 4 :
        convert = '00'+convert

    convert = "00"+convert[4:6] +""+convert[2:4]+""+convert[0:2]+"00"
        
    return (convert)

def valueToHexa2(value):
    convert = hex(value)[2:]
    if len(convert) == 1 :
        convert = '0'+convert
        
    return (convert)

def checksum(b10,b9,b8,b7,b6,b5,b4,b3,b2,b1,b0):
    payload = [int("0x"+b10, 0),int("0x"+b9, 0),int("0x"+b8, 0),int("0x"+b7, 0),int("0x"+b6, 0),int("0x"+b5, 0),int("0x"+b4, 0),int("0x"+b3, 0),int("0x"+b2, 0),int("0x"+b1, 0),int("0x"+b0, 0)]
    checksum = (sum(payload) )% 256
    print(int("0xFF", 0)-sum(payload))
    if checksum < 10:
        checksum = "0"+str(hex(checksum))[2:3]
    else:
        checksum = str(hex(checksum))[2:4]
    return checksum

def handler(signal_received, frame):
    ser.close()
    print('CTRL+C detected > finished')
    exit(0)

ser = serial.Serial('COM10', 19200, timeout=0.3,parity = serial.PARITY_NONE)


if True:
    #reveil
    sendCmd('4D860140893000000000007E');sendCmd('4D86014041600000000000E6');sendCmd('4D86014001200000000000E6');sendCmd('4D8601406C600000000000CB');sendCmd('4D860140693000000000009E');sendCmd('4D86014001360200000000F2');sendCmd('4D86014064600000000000C3');sendCmd('4D86014004340200000000F5');sendCmd('4D86014061600000000000C6');sendCmd('4D860140FE6002000000005B');sendCmd('4D860140FE60010000000058')
    #marche
    sendCmd('4D860123FF6000000000003B');sendCmd('4D86014040600000000000E7');sendCmd('4D86012B406000000000008C');sendCmd('4D86012B406000060000008A');sendCmd('4D86012B4060000F00000083')
    
if False :
    s = 0
    s= int(round(s*4369066/4000,0))
    #4369066?? >> 1tr/min=0x444, 0x42AAAA = 4369066 = 4000tr/min
    vth = valueToHexa(s)
    for j in range (300,325):
        if j%1==0:
            print(str(datetime.datetime.now().strftime('%H:%M:%S')))        
            print("vitesse= "+str(j))
            s= int(round(j*4369066/4000,0))
            vth = valueToHexa(s)
            for i in range  (0,256):
                if (sendCmd('4D860123FF60'+vth+valueToHexa2((i))) == 12):
                    break
                signal(SIGINT, handler)	
            print(vth+";"+"crc="+valueToHexa2((i)))
            print("-------------------------------")
            fichier.write('4D860123FF60'+vth+valueToHexa2((i))+"\n")
fichier.close()
ser.close()

