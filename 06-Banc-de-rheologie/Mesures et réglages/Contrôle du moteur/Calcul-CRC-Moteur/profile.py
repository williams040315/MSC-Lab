# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""

for j in range(0,18*8):
    minn = 0 + j*32
    maxx = 32 +j*32
    
    output = 'profile/Profile_Log_2-'+str(minn)+'-'+str(maxx)+'.TXT'
    fichier = open(output, "a")
    
    fichier.write(';Sequence File created on 10/03/2021 11:16:27\n')
    fichier.write(';Software Version 5.11\n')
    fichier.write(';\n')
    fichier.write(';\n')
    
    speed = 0
    id=0
    for i in range (minn,maxx):
        if i == 4501 :
            break
            break
        speed = round(i * 1092.895)
        fichier.write(';\n')
        fichier.write(';\n')
        fichier.write(';\n')
        fichier.write('SeqNb='+str(id)+'\n')
        fichier.write('SeqType=SPEED\n')
        fichier.write('Speed='+str(speed)+'\n')
        fichier.write('AccelTime=1\n')
        fichier.write('DecelTime=1\n')
        fichier.write('RunTime=2000\n')
        if i != maxx-1 and i!=4500:
            fichier.write('SeqNext='+str(id+1)+'\n')
        else :
            fichier.write('SeqNext=-1\n')
            
        fichier.write('SeqCount=0\n')
        fichier.write('SeqLink=-1\n')
        fichier.write('Output="........"\n')
        fichier.write('Trigger=END\n')
        fichier.write('StartCond="........"\n')
        fichier.write('EndCond="........"\n')
        fichier.write('Tempo=0\n')
        id=id+1
    id=0
    fichier.close()
