from pyvcam import pvc
from pyvcam.camera import Camera
import cv2
import numpy as np
import time
from PIL import Image
from glob import glob

def main():
    global cam
    pvc.init_pvcam()
    cam = next(Camera.detect_camera())
    cam.open()
    

           
    frame = cam.get_frame(exp_time=int(100)).reshape(cam.sensor_size[::-1])   
    cv2.imwrite("C:/Users/labo/.node-red/lib2/media/Williams/test.tiff",frame)
    
    img = frame
    high = 255
    low = 0
    cmin = img.min()
    cmax = img.max()
    cscale = cmax - cmin
    if cscale == 0:
        cscale = 1
    scale = float(high - low) / cscale ; bytedata = (img - cmin) * scale + low
    img =  (bytedata.clip(low, high) + 0.5).astype(np.uint8)
    cv2.imwrite("C:/Users/labo/.node-red/lib2/media/Williams/test2.tiff",img)
    name = "C:/Users/labo/.node-red/lib2/media/Williams/test2.tiff"
    im = Image.open(name)
    name = str(name).rstrip(".tiff")
    im.save(name+".png",'png')

if __name__=="__main__":
    
    main()
