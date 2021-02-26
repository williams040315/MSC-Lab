# -*- coding: utf-8 -*-
"""
Created on Wed Feb 24 10:24:51 2021

@author: williams
"""

from websocket import create_connection
import time

cmd = create_connection("ws://127.0.0.1:1880/cmd")
data = create_connection("ws://127.0.0.1:1880/data")

cmd.send("{\"cmd\":\"START\"}")
time.sleep(3)
cmd.send("{\"cmd\":\"SEN.\",\"data\":\"14\"}")

iterator = 0

while iterator < 10 : 
    
    cmd.send("{\"cmd\":\"DATA?\"}")
    print(data.recv())
    iterator = iterator + 1
    time.sleep(1)

cmd.send("{\"cmd\":\"STOP\"}")
