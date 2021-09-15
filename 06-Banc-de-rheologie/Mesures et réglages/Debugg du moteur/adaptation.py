# -*- coding: utf-8 -*-
"""
Created on Thu Jul  1 16:30:05 2021

@author: williams
"""

fichierCRC = open("test.txt", "r")
contenuCRC = fichierCRC.read()
#print(contenuCRC)
CRC = contenuCRC.split("\n")
fichierCRC.close()

output = 'o.txt'
fichier = open(output, "a")
for i in range(0,len(CRC)):
    if (CRC[i][0:17].replace('\t',' ')=='4D 86 01 23 FF 60') :
        #fichier.write(CRC[i]+'\n')
        fichier.write(CRC[i].replace('\t',' ').replace(' ','').strip()+'\n')
fichier.close()