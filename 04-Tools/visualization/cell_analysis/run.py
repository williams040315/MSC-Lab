#!/usr/bin/env python
# encoding: utf-8

"""

Image Analysis program

pip install flask-socketio
pip install eventlet
pip install eventlet==0.26 (for Windows)

python -m image_analysis.run

"""
from __future__ import print_function, division, absolute_import

import errno, os, sys, csv, json, glob, logging, re
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
from cell_analysis.modules.pages.define_all_pages import *
from cell_analysis.modules.util_interf import *
#from modules_unet.util_misc import *

platf  = find_platform()

if platf =='win':
    import gevent as server
    from gevent import monkey
    monkey.patch_all()
else:
    import eventlet as server
    server.monkey_patch()

Debug = True            # Debug Flask

app = Flask(__name__)
app.config['UPLOADED_PATH'] = opj(os.getcwd(),'cell_analysis','static','upload')              # upload directory from the Dropzone
print("######### app.config['UPLOADED_PATH'] is {0} !!!".format(app.config['UPLOADED_PATH']))
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = 'F34TF$($e34D';
socketio = SocketIO(app)

#from detect_cells import FIND_CELLS

@socketio.on('connect') #  , namespace='/test'
def test_connect():
    '''
    Websocket connection
    '''
    emit( 'response', { 'data': 'Connected' } )
    server.sleep(0.05)
    infos_hard_soft()                                             # infos about hardware ans software

def save_file(f, full_path, debug=0):
    '''
    Save full f in full_path
    '''
    try:
        f.save(full_path)
    except IOError as e:
        # ENOENT(2): file does not exist, raised also on missing parent dir
        if e.errno != errno.ENOENT:
            raise
        # try creating parent directories
        os.makedirs(os.path.dirname(full_path))    # Makes folder
        f.save(full_path)                          # Save locally the file in the folder upload
        if debug>0: print( f"###################### Saved file {full_path} !!!! " )


@app.route('/', methods=['GET', 'POST'])
def upload_file(debug=1):
    '''
    Upload the datasets from the Dropzone
    with the same tree structure and make the processing list.
    '''
    dup = define_upload_page()
    if request.method == 'POST':
        for f in request.files.getlist('file'):                   # retrieves files names
            file_in_folder_path = request.form.get('fullPath')
            if debug>0: print( f"file_in_folder_path are {file_in_folder_path} " )
            full_path = os.path.join(app.config['UPLOADED_PATH'], file_in_folder_path)
            save_file(f, full_path)
            if re.findall('proc_\d+-\d+.+frame0.png', file_in_folder_path):
                fold = opj('static','upload', opd(file_in_folder_path))
                print(f"address to be sent is {fold}")
                emit('server_res_dir', { 'mess': fold }, namespace='/', broadcast=True)

    return render_template('index_folder.html', **dup.__dict__)

def full_addr(list_files):
    '''

    '''
    lf0 = [f.replace('box_','') for f in list_files]
    print("lf0 is ", lf0)
    lf1 = [os.path.join(app.config['UPLOADED_PATH'],f) for f in lf0]
    return lf1

@app.route('/visu_results', methods = ['GET', 'POST'])
def visu_results(debug=0):
    '''
    Page for data visualization
    Possibility to visualize the processing with the associated controls
    '''
    define_visu_results()

    return render_template('visu_results.html', **define_visu_results().__dict__) #

@app.route('/processed', methods = ['GET', 'POST'])
def processed(debug=0):
    '''
    List of all the previous processings for reexaminating them or erasing them.
    '''
    define_processed()

    return render_template('processed.html', **define_processed().__dict__) #

def shutdown_server():
    '''
    Quit the application
    called by method shutdown() (hereunder)
    '''
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()

@app.route('/shutdown')
def shutdown():
    '''
    Shutting down the server.
    '''
    shutdown_server()

    return 'Server shutting down...'

def message_at_beginning(host,port):
    '''
    '''
    print( Fore.YELLOW + """
    ***************************************************************
    Launching the Image Analysis program

    address: {0}:{1}

    Drop the dataset in the drop zone,
    select the operation
    and click on "processings"

    Addons :

    pip install flask-socketio
    pip install gevent (Windows)
    pip install eventlet

    """.format(host,port) )

if __name__ == '__main__':
    init(app.config)                         # clean last processings and upload folders

    port = 5053; host = '0.0.0.0' if platf == 'win' else '0.0.0.0'
    # port = 5000 8080
    print("host is " , host)
    launch_browser(port, host, platf)
    message_at_beginning(host,port)
    print(Style.RESET_ALL)
    socketio.run(app, port = port, host = host)
