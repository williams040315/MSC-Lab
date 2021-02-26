import cv2
import time
def grab_picture():
    camera = cv2.VideoCapture(0)
    _, img = camera.read()
    ts = time.time()
    cv2.imwrite("C:/Users/Williams/.node-red/lib/media/grab_"+str(ts)+".png",img)
    print("grab_"+str(ts)+".png")

if __name__=="__main__":
    grab_picture()
