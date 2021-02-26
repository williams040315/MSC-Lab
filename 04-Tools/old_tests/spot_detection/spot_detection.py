# -*- coding: utf-8 -*-
"""
@author:    Williams BRETT
@date:      13-11-2019
@brief:     this is a simple code to detect spot in a fluorescence image (here, RPF) 
"""

import cv2
import numpy as np
import os

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

def variance_of_laplacian(image):    
    if image is None:
        print ('Erreur: opening image')
        return -1
    image = cv2.cvtColor(image,cv2.COLOR_GRAY2BGR)                                                        
    image = cv2.GaussianBlur(image, (3, 3), 0)                                                           
    src_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)                                                    
    kernel_size = 3
    return cv2.Laplacian(src_gray, cv2.CV_16S, ksize=kernel_size).var()


if __name__ == "__main__":
    for dir in ['data/']:
        for file in sorted(os.listdir(dir)):
            img  = cv2.imread(dir+file,cv2.IMREAD_UNCHANGED)
            convert = bytescaling(img) ; initial = convert.copy()
            blur = cv2.GaussianBlur(convert,(5,5),0)
            kernel = np.array((
                [-1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1],
                [-1, -1, 24, -1, -1],
                [-1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1]), dtype="int")
            convolution = cv2.filter2D(blur, -1, kernel)
            ret2,th2 = cv2.threshold(convolution,0,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU)
            cnts = cv2.findContours(th2.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            print('cellules / variance: ',format(len(cnts[1])),format(int(variance_of_laplacian(convert))))
            convert = cv2.cvtColor(convert,cv2.COLOR_GRAY2BGR)                                                        
            try:
                for c in cnts[1]:
                    (x,y),radius = cv2.minEnclosingCircle(c) ; cX = int(x); cY = int(y)
                    cv2.circle(convert,(cX,cY),int(radius),(255,0,245))    
            except:
                print("calcul exeception") 
            cv2.imshow('image initial',initial)
            cv2.imshow('blur',blur)
            cv2.imshow('Spot',convert)
            cv2.imshow("convolution", convolution)
            cv2.imshow("thresh OTSU", th2)
                    
            cv2.waitKey()
    cv2.destroyWindow()