#!/usr/bin/env python
# coding: utf-8
# Author: Williams BRETT
# Version: 1.0
# Subject: code python de contr?le du moteur pas ? pas n?, li? ? node-red, envoie les donn?es ? afficher via websocket
# Date: 23/02/2107
# Smile: My wife ! extra inspiration ...

import time
import random
import sys
from random import randint
from random import uniform
import urllib
import itertools
import serial
import binascii
import socket
from threading import Thread
from threading import Timer
import threading
from websocket import create_connection

##############################################################################################################################################
#websocket
##############################################################################################################################################
ws_receive      = create_connection("ws://localhost:1880/receive")
ws_publish      = create_connection("ws://localhost:1880/publish")
ws_config       = create_connection("ws://localhost:1880/config")
ws_output       = create_connection("ws://localhost:1880/output")
##############################################################################################################################################
#reponse du controlleur
##############################################################################################################################################
reponse = [0,0,0,0,0,0,0,0,0]
##############################################################################################################################################
#pour le graphique node-red via tcpip ou websocket, la variable interrupt est là pour stopper le programme
##############################################################################################################################################
switch    = 0
posX      = 0
posX_obj  = 0
speed     = 0
##############################################################################################################################################
# variables d'entrées node-red 
##############################################################################################################################################
n               = 0
x1              = 0
v1              = 0
t1              = 0
t3              = 0
x2              = 0
v2              = 0
t2              = 0 
t4              = 0
mode            = "auto"
direct_command  = ""
##############################################################################################################################################
#adresse du moteur
##############################################################################################################################################
target_adress   = '01'
##############################################################################################################################################
#configuration liaison série
##############################################################################################################################################
ser             = serial.Serial(port='COM15',baudrate = 9600,parity=serial.PARITY_NONE,stopbits=serial.STOPBITS_ONE,bytesize=serial.EIGHTBITS,timeout=2000)



##############################################################################################################################################
def publish_webSocket():
    ws_receive.send("posX:"+str(posX)+",posX_obj:"+str(posX_obj)+",speed:"+str(speed)+",switch:"+str(switch)+"\n")
    interrupt = int(float(ws_publish.recv()))
    return interrupt
##############################################################################################################################################
def getConfig():
    data_config     = ws_config.recv()
    data_config     = data_config.split(";")
    global mode, n, pos_absolue, vitesse_aller, vitesse_retour, t1, t2, t3, direct_command
    mode            = data_config[0]
    if data_config[0] == "auto":
        n               = int(float(data_config[1]))
        pos_absolue     = int(uniform(int(float(data_config[2])),int(float(data_config[6]))))
        vitesse_aller   = int(float(data_config[3]))
        vitesse_retour  = int(float(data_config[7]))
        t1              = float(data_config[5])
        t2              = float(int(uniform(float(data_config[4]),float(data_config[8]))))
        t3              = float(data_config[9])
        ws_output.send(str(n)+","+str(pos_absolue)+","+str(vitesse_aller)+","+str(vitesse_retour)+","+str(t1)+","+str(t2)+","+str(t3))
    if data_config[0] == "direct":
        instruction_number = data_config[1]
        type               = data_config[2]
        motor_bank         = data_config[3]
        operand_byte       = valueToHexa(int(data_config[4]))
        binary             = ''+target_adress+instruction_number+type+motor_bank+operand_byte[0]+operand_byte[1]+operand_byte[2]+operand_byte[3]+checksum(target_adress,instruction_number,type,motor_bank,operand_byte[0],operand_byte[1],operand_byte[2],operand_byte[3])+''
        ser.write(binascii.unhexlify(''.join(binary.split())))
        #publish_webSocket()
        #return reply()
##############################################################################################################################################
def ROR(value):
    instruction_number = '01'
    type               = '00'
    motor_bank         = '00'
    operand_byte       = valueToHexa(value)
    binary             = ''+target_adress+instruction_number+type+motor_bank+operand_byte[0]+operand_byte[1]+operand_byte[2]+operand_byte[3]+checksum(target_adress,instruction_number,type,motor_bank,operand_byte[0],operand_byte[1],operand_byte[2],operand_byte[3])+''
    ser.write(binascii.unhexlify(''.join(binary.split())))
    publish_webSocket()
    return reply()
