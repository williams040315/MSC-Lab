import base64
from PIL import Image
from io import BytesIO
import cv2
from glob import glob
import os
import numpy as np
import time

f = open('C:/Users/labo/customizeNode/node-red-contrib-andor-mosaic3/AndorMosaic3/base64.txt', 'r')
data = f.read()
f.closed

im = Image.open(BytesIO(base64.b64decode(data)))
im.save('C:/Users/labo/customizeNode/node-red-contrib-andor-mosaic3/AndorMosaic3/video_feed.png', 'PNG')
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(5,5))#np.ones((5,5),np.uint8)
pngs = glob('C:/Users/labo/customizeNode/node-red-contrib-andor-mosaic3/AndorMosaic3/*.png')
mask = cv2.imread('C:/Users/labo/customizeNode/node-red-contrib-andor-mosaic3/AndorMosaic3/mask.jpg')
for j in pngs:
    img = cv2.imread(j, cv2.IMREAD_UNCHANGED)
    #dilation = cv2.erode(img,kernel,iterations = 20)

    trans_mask = img[:,:,3] == 0
    img[trans_mask] = [255, 255, 255, 255]
    new_img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
    #imgra = cv2.cvtColor(new_img,cv2.COLOR_BGR2GRAY)
    
    #x,y = 1.42, 1.42
    #img2 = cv2.resize(imgra,None,fx=x,fy=y, interpolation = cv2.INTER_CUBIC)
    #rows,cols = img2.shape
    #M = np.float32([[1,0,220],[0,1,-150]])
    #dst = cv2.warpAffine(img2,M,(cols,rows))
    
    #new_img = dst[int(((600*y)-600)/2):int(((600*y)-600)/2)+600, int(((800*x)-800)/2):int(((800*x)-800)/2)+800]
    #cv2.imwrite('r.jpg', dst)


    x_offset=0 #x20
    #y_offset=10 #x20
    
    x_offset=245 #x20
    y_offset=12 #x20
    
    
    mask[y_offset:y_offset+new_img.shape[0], x_offset:x_offset+new_img.shape[1]] = new_img  
    imgray = cv2.cvtColor(mask,cv2.COLOR_BGR2GRAY)
    ret,thresh2 = cv2.threshold(imgray,0,255,cv2.THRESH_BINARY)
    
    cv2.imwrite(j[:-3] + 'jpg', thresh2)

os.system("C:/Users/labo/customizeNode/node-red-contrib-andor-mosaic3/AndorMosaic3/imageToMatrix.exe")
