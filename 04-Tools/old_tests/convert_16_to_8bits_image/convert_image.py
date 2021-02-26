# -*- coding: utf-8 -*-
"""
@author:    Williams BRETT
@date:      24-01-2019
@brief:     convert 16bits to 8bits, apply color mapping, adjust gamma, brightness and contrst auto 
"""

import numpy as np
import cv2
import glob
import base64
import sys

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
    
def adjust_gamma(image, gamma=1.0):
    invGamma = 1.0 / gamma
    table = np.array([((i / 255.0) ** invGamma) * 255
                      for i in np.arange(0, 256)]).astype("uint8")
    return cv2.LUT(image, table)

def applyCustomColorMap(im_gray) :
    hex_str = "#8080C0" #bgr   #80FF00  color html5
    b = int('0x'+hex_str[1:-4],16); g = int('0x'+hex_str[3:-2],16);r = int('0x'+hex_str[5:],16)
    stepr1 = (256-r)/128;stepg1 = (256-g)/128;stepb1 = (256-b)/128
    stepr2 = r/128;stepg2 = g/128;stepb2 = b/128
    lut = np.zeros((256, 1, 3), dtype=np.uint8)
    lut[:, 0, 0] = 256 * [0];lut[:, 0, 1] = 256 * [0];lut[:, 0, 2] = 256 * [0]
    for i in range(0,128):
        lut[:, 0, 0][i] = int(255 - i*stepr1);lut[:, 0, 1][i] = int(255 - i*stepg1);lut[:, 0, 2][i] = int(255 - i*stepb1)    
    for i in range(128,256):
        lut[:, 0, 0][i] = int(r - (i-128)*stepr2);lut[:, 0, 1][i] = int(g - (i-128)*stepg2);lut[:, 0, 2][i] = int(b - (i-128)*stepb2)    
    im_color = cv2.LUT(im_gray, lut)    
    return im_color
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

    path = 'AgarPad1-Position1-BF-1552477544468.tiff'
    img16bits = cv2.imread(path,cv2.IMREAD_UNCHANGED)
    img8bits = bytescaling(img16bits)
    
    image = img8bits
    new_image = np.ones(image.shape, image.dtype)
    im_color_adjust = adjust_gamma(image,gamma=1)
    
    while True:
        try:
            cv2.imshow("img16bits",img16bits)
            cv2.imshow("img8bits",img8bits)
            cv2.imshow("im_color_adjust_gamma",im_color_adjust)
            curve = hist_curve(image,True,True)
            cv2.imshow('histogram_img8bits',curve)
            alpha = 255. / (Imax-Imin)
            beta = -1 * Imin  * alpha 
            new_image = np.clip(alpha*image + beta, 0,255).astype(np.uint8)
            cv2.imshow("Corr.B&C!img8bits",new_image)
            aCC = applyCustomColorMap((cv2.cvtColor(new_image, cv2.COLOR_GRAY2BGR)))
            #aCC = cv2.applyColorMap(new_image, cv2.COLORMAP_OCEAN)
            cv2.imshow("ColorMap",aCC)
        except Exception as e: 
            print(e)
        ch = cv2.waitKey(5) & 0xFF
        if ch == ord('q'):
            break
    cv2.destroyAllWindows()