# -*- coding: utf-8 -*-
"""
Created on Wed Feb 24 10:24:51 2021
@author: Williams BRETT, MSC, CNRS
"""

'''Import'''
from websocket import create_connection
import json
import time
import datetime as dt

'''Tunnel de communication avec NR'''
cmd = create_connection("ws://127.0.0.1:1880/cmd")
data = create_connection("ws://127.0.0.1:1880/data")

'''Réglages liés a Node-RED , à l'envoie des ordres au Lockin et au maintien d'une commande'''
updateInterval='{"cmd":"ITL" , "data":100}' # 0,1s d'envoie d'ordre au lockin
cmd.send(updateInterval)
updateInterval='{"cmd":"keepCMD" , "data":500}' # 0,5s de maintien
cmd.send(updateInterval)

'''Préparation des commandes'''
start='{"cmd":"START"}'
stop='{"cmd":"STOP"}'
updateSensibility='{"cmd":"SEN." , "data":14}'
getData='{"cmd":"MP?"}'

'''Démarrage via le tunnel de communication'''
cmd.send(start)

iterator = 0
wait = 0.1

'''
Programme 1, programme de base avec changement de la sensibilité
'''
while iterator < 100 : 
    cmd.send(getData)
    datas  = json.loads(data.recv())
    print(iterator,dt.datetime.now().strftime('%H:%M:%S.%f'),datas['M'],datas['P'],datas['CMD'])
    iterator = iterator + 1
    if iterator == 25 :
        cmd.send(updateSensibility)
    time.sleep(wait)

'''Arret  via le tunnel de communication'''
cmd.send(stop)
print('<Fin> :-)')
