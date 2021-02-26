#!/usr/bin/env python3
# -*- coding: utf-8 -*-

'''
Detect the cells with u-net, superimpose a mask, count them etc..
Syntax examples:
    * sentence 0 = python detect_cells.py -f fullpath_to_movie -m relative_path_model
    * simple video with cells counting :
        * sentence 0
    * graph of number of cells :
        * sentence 0  --video --graph_nb_cells
    * graph of number of cells with growth rate fit without video :
        * sentence 0  --video --nb_fit 0
    * video with prediction mask :
        * sentence 0  --video --nb_fit 0
    * graphs of comparison or validation test with RFP for various threshold  :
        * sentence 0  --rfp 'addr-RFP.tif' --optim_thresh --no video
Options :
    * --film : film on which is made the detection (tif, avi, mp4)
    * --rfp : RFP mask for producing the comparison OTSU u-net
    * --model : model used
    * --track : if no argument, it activates tracking on all first cells detected
        * a list of cells can be given
    * --nb_denoising : nb of denoising applied on the image for easing the segmentation
    * --nb_fits : indicate the number of fits to be done
    * --ellipse : superimpose ellipses around the prediction shapes.
    * --contours : draw the contours
    * --graph_nb_cells plot the graph of the number of cells with time
    * --fit_growth : fit the exponential growing curve
    * --insert_graph : insert the graph of number of cells in the video
    * --video : video produced
    * --optim_thresh : find the optimal post prediction thresholding
    * --show_pred : show the predicted shapes.
    * --stop_at_pred : just go until predictions
    * --gray_img : producte gray images
    * --dil_cntrs : show dilated contours
    * --frontiers : show the frontiers used for segmentation
    * --nuclei : show nuclei
    * --show_fluo : show fluo in the image using OTSU
    * --rem_imgs : don't take into account of  missing pictures
    * --num_cell : for each cell show its Id nb
    * --save_proc : save the directory with processed images
    * --save_orig : save the directory with original images

To install:

Need the installation of ffmpeg (put copy in System32 for Windows)
Tensorflow version >= 2.2.0
conda install -c anaconda keras-gpu
pip install tensorflow-gpu==2.2.0

Created by Lionel 15/7/2020
'''
##
from gevent import monkey
monkey.patch_all()
##
# import eventlet
# eventlet.monkey_patch()
##
import os
opb = os.path.basename
opd = os.path.dirname
from pathlib import Path
from datetime import datetime
from time import time, sleep
import threading
import random
import json
import shutil as sh
import argparse
##
from PIL import Image
##
import numpy as np
##
from matplotlib.backends.backend_agg import FigureCanvasAgg
from matplotlib.figure import Figure
from matplotlib import pyplot as plt
import cv2
##
from flask_socketio import SocketIO, emit


class FIND_CELLS():

    def __init__(self):
        self.hop = 0
