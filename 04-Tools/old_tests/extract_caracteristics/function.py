#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Mar 25 17:38:59 2020

@author: williams
"""
import cv2
import numpy as np


def nothing(x):
    pass

def getsize(img):
    h, w = img.shape[:2]
    return w, h

def bytescaling(data, cmin=None, cmax=None, high=255, low=0):
    if data.dtype == np.uint8:
        return data
    if high > 255:
        high = 255
    if low < 0:
        low = 0
    if high < low:
        raise ValueError("`high` should be greater than or equal to `low`.")
    if cmin is None:
        cmin = data.min()
    if cmax is None:
        cmax = data.max()
    cscale = cmax - cmin
    if cscale == 0:
        cscale = 1
    scale = float(high - low) / cscale ; bytedata = (data - cmin) * scale + low
    return (bytedata.astype(np.uint8))
    
def hist_curve(im, activate,widthHist = 5,maxBlack = 5,minWhite = 250,ImoyInf=40,ImoySup=100):
    h = np.ones((300,256,3))
    h2 = np.ones((300,256,3))
    if len(im.shape) == 2:
        color = [(255,255,255)]
    elif im.shape[2] == 3:
        color = [ (255,0,0),(0,255,0),(0,0,255) ]
    for ch, col in enumerate(color):
        hist_item = cv2.calcHist([im],[ch],None,[256],[0,256])
        cv2.normalize(hist_item,hist_item,0,255,cv2.NORM_MINMAX)
        hist=np.int32(np.around(hist_item))
        cdf = hist.cumsum() #histogramm cumulé
        cdf_normalized = cdf / cdf.max() # between 0 et 1
        hist_normalized = hist / hist.max()  # between 0 et 1
        Imin = np.where(cdf_normalized>=0.01)[0][0] ; Imax  = np.where(cdf_normalized>=0.99)[0][0] ; Imoy  = np.where(cdf_normalized>=0.50)[0][0]
        
        if activate == True :
            cv2.line(h,(Imax,300),(Imin,0),(255,0,0),1)
            cv2.line(h2,(Imax,300),(Imin,0),(255,0,0),1)
            i = 0
            for el in cdf_normalized :
                cv2.circle(h,(i,int(300*cdf_normalized[i])),1, (255,0,255), 1)
                i = i + 1
                if i > 0 and i < 256:
                    cv2.line(h,(i,int(300*cdf_normalized[i])),(i-1,int(300*cdf_normalized[i-1])),(255,0,255),1)
            i = 0
            for el in hist_normalized :
                cv2.circle(h2,(i,int(hist_normalized[i][0])),1, (255,0,255), 1)
                i = i + 1
                if i > 0 and i < 256 : 
                    cv2.line(h2,(i,int(300*hist_normalized[i])),(i-1,int(hist_normalized[i-1])),(255,0,255),1)
                      
    y = np.flipud(h) ; y2 = np.flipud(h2) 

    blackImg = False ; whiteImg = False ; normalImg = True ; noiseImg = False ; presenceCell = True
    if Imin <= Imax and Imax < maxBlack and (Imax-Imin) <= widthHist :
        blackImg = True
        normalImg = False
        presenceCell = False
    if Imax >= Imin and Imin > minWhite and (Imax-Imin) <= widthHist :
        whiteImg = True
        normalImg = False
        presenceCell = False
    if Imoy >= ImoyInf and Imoy < ImoySup :
        normalImg = False   
        noiseImg = True
        presenceCell = True
    if whiteImg == False and Imoy >= ImoySup :
        normalImg = False   
        noiseImg = True
        presenceCell = False
    
    return y,y2,Imin,Imax,Imoy,variance_of_laplacian(im),blackImg,whiteImg,normalImg,noiseImg,presenceCell


def variance_of_laplacian(image):    
    if image is None:
        print ('Erreur: opening image')
        return -1
    image = cv2.cvtColor(image,cv2.COLOR_GRAY2BGR)                                                        
    image = cv2.GaussianBlur(image, (3, 3), 0)                                                           
    src_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)                                                    
    kernel_size = 3
    return cv2.Laplacian(src_gray, cv2.CV_16S, ksize=kernel_size).var()