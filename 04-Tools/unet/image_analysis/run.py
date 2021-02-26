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

import yaml
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
from image_analysis.modules.pages.define_all_pages import *
from image_analysis.modules.util_interf import *
from modules_unet.util_misc import *

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
app.config['UPLOADED_PATH'] = opj(os.getcwd(),'image_analysis','upload')              # upload directory from the Dropzone
print("######### app.config['UPLOADED_PATH'] is {0} !!!".format(app.config['UPLOADED_PATH']))
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = 'F34TF$($e34D';
socketio = SocketIO(app)

from detect_cells import FIND_CELLS

@socketio.on('connect') #  , namespace='/test'
def test_connect():
    '''
    Websocket connection
    '''
    emit( 'response', { 'data': 'Connected' } )
    server.sleep(0.05)
    infos_hard_soft()                                             # infos about hardware ans software

@socketio.on('operation') #
def set_curr_op(operation):
    '''
    Select the operation
    '''
    global op
    op = operation
    print(f'current operation is {op} ')

@socketio.on('kind_track') #
def set_kind_track(track):
    '''
    Select the kind of tracking
    '''
    global kind_track
    kind_track = track
    print(f'current kind of tracking is { kind_track } ')

@socketio.on('params') #
def retrieve_params(prms):
    '''
    Retrieve the parameters from the interface
    '''
    global params
    params = json.loads(prms)

def select_dic_proc(params):
    '''
    Begin to build dic_proc
    '''
    dic_proc = {}
    dic_op =  {'nbcells':'ep5_v3', 'segm':'ep5_v3', 'test':'ep5_v3'}     # choice and associated model
    dic_proc.update( { 'model':dic_op[op] } )
    dic_proc.update( { 'kind_track': kind_track } )
    for p in params:
        elem = translate_params(p)    # interpret the params inputs for detect_cells.py
        print( f'elem is {elem}' )
        try:
            dic_proc.update(elem)
        except:
            print( f'not working for elem = {elem}' )
    return dic_proc

def make_dic_proc(i,addr):
    '''
    Build the dictionary used for the processing
    '''
    print("current op in make_on_proc is ", op)
    dic_base = select_dic_proc(params)
    print( f"dic_base {dic_base}" )
    dic_proc = { 'film': addr }
    dic_proc.update(dic_base)
    try:
        print('save_in',save_in)
    except:
        save_in = '.'
    dic_proc.update({'save_in':save_in}) # reuse previous directory
    print( f"dic_proc is {dic_proc}" )
    return dic_proc

def make_one_proc(i,addr):
    '''
    Process one dataset
    '''
    global save_in
    dic_proc = make_dic_proc(i,addr)
    t0 = time.time()
    fc = FIND_CELLS(dic_proc)
    save_in = fc.dir_result
    t1 = time.time()
    tproc = round((t1-t0)/60,2)
    print( f'time elapsed for processing is {tproc} min ' )
    emit('time_one_proc', { 'mess': str(tproc) })
    server.sleep(0.05)

def currproc_done(addr):
    '''
    Message indicating the processing is finished
    '''
    emit('proc_done', {'mess': opb(addr)})            # sending address of the completed processing
    server.sleep(0.05)

def done_and_currproc(i, lengthdata, addr):
    '''
    Ratio of processings done
    '''
    emit('ratio', {'mess': 'processing : ' + str(i+1) + '/' + lengthdata  })
    server.sleep(0.05)
    emit('curr_proc', {'mess': addr})            # sending address of current processed file
    server.sleep(0.05)

def process(dict_data, debug=1):
    '''
    Apply the processing on the datasets registered in the list dict_data.
    dict_data: list of files to be processed
    '''
    if debug>1: print( f"######## dict_data is {dict_data} " )
    tt0 = time.time()
    list_processed = []
    lengthdata = str(len(dict_data))
    for i,addr in enumerate(dict_data):
        print("addr is ", addr)
        if debug> 0: print( f"######## list_processed is {list_processed} " )
        if addr not in list_processed  :                # if not yet processed
            done_and_currproc(i, lengthdata, addr)
            make_one_proc(i,addr)                                               # performing a processing
            currproc_done(addr)
            list_processed.append(addr)                                         # list of the processed files
            count = int(len(list_processed)/len(dict_data)*100)                 # percent of processings done
            if debug > 0: print( f"#### count {count}% " )
    tt1 = time.time()
    tmin = round((tt1-tt0)/60, 2)
    print( f'total time elapsed is {tmin} min ' )                # time elapsed for the whole processing..
    #path_save_with_date = save_with_date()                      # save the processing in previous_proc
    #return path_save_with_date

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

def infos_hard_soft(debug=[1]):
    '''
    Send to the client informations about computing ressource..
    '''
    try:
        hard_soft_infos = get_computing_infos()
        if 1 in debug: print(f'hard_soft_infos are { hard_soft_infos }')
        emit('hard_soft_infos', { 'mess': json.dumps(hard_soft_infos) })
        server.sleep(0.05)
    except:
        print('working out of context')

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

    return render_template('index_folder.html', **dup.__dict__)

def full_addr(list_files):
    '''

    '''
    lf0 = [f.replace('box_','') for f in list_files]
    print("lf0 is ", lf0)
    lf1 = [os.path.join(app.config['UPLOADED_PATH'],f) for f in lf0]
    return lf1

