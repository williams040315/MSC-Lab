import cv2
from base_camera import BaseCamera
from pyvcam import pvc
from pyvcam.camera import Camera
import numpy as np
import time

class Cameras(BaseCamera):
    global color
    color = ""
    global invert
    invert = False
    global exposure
    exposure = 100
    global map
    map = True
    global threshV
    threshV = 50
    global mode
    mode = 8
    
    video_source = 0
    
    @staticmethod
    def set_video_source(source):
        Cameras.video_source = source
            
    @staticmethod
    def updateColor(data):
        global color
        color= data
    
    @staticmethod
    def updateMode(data):
        global mode
        mode= int(data)
    
    @staticmethod
    def updateThresh(data):
        global threshV
        threshV = int(data)
        
    @staticmethod
    def updateInvert(data):
        global invert
        invert = data


    @staticmethod
    def updateGain(data):
        global gain
        gain = data

    @staticmethod
    def updateMap(data):
        global map
        map = data
    
    @staticmethod
    def updateExposure(data):
        global exposure
        exposure = int(data)
        global cam
        ####cam.stop_live()
        ####cam.start_live(exp_time=exposure)
        
        
    @staticmethod
    def frames():
        global color, invert, map, exposure, cam, thresh
        i = 0
        pvc.init_pvcam()
        cam = next(Camera.detect_camera())
        cam.open()
####        cam.start_live(exp_time=exposure)
        #cam.stop_live()
        cnt = 0
        tot = 0
        t1 = time.time()
        start = time.time()
        fps = 0
        while True:
            cam.gain = 1
            frame = cam.get_frame(exp_time=exposure).reshape(cam.sensor_size[::-1])
####            frame = cam.get_live_frame().reshape(cam.sensor_size[::-1])

#            frame = cam.get_frame(exp_time=exposure).reshape(cam.sensor_size[::-1])
            #print(mode)
            #print(frame)
            img = frame
            if mode == 8 :
                high = 255 ; low = 0; cmin = img.min(); cmax = img.max() ;
                cscale = cmax - cmin
                if cscale == 0 :
                    cscale = 1
                scale = float(high-low) / cscale ; bytedata = (img-cmin) * scale + low
                img = (bytedata.clip(low, high)+0.5).astype(np.uint8)
            
                #imgray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
                ret,thresh = cv2.threshold(img,threshV,255,0)
                image, contours, hierarchy = cv2.findContours(thresh,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
            
            
                if color == "" :
                    if map == True:
                        img = cv2.applyColorMap(img, cv2.COLORMAP_HOT)
                else:
                    if map == True:
                        img = cv2.cvtColor(img,cv2.COLOR_GRAY2BGR)
                        img = cv2.bitwise_not(img)
                        hex_str = color #"#80FF00" #bgr   80FF00
                        b = int('0x'+hex_str[1:-4],16); g = int('0x'+hex_str[3:-2],16);r = int('0x'+hex_str[5:],16)
                        stepr1 = (256-r)/128;stepg1 = (256-g)/128;stepb1 = (256-b)/128
                        stepr2 = r/128;stepg2 = g/128;stepb2 = b/128
                        lut = np.zeros((256, 1, 3), dtype=np.uint8)
                        lut[:, 0, 0] = 256 * [0];lut[:, 0, 1] = 256 * [0];lut[:, 0, 2] = 256 * [0]
                        for i in range(0,128):
                            lut[:, 0, 0][i] = int(255 - i*stepr1);lut[:, 0, 1][i] = int(255 - i*stepg1);lut[:, 0, 2][i] = int(255 - i*stepb1)    
                        for i in range(128,256):
                            lut[:, 0, 0][i] = int(r - (i-128)*stepr2);lut[:, 0, 1][i] = int(g - (i-128)*stepg2);lut[:, 0, 2][i] = int(b - (i-128)*stepb2)    
                        img = cv2.LUT(img, lut)    
                if invert == True :
                    img = cv2.bitwise_not(img)
                
     #       img = applyCustomColorMap(cv2.bitwise_not(cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)))
            #img = cv2.applyColorMap(img, cv2.COLORMAP_OCEAN)
            #img = cv2.putText(img, "Test",(20,40), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (100,0,0), 1)
            #cv2.imwrite("C:/Users/Williams/.node-red/lib/test_"+str(i)+".png",img)
#            self.ws.send(img)
            # encode as a jpeg image and return it
            
                low = np.amin(frame)
                high = np.amax(frame)
                average = np.average(frame)
        
                if cnt == 10:
                    t1 = time.time() - t1
                    fps = 10/t1
                    t1 = time.time()
                    cnt = 0
                    
                
                #img = cv2.drawContours(img, contours, -1, (0,255,0),1)
                #img = cv2.putText(img, str(low)+'-'+str(high)+'-'+str(average)+'-'+str(fps),(20,40), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (100,0,0), 1)
                #img = cv2.putText(img, str(low)+'-'+str(high)+'-'+str(average)+'-'+str(fps),(20,40), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (100,0,0), 1)
                #img = cv2.rectangle(img, (256-50,256-50),(256+50,256+50), (100,0,0),1)
            #print(frame)
            yield cv2.imencode('.jpg', img)[1].tobytes()
            cnt += 1
            tot += 1
            