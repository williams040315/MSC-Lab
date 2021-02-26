# -*- coding: utf-8 -*-
"""
@author:    Williams BRETT
@date:      24-03-2020
@brief:     
"""

import numpy as np
import cv2
import os
import function as f
import random
import math


bins = np.arange(256).reshape(256,1)
def hist_curve(im, autoBC, activate):
    global Imin, Imax
    h = np.ones((300,256,3))
    if len(im.shape) == 2:
        color = [(255,255,255)]
    elif im.shape[2] == 3:
        color = [ (255,0,0),(0,255,0),(0,0,255) ]
    for ch, col in enumerate(color):
        hist_item = cv2.calcHist([im],[ch],None,[256],[0,256])
        cv2.normalize(hist_item,hist_item,0,255,cv2.NORM_MINMAX)
        hist=np.int32(np.around(hist_item))
        cdf = hist.cumsum() #histogramm cumulé
        cdf_normalized = cdf * 0.01 * 100 / cdf.max() # this line not necessary.
        if activate == True and autoBC == True:
            Imin = np.where(cdf_normalized>=0.01)[0][0]
            Imax  = np.where(cdf_normalized>=0.99)[0][0]
        pts = np.int32(np.column_stack((bins,hist)))
        cv2.polylines(h,[pts],False,col)
        if activate == True :
            cv2.line(h,(Imax,300),(Imin,0),(255,0,0),1)
            i = 0
            for el in cdf_normalized :
                cv2.circle(h,(i,int(300*cdf_normalized[i])),1, (255,0,255), 1)
                i=i+1
    y=np.flipud(h)
    return y

if __name__ == "__main__":

    dir_masks='./imgs-tests2/'
    list_file=os.listdir(dir_masks)
    #mon_fichier = open("save.txt", "w")
    a = 0 ; nbCellOld = 0; outputTable = [] ; color = [] ;
    for fichier in sorted(list_file):
        if fichier != '.DS_Store':
            a = a + 1
            img_orig=cv2.imread(dir_masks+fichier,cv2.IMREAD_UNCHANGED)
            if img_orig.dtype == 'uint16':
                img_orig = f.bytescaling(img_orig)
            else :
                img_orig=cv2.imread(dir_masks+fichier,0)

            o = img_orig.copy()
            o = cv2.cvtColor(o,cv2.COLOR_GRAY2RGB)
            cv2.imshow('cells',img_orig)
            
            c1,c2,Imin,Imax,Imoy,v,blackImg,whiteImg,normalImg,noiseImg,presenceCell = f.hist_curve(img_orig,True)
            
            if normalImg == False:
                print('Id:{} - NON CALCULEE'.format(a))
            else:
                lp = cv2.Laplacian(img_orig, cv2.CV_16S, ksize=9)  
                blur = cv2.GaussianBlur(img_orig,(5,5),0)
                kernel = np.array((
            	        [-1, -1, -1, -1, -1],
            	        [-1, -1, -1, -1, -1],
            	        [-1, -1, 24, -1, -1],
            	        [-1, -1, -1, -1, -1],
            	        [-1, -1, -1, -1, -1]), dtype="int")
                convolution = cv2.filter2D(blur, -1, kernel)
                ret2,th2 = cv2.threshold(convolution,100,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU)
                cnts = cv2.findContours(th2.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                cnts = cnts[0] 
                nbCell = []
                
                # generating bright palette
                if a ==1:
                    colors = np.zeros((1, len(cnts), 3), np.uint8)
                    colors[0,:] = 255
                    colors[0,:,0] = np.arange(5, 255, 255.0/len(cnts))
                    colors = cv2.cvtColor(colors, cv2.COLOR_HSV2BGR)[0]
                
                #comptage des cellules
                for c in cnts:
                    M = cv2.moments(c)
                    cX = int((M["m10"] / (M["m00"]+1e-4)))
                    cY = int((M["m01"] / (M["m00"]+1e-4)))
                    if cv2.contourArea(c) > 1  and cX >120 and cX<400 and cY>120 and cY<400 :
                        cv2.line(o, (120,120),(120,400),(255,0,255),1) ; cv2.line(o, (120,120),(400,120),(255,0,255),1) ; cv2.line(o, (400,120),(400,400),(255,0,255),1) ; cv2.line(o, (120,400),(400,400),(255,0,255),1)
                        nbCell.append((cX,cY))
                        if a == 1 :
                            outputTable.append([len(nbCell)-1])
                            c = list(map(int, colors[len(nbCell)-1]))
                            cv2.circle(o,(cX,cY),8,c,1)
                            cv2.putText(o,str(len(nbCell)-1),(cX-4,cY+4),  cv2.FONT_HERSHEY_SIMPLEX, 0.4,c, 1)
                            
                #tracking
                nbCell = np.array(nbCell).reshape(len(nbCell),2)
                if a == 1:
                    nGroup = len(nbCell)
                if True and a > 1:
                    #cv2.imshow('AND',cv2.bitwise_and(th2,th2Old))
                    saveDist = [] ; saveId = [] ; saveC = []
                    for id in range (len(nbCell)):
                            previousDist = 100
                            dist = 100
                            saveDist.append([]) ; saveId.append([]) ; saveC.append([])
                            for c in range (len(outputTable)):
                                if len(outputTable[c])!=0:
                                    indice = outputTable[c][0]
                                    deltaX = (nbCellOld[indice][0] - nbCell[id][0]) * (nbCellOld[indice][0] - nbCell[id][0]) 
                                    deltaY = (nbCellOld[indice][1] - nbCell[id][1]) * (nbCellOld[indice][1] - nbCell[id][1])
                                    dist = math.sqrt(deltaX + deltaY)
                                    if dist <= previousDist :
                                        saveId[id] = id
                                        saveC[id] = c
                                        saveDist[id] = dist
                                        previousDist = dist   
                            c = list(map(int, colors[saveC[id]]))
                            o = cv2.circle(o,(nbCell[saveId[id]][0],nbCell[saveId[id]][1]),8,c,1)
                            o = cv2.putText(o,str(saveC[id]),(nbCell[saveId[id]][0]-4,nbCell[saveId[id]][1]+4),  cv2.FONT_HERSHEY_SIMPLEX, 0.4, c, 1)
                    for group in range(nGroup):
                        outputTable[group] = []
                        for id in range (len(saveC)):
                            if saveC[id] == group :
                                outputTable[group].append(id)
                    print(outputTable)
                nbCellOld = nbCell
                th2Old = th2
                cv2.imshow('markers',o)
                cv2.waitKey(0)                
