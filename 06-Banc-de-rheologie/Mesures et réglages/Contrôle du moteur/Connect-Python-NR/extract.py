# -*- coding: utf-8 -*-
"""
@author: williams brett
@lab: msc
@pi: sandra lerouge
@date: 28/06/2021
@descrition: connexion python <> NodeRed
"""

from sys import exit

'''Récupération des valeurs des trames avec inclusion des CRC'''
fichierCRC = open("All.txt", "r")
contenuCRC = fichierCRC.read()
CRC = contenuCRC.split("\n")
fichierCRC.close()

for i in range(0,4500):
    print(CRC[i][22:24])