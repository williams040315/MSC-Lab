#!/usr/bin/env python
from importlib import import_module
import os
from flask import Flask, render_template, Response, request
from camera_opencv import Cameras
import cv2
#from flask_cors import CORS


app = Flask('MY app')
#CORS(app)

def render():
    template = '<html>'+'<head></head>'+'<body>'+'<div style="text-align: center;">'+'<img id="camera" style="margin: 0 auto;" src="/video_feed">'+'</div>'+'</body>'+'</html>';
    return template

@app.route('/')
def index():
    """Video streaming home page."""
    return render()

@app.route('/quit')
def quit():
    func = request.environ.get('werkzeug.server.shutdown')
    func()  
    return "Quitting..."

global order
order = "live"
    
@app.route('/mappingcolor<id>')
def mappingcolor(id):
    Cameras.updateColor('#'+str(id))
    return render()

@app.route('/mode<id>')
def mode(id):
    Cameras.updateMode(int(id))
    return render()

@app.route('/invert<id>')
def invert(id):
    if id == 'ON':
        Cameras.updateInvert(True)
    else :
        Cameras.updateInvert(False)        
    return render()

@app.route('/map<id>')
def map(id):
    if id == 'ON':
        Cameras.updateMap(True)
    else :
        Cameras.updateMap(False)        
    return render()

@app.route('/exposure<id>')
def exposure(id):
    Cameras.updateExposure(int(id))
    return render()

@app.route('/thresh<id>')
def thresh(id):
    Cameras.updateThresh(int(id))
    return render()

@app.route('/liveOn')
def liveOn():
    global order
    order = "liveOn"
    return render()

@app.route('/liveOff')
def liveOff():
    global order
    order = "liveOff"
    return render()

@app.route('/setColor')
def setColor():
    global order
    order = "setColor"
    return render()

@app.route('/grab')
def grab():
    global order
    order = "grab"
    return render()

def gen(camera):
    """Video streaming generator function."""
    while True:
        if order != "liveOff":
            frame = camera.get_frame()
            yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame+ b'\r\n')
        if order == "grab" or order == "liveOff":
            break

@app.route('/video_feed')
def video_feed():
    """Video streaming route. Put this in the src attribute of an img tag."""
    return Response(gen(Cameras()),mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', threaded=True, debug=True)