##############################################################################################################################################
def ROL(value):
    instruction_number = '02'
    type               = '00'
    motor_bank         = '00'
    operand_byte       = valueToHexa(value)
    binary             = ''+target_adress+instruction_number+type+motor_bank+operand_byte[0]+operand_byte[1]+operand_byte[2]+operand_byte[3]+checksum(target_adress,instruction_number,type,motor_bank,operand_byte[0],operand_byte[1],operand_byte[2],operand_byte[3])+''
    ser.write(binascii.unhexlify(''.join(binary.split())))
    publish_webSocket()
    return reply()
##############################################################################################################################################
def MST():
    instruction_number = '03'
    type               = '00'
    motor_bank         = '00'
    operand_byte       = ['00','00','00','00']
    binary             = ''+target_adress+instruction_number+type+motor_bank+operand_byte[0]+operand_byte[1]+operand_byte[2]+operand_byte[3]+checksum(target_adress,instruction_number,type,motor_bank,operand_byte[0],operand_byte[1],operand_byte[2],operand_byte[3])+''
    ser.write(binascii.unhexlify(''.join(binary.split())))
    publish_webSocket()
    return reply()
##############################################################################################################################################
def MVP(type,value):
    global posX_obj
    posX_obj = value
    instruction_number = '04'
    type               = type
    motor_bank         = '00'
    operand_byte       = valueToHexa(value)
    binary             = ''+target_adress+instruction_number+type+motor_bank+operand_byte[0]+operand_byte[1]+operand_byte[2]+operand_byte[3]+checksum(target_adress,instruction_number,type,motor_bank,operand_byte[0],operand_byte[1],operand_byte[2],operand_byte[3])+''
    ser.write(binascii.unhexlify(''.join(binary.split())))
    publish_webSocket()
    return reply()
##############################################################################################################################################
def SAP(parameter_number, value):
    global posX, speed
    if parameter_number == '01':
        posX = value
    if parameter_number == '04':
        speed = value
    instruction_number = '05'
    type               =  parameter_number
    motor_bank         = '00'
    operand_byte       = valueToHexa(value)
    binary             = ''+target_adress+instruction_number+type+motor_bank+operand_byte[0]+operand_byte[1]+operand_byte[2]+operand_byte[3]+checksum(target_adress,instruction_number,type,motor_bank,operand_byte[0],operand_byte[1],operand_byte[2],operand_byte[3])+''
    ser.write(binascii.unhexlify(''.join(binary.split())))
    reponse = [0,0,0,0,0,0,0,0,0,0]
    publish_webSocket()
    return reply()
##############################################################################################################################################
def GAP(parameter_number):
    instruction_number = '06'
    type               = parameter_number
    motor_bank         = '00'
    operand_byte       = ['00','00','00','00']
    binary             = ''+target_adress+instruction_number+type+motor_bank+operand_byte[0]+operand_byte[1]+operand_byte[2]+operand_byte[3]+checksum(target_adress,instruction_number,type,motor_bank,operand_byte[0],operand_byte[1],operand_byte[2],operand_byte[3])+''
    ser.write(binascii.unhexlify(''.join(binary.split())))
    if (publish_webSocket() == 1) :
        MST()
        sys.exit(0)
    return reply()
##############################################################################################################################################
def SIO(port_number, bank_number, value):
    global switch
    if value == 0 :
        switch = 1
    else :
        switch = 0
    instruction_number = '0e'
    type               = port_number
    motor_bank         = bank_number
    operand_byte       = valueToHexa(value)
    binary             = ''+target_adress+instruction_number+type+motor_bank+operand_byte[0]+operand_byte[1]+operand_byte[2]+operand_byte[3]+checksum(target_adress,instruction_number,type,motor_bank,operand_byte[0],operand_byte[1],operand_byte[2],operand_byte[3])+''
    ser.write(binascii.unhexlify(''.join(binary.split())))
    publish_webSocket()
    return reply()   
