import cv2
import time
def main():
    camera = cv2.VideoCapture(0)
    while True:
        _, img = camera.read()
        ts = time.time()
        cv2.imwrite("C:/Users/Williams/.node-red/lib/media/test"+str(ts)+".png",img)
        print("test"+str(ts))
        break

if __name__=="__main__":
    main()