@socketio.on('launch_proc') #
def proc(list_files, debug=1):
    '''
    Process the data
    '''
    print("##### list_files ", list_files)
    dict_data = full_addr(json.loads(list_files))
    print("### dict_data is ", dict_data)
    ### Processing
    emit('state', {'mess': 'beginning all the processings'})
    server.sleep(0.05)
    process(dict_data)                                  # Processing all the datasets
    server.sleep(0.05)
    emit('end_proc','finished')
    emit('state', {'mess': 'end of the processings'})
    time.sleep(0.1)
    emit('state', {'mess': ''})
    print("######   emitted finished !!!")

@socketio.on('save_addr') #
def proc(save_addr, debug=1):
    '''
    save address
    '''
    global save_in
    print(f"address where to save the processings {save_addr} ")
    save_in = save_addr

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

@app.route('/erase_processed', methods = ['GET', 'POST'])
def erase_processed(debug=0):
    '''
    Erase selected datasets (those checked on the "processed" page)
    '''
    define_processed()
    selected_checks = json.loads(request.form.get('erase_data'))
    print(selected_checks)
    for folder in selected_checks:
        pathf = opj(os.getcwd(), 'static', 'previous_proc', folder.strip())  # path to folders to be deleted
        sh.rmtree(pathf)                                                     # delete the folder
        print( f"removed {folder} " )

    return render_template('processed.html', **define_processed().__dict__) #

@app.route('/reload', methods = ['GET', 'POST'])
def reload(debug=0):
    '''
    Reload an old dataset
    Erase processings and controls folders and replace by the ones of the old processing
    '''
    selected_check = json.loads(request.form.get('reload_data'))[0].strip()
    print(selected_check)
    path_proc = opj(os.getcwd(), 'static', 'processings')           # path to the processings
    path_ctrl = opj(os.getcwd(), 'static', 'controls')              # path to the controls
    path_list_proc = opj(os.getcwd(), 'static', 'list_proc.json')

    # Erase old

    sh.rmtree(path_proc)                                                 # Delete Processings
    sh.rmtree(path_ctrl)                                                 # Delete Controls
    pathf = opj(os.getcwd(), 'static', 'previous_proc', selected_check)  # Path to previous processings

    # Copy reload

    sh.copytree(opj(pathf, 'processings'), path_proc)           # Put back the Processings
    sh.copytree(opj(pathf, 'controls'), path_ctrl)              # Put back the Controls
    sh.copy(opj(pathf, 'list_proc.json'), path_list_proc)       # Put back the list_proc.json
    define_visu_results()

    return render_template('visu_results.html', **define_visu_results().__dict__) #

def prepare_folder_download(debug=0):
    '''
    Delete and recreate folder in Download folder.
    '''
    if debug>0: print('##########  prepare_folder_download  !!!')
    for dst_fold in ['Downloads', 'Téléchargements']:
        d = op.join(os.path.expanduser('~'), dst_fold)
        dst = op.join(d, 'Results')
        if os.path.exists(dst):
            try:
                if debug>0: print("trying to erase folder {}".format(dst))
                shutil.rmtree(dst)               # Delete destination folder if it exists
            except:
                print('######  could not find the folder {0}'.format(dst))
        try:
            os.mkdir(dst)        # Recreating the folder dst
            if debug>0: print(f'############### using the folder {dst}')
            return dst
        except:
            print('############### cannot make {0} folder'.format(dst))

    return dst

@app.route('/open_download', methods = ['GET', 'POST'])
def open_download(debug=0):
    '''
    Open the folder in the system Download folder where stand the downloaded processings.
    '''
    for dst_fold in ['Downloads', 'Téléchargements']:
        d = op.join(os.path.expanduser('~'), dst_fold)
        dst = op.join(d, 'All_ILT_results')
        if os.path.exists(dst):
            addr_download = dst
        else:
            print('not the right path')
    if debug>0: print('###### in /open_download  !!!')
    open_folder(addr_download) #
    os.remove(opj(os.getcwd(), 'static','download_ready.p'))       # Removing the link

    return redirect(url_for('visu_results'))

@app.route('/download', methods = ['GET', 'POST'])
def download(debug=0):
    '''
    Copy the results files in Home/Download folder
    Makes the copy with the explicit names in a folder named with the date
    The folder contains list_proc.json, processing folder and controls folder
    '''
    dst = prepare_folder_download()
    save_with_date(dest=dst, debug=1)
    path_download_ready = op.join(os.getcwd(), 'static', 'download_ready.p')    # Indicates that the processing is ready for download
    with open(path_download_ready, 'w') as f: f.write('ok')

    return redirect(url_for('visu_results'))

@app.route('/documentation')
def documentation():
    '''
    Documentation about this program.
    Gives informations about the theory, how to use the program etc..
    '''
    dd = define_documentation()

    return render_template('documentation.html', **dd.__dict__)

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

    with open('image_analysis/settings/server_address.yaml') as f:
        addr = yaml.load(f, Loader=yaml.FullLoader)
    port = addr['port']; host = addr['host'] if platf == 'win' else '0.0.0.0'
    # port = 5000 8080
    print("host is " , host)
    launch_browser(port, host, platf)
    message_at_beginning(host,port)
    print(Style.RESET_ALL)
    socketio.run(app, port = port, host = host)
