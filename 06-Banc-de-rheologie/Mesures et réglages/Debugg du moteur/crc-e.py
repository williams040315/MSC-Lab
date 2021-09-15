# -*- coding: utf-8 -*-
"""
Created on Thu Jul  1 20:52:49 2021

@author: williams
"""

# -*- coding: utf-8 -*-
"""
Created on Thu Jul  1 16:30:05 2021

@author: williams
"""

fichierCRC = open("All.txt", "r")
contenuCRC = fichierCRC.read()
#print(contenuCRC)
CRC = contenuCRC.split("\n")
fichierCRC.close()

output = 'ou.txt'
fichier = open(output, "a")
for i in range(0,len(CRC)):
    fichier.write(CRC[i][22:24]+'\n')
fichier.close()