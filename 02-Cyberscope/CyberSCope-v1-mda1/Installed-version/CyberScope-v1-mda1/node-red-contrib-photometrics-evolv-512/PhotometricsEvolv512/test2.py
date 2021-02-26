from pyvcam import pvc
from pyvcam.camera import Camera
import cv2
from websocket import create_connection
import time
import numpy as np
from PIL import Image
from glob import glob

ws_receive = create_connection('ws://127.0.0.1:1880/receiveEVOLV512');
ws_publish = create_connection('ws://127.0.0.1:1880/publishEVOLV512');

def main():
    global cam
    pvc.init_pvcam()
    cam = next(Camera.detect_camera())
    cam.open()
    
    while True :
                    
        try:        
            receiveData = ws_receive.recv()
            print(receiveData)
            dataOrder  = receiveData.split(",")
            print(dataOrder)
            
            if(dataOrder[0] == 'TEST-EVOLV512'):
                print("Ready to grab picture")
            
            if(dataOrder[0] == 'STOP'):
                ws_publish.send("STOP")
                break
                break
            
            if(dataOrder[0] == 'GRAB'):
                try:
                    #width = 800
                    #height = int(cam.sensor_size[1] * width / cam.sensor_size[0])
                    #dim = (width, height)
                    print(time.time())
                    frame = cam.get_frame(exp_time=int(dataOrder[5])).reshape(cam.sensor_size[::-1])
                    #frame = cam.get_frame(exp_time=250)#.reshape(cam.sensor_size[::-1])
                    #frame = cv2.resize(frame,dim, interpolation = cv2.INTER_AREA)
                    print(time.time())
                    #ts = time.time()
                except:
                    print("1")
                try :
                    nameOfPicture = dataOrder[1]+'-'+dataOrder[2]+'-'+dataOrder[3]+'-'+dataOrder[4]+'.tiff'
                    nameOfPicture2 = "C:/Users/labo/.node-red/lib2/media/Williams/"+dataOrder[1]+'-'+dataOrder[2]+'-'+dataOrder[3]+'-'+dataOrder[4]+'(8bits).tiff'
                    cv2.imwrite("C:/Users/labo/.node-red/lib2/media/Williams/"+nameOfPicture,frame)
                    
                    
                    
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
                    cv2.imwrite(nameOfPicture2,img)
                    
                    name = nameOfPicture2
                    im = Image.open(name)
                    name = str(name).rstrip(".tiff")
                    im.save(name+".png",'png')
                    
                    ws_publish.send(dataOrder[1]+'-'+dataOrder[2]+'-'+dataOrder[3]+'-'+dataOrder[4]+'(8bits).png')
                except:
                    print("2")
        except:
            print("An exception occurred")
    
if __name__=="__main__":
    main()
