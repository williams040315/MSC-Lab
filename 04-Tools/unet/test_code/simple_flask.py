'''
Simple flask app for testing
'''
from __future__ import print_function, division, absolute_import
from gevent import monkey
monkey.patch_all()
##
# import eventlet
# eventlet.monkey_patch()

import errno, os, sys, csv, json, glob, logging
opd, opb, opj = os.path.dirname, os.path.basename, os.path.join
import shutil as sh
from colorama import Fore, Back, Style      # Color in the Terminal
import time
from datetime import datetime
import subprocess
import multiprocessing
#import asyncio
##
import threading, webbrowser
from sys import platform as _platform
#from util.mail import send_email
##
from matplotlib import pyplot as plt
import numpy as np
##
from flask import Flask, render_template, request, redirect    # Flask imports
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

from detect_cells import FIND_CELLS

@app.route('/')
def hello_world():
    return 'Hello, World!'

def find_chrome_path(platf):
    '''
    '''
    # MacOS
    if platf == 'mac':
        chrome_path = 'open -a /Applications/Google\ Chrome.app %s'
    # Linux
    elif platf == 'lin':
        chrome_path = '/usr/bin/google-chrome %s'
    else:
        chrome_path = False
    return chrome_path

def find_platform():
    '''
    Find which platform is currently used
    '''
    print('platform is ',_platform)
    if _platform == "linux" or _platform == "linux2":
       platf = 'lin'
    elif _platform == "darwin":
       platf = 'mac'
    elif _platform == "win32":
       platf = 'win'
    return platf

def try_nb(s):
    try:
        return int(s)
    except ValueError:
        pass
    try:
        return float(s)
    except ValueError:
        pass
    return s

def launch_browser(port, host, platf):
    '''
    Launch Chrome navigator
    '''
    chrome_path = find_chrome_path(platf)
    url = "http://{0}:{1}".format(host,port) #
    if platf != 'win':
        b = webbrowser.get(chrome_path)
        threading.Timer(1.25, lambda: b.open_new(url)).start()    # open a page in the browser.
    else:
        try:
            print('using first path')
            subprocess.Popen('"C:\Program Files\Google\Chrome\Application\chrome.exe" {0}'.format(url))
        except:
            print('using second path')
            subprocess.Popen('"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" {0}'.format(url))

if __name__ == '__main__':
    platf  = find_platform()
    port = 5005; host = 'localhost' if platf == 'win' else '0.0.0.0'
    # port = 5000 8080
    print("host is " , host)
    launch_browser(port, host, platf)
    #app.run(port = port, host = host)
    socketio.run(app, port = port, host = host)
