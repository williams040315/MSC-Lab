# -*- coding: utf-8 -*-
"""
@author:    Williams BRETT
@date:      24-03-2020
@brief:     Extract cells, morphological caracteristics,... since RFP image
"""

import numpy as np
import cv2
import function as f
import argparse
import json


dir_masks='./imgs-tests/'


if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument("img", help="the name of image, 8 bits ou 16 bits")
    args = parser.parse_args()

    img_orig=cv2.imread(dir_masks+args.img,cv2.IMREAD_UNCHANGED)
    if img_orig.dtype == 'uint16':
        img_orig = f.bytescaling(img_orig)
    else :
        img_orig=cv2.imread(dir_masks+args.img,0)

    o = img_orig.copy()
    o = cv2.cvtColor(o,cv2.COLOR_GRAY2RGB)
    
    c1,c2,Imin,Imax,Imoy,v,blackImg,whiteImg,normalImg,noiseImg,presenceCell = f.hist_curve(img_orig,True)
    #cv2.imshow('C1',c1) ; cv2.imshow('C2',c2)
    
    
    strO = str('Img:'+str(dir_masks+args.img)+' >')
    if blackImg == True:
        strO = strO + ' black'
    if whiteImg == True:
        strO = strO + ' white'
    if noiseImg == True:
        strO = strO + ' noise'
    if presenceCell == True:
        strO = strO + ' cells'    
    o = cv2.putText(o,strO, (20,20),  cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255,0), 1)
    
    caracteristics_img = {
        'img': args.img,
        'histogram': {
            'black' : blackImg,
            'white' : whiteImg,
            'noise' : noiseImg
            },
        'NCell' : 'NaN'
    }
    
    
    if normalImg == False:
        print('------------------Results------------------')
        jsonOutputIndent = json.dumps(caracteristics_img, sort_keys=False, indent=2)
        print('Indentation format: '+ jsonOutputIndent)
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
        cv2.drawContours(o, cnts,-1, (0,127,0), 1)

        caracteristics_img['NCell'] = len(cnts)
        #caracteristics_img = json.dumps(caracteristics_img)
        
        print('Id:{} - {} noyaux possibles'.format(dir_masks+args.img,len(cnts)))
        caracteristics_img['Extract'] = {}
        elem = 0
        for c in cnts:
            M = cv2.moments(c)
            cX = int((M["m10"] / (M["m00"]+1e-4)))
            cY = int((M["m01"] / (M["m00"]+1e-4)))
            area = cv2.contourArea(c)
            perimeter = cv2.arcLength(c,True)
            mask = np.zeros(img_orig.shape,np.uint8)
            cv2.drawContours(mask,[c],0,255,-1)
            mean_val = cv2.mean(img_orig,mask = mask)    
            
            caracteristics_img['Extract']['Cell-'+str(elem)] = {}
            caracteristics_img['Extract']['Cell-'+str(elem)]['barycenter'] = {}
            caracteristics_img['Extract']['Cell-'+str(elem)]['barycenter']['x'] = cX
            caracteristics_img['Extract']['Cell-'+str(elem)]['barycenter']['y'] = cY
            caracteristics_img['Extract']['Cell-'+str(elem)]['geometry'] =  {}
            caracteristics_img['Extract']['Cell-'+str(elem)]['geometry']['area'] =  area
            caracteristics_img['Extract']['Cell-'+str(elem)]['geometry']['perimeter'] =  perimeter
            caracteristics_img['Extract']['Cell-'+str(elem)]['meanIntensity'] = mean_val[0]

            # if you need extract all pixel in a shape 
            #pixelpoints = np.transpose(np.nonzero(mask))
            
            elem = elem + 1
            o = cv2.circle(o,(cX,cY),5,(0,0,255),1)
        
        print('------------------Results------------------')
        jsonOutputIndent = json.dumps(caracteristics_img, sort_keys=False, indent=2)
        print('Indentation format: '+ jsonOutputIndent)
        
        cv2.imshow('cells',o)
        print('Press a touch to quit....')
        cv2.waitKey(0)