##############################################################################################################################################
def pause(tmp):
    # même base de temps que dans node-red pour l'envoie de l'état du bouton stop
    base = 0.25
    for i in range (0,int(tmp/base)):
        time.sleep(base)
        if (publish_webSocket() == 1) :
            MST()
            sys.exit(0)
##############################################################################################################################################
def reply():
    for i in range (0, 9):
        code = ""
        reponse[i] = ord(ser.read())
        valueHexa = hex((reponse[i] + (1 << 32)) % (1 << 32))
        strValueHexa = str(valueHexa)
        lenValueHexa = len(strValueHexa)
        valueHexa = strValueHexa[2:lenValueHexa-1]
        for repeat in range (0, (2 - lenValueHexa + 3)):
            code = code + "0"
        valueHexa = code + valueHexa
        reponse[i] = valueHexa
    return reponse
##############################################################################################################################################
def checksum(target_adress,instruction_number,type,motor_bank,operand_byte3,operand_byte2,operand_byte1,operand_byte0):
    payload = [int("0x"+target_adress, 0),int("0x"+instruction_number, 0),int("0x"+type, 0),int("0x"+motor_bank, 0),int("0x"+operand_byte3, 0),int("0x"+operand_byte2, 0),int("0x"+operand_byte1, 0),int("0x"+operand_byte0, 0)]
    checksum = sum(payload) % 256
    if checksum < 10:
        checksum = "0"+str(hex(checksum))[2:3]
    else:
        checksum = str(hex(checksum))[2:4]
    return checksum
##############################################################################################################################################
def valueToHexa(value):
    operand_bytes = ['00','00','00','00']
    code = ""
    valueHexa = hex((value + (1 << 32)) % (1 << 32))
    strValueHexa = str(valueHexa)
    lenValueHexa = len(strValueHexa)
    valueHexa = strValueHexa[2:lenValueHexa-1]
    for repeat in range (0, (8 - lenValueHexa + 3)):
        code = code + "0"
    valueHexa = code + valueHexa
    for id in range (0, 4):
        operand_bytes[id] = valueHexa[id*2:2*(1+id)]
    return operand_bytes
##############################################################################################################################################
def hexaToValue(value):
    result = int(value, 16)
    if (result & 0x80000000) == 0x80000000:
        result = -( (result ^ 0xffffffff) + 1)
    return result 
##############################################################################################################################################
def waitPosition(value,signe):
    global speed, posX
    while 1 :
        position = GAP('01')
        time.sleep(0.1)
        control_value = hexaToValue(position[4]+position[5]+position[6]+position[7])
        posX = str(control_value)
        if signe == "<=":
            if (control_value ) <= value :
                speed = 0
                break
        if signe == ">=":
            if (control_value ) >= value :
                speed = 0
                break
        
##############################################################################################################################################
# PROGRAMME     
##############################################################################################################################################

#0 récupére la config n,x1,v1,t1,t3,x2,v2,t2,t4
getConfig()
if mode == "auto":
    #1 ouverture du relais
    r = SIO('00', '02', 1)               
    #2 position 0
    r = SAP('01',0)  
    #3 fixe la vitesse aller ? V
    r = SAP('04',vitesse_aller)       
    #4 Va ? la position absolue
    r = MVP('00',pos_absolue)  
    #5 attends d'?tre ? la position absolue                         
    waitPosition(pos_absolue,">=")
    #6 tempo t1
    pause(t1)
    #7 fermeture du relais
    r = SIO('00', '02', 0)                 
    #8 tempo t2
    pause(t2)
    #9 ouverture du relais
    r = SIO('00', '02', 1)                  
    #8 tempo t3
    pause(t3)
    #9 fixe la vitesse pour le retour
    r = SAP('04',vitesse_retour)     
    #10 reviens ? la position initiale
    r = MVP('00',0)
    #11 attend le retour ? la position initiale
    waitPosition(0,"<=")
    #12 fermeture des websockets
    publish_webSocket()
    pause(1)
    ws_publish.close()
    ws_receive.close()
    ws_config.close()
    ws_output.close()