# -*- coding: utf-8 -*-
"""
Created on Wed Feb 24 10:24:51 2021
@author: Williams BRETT, MSC, CNRS
"""

'''Import'''
from websocket import create_connection
import datetime as dt
from signal import signal, SIGINT

def handler(signal_received, frame):
	print('CTRL+C detected > finished')
	st.send('STOP')
	exit(0)
	
'''Tunnel de communication avec NR'''
magnitude = create_connection("ws://127.0.0.1:1880/magnitude")
phase = create_connection("ws://127.0.0.1:1880/phase")
sensibility = create_connection("ws://127.0.0.1:1880/sensibility")
st = create_connection("ws://127.0.0.1:1880/ST")

st.send('START')
while True : 
	signal(SIGINT, handler)
	print(dt.datetime.now().strftime('%H:%M:%S.%f'), magnitude.recv(), phase.recv())
	sensibility.send("SEN.15 ")
print('<Fin> :-)')
st.send('STOP')

