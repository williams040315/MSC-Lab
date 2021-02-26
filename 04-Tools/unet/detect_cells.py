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
    * --save_in, directory where are saved the results
    * --one_color  make the segmentation with only one color
    * --erode_after_pred make erosion step after prediction
    * --dilate_after_pred make dilation step after prediction

To install:

Need the installation of ffmpeg (put copy in System32 for Windows)
Tensorflow version >= 2.2.0

conda install -c anaconda keras-gpu
pip install tensorflow-gpu==2.2.0

If the interface is used:

pip install flask-socketio
pip install gevent
pip install eventlet

Created by Lionel 15/7/2020
'''

import os, sys
op = os.path
opb, opd, opj = op.basename, op.dirname, op.join
from pathlib import Path
from datetime import datetime
from time import time, sleep
import pickle as pkl
import threading
import random
import json
import shutil as sh
import argparse
from modules_unet.params import define_params
##
from tensorflow.keras import models
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
from flask_socketio import emit
##
curr_path = opd(__file__)
sys.path.append(opj(curr_path,'modules_unet'))
##
from util_predict import UTIL
from count_fluo import COUNT_FLUO
from track_and_segment import TRACK_SEGM as TS
from fit_growth import FIT_GROWTH as FG
from read_extract import READ_EXTRACT as RE
from plots import PLOTS as PL
from prepare_after_pred import PREPARE_AFTER_PRED as PP
from add_to_pic import ADD_TO_PIC as AP
from transformations import TRANSFORMATIONS as TR
from masks import MASKS as MK
from save_results import SAVE_RESULTS as SR
from util_server import *
from util_misc import *
from utils.find_bad_pics import FIND_BAD_PICS as FB
from make_prediction import pred

platf  = find_platform()
server = chose_server(platf)

class FIND_CELLS(TS, FG, RE, PL, PP, AP, TR, MK, SR, FB):

    def __init__(self, dic_args=None, kind_proc='analysis'):
        '''
        dic_args : dictionary with arguments for  detect_cells.py
        '''
        ldep = [TS, FG, RE, PL, PP, AP, TR, MK, SR, FB]
        [dep.__init__(self) for dep in ldep]            # init for all the inheritances
        self.ext = 'tiff'                               # image extension
        self.video_speed = 5                            # video speed
        parser = argparse.ArgumentParser(description='apply u-net to a video')
        parser = define_params(parser)                  # in module_unet/params.py
        self.args = parser.parse_args()
        if dic_args:
            #print(f'#################### dic_args : {dic_args}')
            self.args_from_interface(dic_args)
        print("###### ")
        print("self.args.film ", self.args.film)
        self.define_model_name()                # define model from shortcut or full name
        self.load_models()                      # loading the models
        self.thresh_pred()                      # setting self.thresh_after_pred
        self.contour_size = 3                   # default contour size
        self.contours = {}                      # dictionary of all the contours for each image
        self.contours_events = {}               # dictionary of all the contours for events detection
        self.beg_obs_bud = None                 # first fram where is observed the bud
        self.contours_pred = {}                 # dictionary of all the contours pred for each image
        self.max_nb_cells = 1700                # max value on the y axis for plots
        self.slope = 0.7                        # slope for detecting the plateaux
        self.ratio_fit = float(self.args.ratio_fit)           # part of interval taken from beginning for fitting..
        self.nb_fits = int(self.args.nb_fits)         # number of fits decided by the user
        self.factor_growth = 6                  # factor for having growth in cells/hour
        self.size = 512                         # picture size for u-net
        self.sleep_time = 0.01
        self.random_colors()                    # create random colors
        self.cf = COUNT_FLUO()                  # RFP counting class
        self.show_fluo = self.args.show_fluo
        ##
        self.erode_for_track = 3                # erosion for improving tracking by separating well the buds
        self.iter_erode_for_track = 3           # iterations on erosion for avoiding bud issues.. (exchange number)
        self.dil_last_shape = 3                 # dilate after tracking has been done..
        self.iter_dil_last_shape = 3            # iterations for dilate after tracking has been done..
        self.thresh_nuclei = 30                 # nuclei thresholding
        self.list_curv_nb_cells = []            # list of the curves of the number of cells in function of the frames..

        ### Parsed arguments

        self.choice_of_method()
        if self.nb_fits >= 0 and self.nb_fits != 99:            # fit for cells counting
            self.args.graph_nb_cells = True                     # produce a figure with growth fit
        self.insert = self.args.show_pred or \
                      self.args.insert_graph or \
                      self.args.contours
        self.insert_nuclei = self.args.nuclei
        self.shift_fluo = 0                                      # corection of index for missing images
        if self.args.rem_imgs:                                   # images to ignore
            self.rem_imgs = json.loads(self.args.rem_imgs)
        else:
            self.rem_imgs = [] # list of the image to be ignored
        if self.args.track != 'all':                             # tracking with a list
            if type(self.args.track) == 'str':                   # list of cells to follow
                self.args.track = json.loads(self.args.track)    # from str to list
        if self.args.rfp :
            self.args.rfp = self.args.film.replace('BF','RFP')   # name of the film but with RFP in place of BF

        ## Server

        self.ts_sleep = 0.05          # time server sleep

        ### Begin the different processings

        if self.args.optim_thresh:                                      # comparison between OTSU and unet with different thresholds for finding the optimum..
            self.test_optim_thresh()                                    # validation and optimization plots
        elif kind_proc == 'analysis':
            self.analysis()                                             # simple analysis
        elif kind_proc == 'analysis_cyber':
            self.analysis_cyber()                                       # simple cyber analysis

    def thresh_pred(self, thresh=None):
        '''
        '''

        try:
            self.thresh_after_pred = self.args.thresh_after_pred
        except:
            self.thresh_after_pred = thresh
            print('### using default threshold !!!!! ')
        print(f"#### at the beginning, self.thresh_after_pred is {self.thresh_after_pred}")

    def load_models(self):
        '''
        Loading the models
        '''
        self.model_loaded = models.load_model( Path('models') / self.args.model )
        if self.args.model_events:
            self.model_events_loaded = models.load_model( Path('models') / self.args.model_events )
        else:
            self.model_events_loaded = None
        self.lm_loaded = [ self.model_loaded, self.model_events_loaded ]

    def define_model_name(self):
        '''
        Find the models names from shortcuts
        '''

        addr_models_json = str( Path('modules_unet') / 'models.json' )
        with open(addr_models_json, "r") as f:
            self.alias_models = json.load(f)
            print(f"self.alias_models is { self.alias_models } ")
            print(f'self.alias_models[self.args.model]  { self.alias_models[self.args.model] } ')
        try:
            print(f'using shortcut { self.args.model } for model ')
            self.args.model = self.alias_models[self.args.model]                            # from shortcut to full name
        except:
            print('shortcut for model not found')
        try:
            self.args.model_events = self.alias_models[self.args.model_events]              # from shortcut to full name
        except:
            print('shortcut for model events not found')

    def choice_of_method(self):
        '''
        Segmentation method
        '''
        print(f"self.args.method {self.args.method} ")

    def args_from_interface(self,dic_args,debug=0):
        '''
        Retrieving the arguments from the interface
        '''
        for k,v in dic_args.items():
            if debug > 0: print(k,v)
            setattr(self.args, k, v)

    @timing
    def test_optim_thresh(self):
        '''
        Test optimum threshold for post processing by comparison with OTSU method..
        In the same time it can be used as a validation test.
        '''

        lth = range(10,50,100)           # range of thresholds
        #lth = range(40,80,10)
        for thresh in lth:
            self.thresh_after_pred = thresh
            self.analysis()
        self.separated_plots_for_test_thresh(lth)

    def state_message(self, num, text=None):
        '''
        Messages indicating the current processing step
        '''

        mess = [\
                 'begin processing',
                 'addresses and folders OK',
                 'doing the predictions..',
                 'predictions OK',
                 'processing (post prediction)..',
                 'processing end',
                 ]
        try:
            if text:
                message = mess[num].format(text)
            else:
                message = mess[num]
            print( "## ## ## sending message ", message )
            emit('state', { 'mess': message })
        except:
            print('issue with emit with websocket')
        sleep(self.sleep_time)

    @timing
    def analysis(self):
        '''
        Basic analysis of a video
        '''

        self.state_message(0)
        self.prepare_analysis() ##                           # prepare addresses, folders etc..
        self.state_message(1)
        self.state_message(2)
        server.sleep(self.ts_sleep)
        self.predict()   ##                                  # make predictions
        server.sleep(self.ts_sleep)
        self.state_message(3)
        self.state_message(4)
        self.process_after_predictions()  ##                 # Find contours, number of cells etc
        server.sleep(self.ts_sleep)
        self.state_message(5)
        if self.args.video: self.create_video()              # create videos with ffmpeg
        self.save_proc_results()                             # if segmentation and tracking, save the contours

    @timing
    def analysis_cyber(self):
        '''
        Basic analysis for cyber
        '''
        self.predict()   ##                                  # make predictions

    def list_of_bad_pics(self):
        '''
        Make the list of pics not to process
        '''
        if self.args.rem_bad_pics:
            self.find_bad_pics_in_folder(self.output_folder, kind='contrast', margin_down=5 )    # make list of bad pics
            self.rem_imgs = self.ind_bad_pics
            print(f"### *** ### Removing pics {self.rem_imgs}")
            ##
            sleep(self.sleep_time)
            emit( 'skipped_images', { 'mess': json.dumps(self.rem_imgs) } ) #
            server.sleep(self.ts_sleep)

    def prepare_analysis(self):
        '''
        Prepare the folders, the names, addresses and extract images for processing
        '''

        self.remove_folders()              # remove the temporary folders
        self.prepare_paths_and_names()
        self.prepare_folders()             # prepare the folders for the images, the predictions etc..
        self.extract_images()              # extract images from films before analysis
        self.list_of_bad_pics()            # pics which will not be processed

    @property
    def date(self):
        '''
        Return a string with day, month, year, Hour and Minute..
        '''

        now = datetime.now()
        dt_string = now.strftime("%d-%m-%Y-%H-%M")
        return dt_string

    def generic_result_name_dir_temp(self, kind_result):
        '''
        '''
        comm1 = str(self.dir_result_temp / (kind_result + '_' + self.name_film + '_' + self.model\
                         + '_sp' + str(self.video_speed) + self.thresh + '_' + self.date))
        return comm1

    def generic_result_name_dir(self, kind_result):
        '''
        '''
        comm1 = str(self.dir_result / (kind_result + '_' + self.name_film + '_' + self.model\
                         + '_sp' + str(self.video_speed) + self.thresh + '_' + self.date))
        return comm1

    def take_num_frame_png(self,elem):
        '''
        for png pictures
        '''
        return int(elem[5:-4])

    def make_list_imgs_for_video(self, debug=1):
        '''
        '''
        folder = opj('predictions', 'movie', self.pred_dir_imgs)
        ll = os.listdir(folder)
        list_imgs_sorted = sorted(ll, key = lambda i: self.take_num_frame_png(i)) #
        if debug>0:
            print(f'## ll is {ll}')
            print(f'## list_imgs_sorted is {list_imgs_sorted}')
        self.list_imgs_vid = []
        for f in list_imgs_sorted:
            img = cv2.imread(opj(folder,f))
            self.list_imgs_vid.append(img)

    def create_video(self):
        '''
        Create a video
        '''

        if not self.args.stop_at_pred:
            self.make_list_imgs_for_video()
            ##
            addr_movie = self.generic_result_name_dir('movie')
            out = cv2.VideoWriter(f'{addr_movie}.avi', cv2.VideoWriter_fourcc(*'DIVX'), 15, (self.size, self.size))
            for img in self.list_imgs_vid:
                out.write(img)
            out.release()

    def handle_fluo(self, num):
        '''
        Deals with counting the number of cells with RFP and drawing the countours on RFP masks..
        '''

        addr_fluo = Path('test') / 'movie_fluo' / ( 'frame' + str(num) + '.' + self.ext )
        print("###### addr_fluo is ", addr_fluo)
        self.cf.count_cells( addr_fluo )          # counting cells with RFP information
        if self.show_fluo:
            #cv2.drawContours(self.img_mask, self.cf.contours, -1, (0, 0, 255), self.contour_size) # draw contours with RFP
            cv2.drawContours(self.img, self.cf.contours, -1, (0, 0, 255), self.contour_size) # draw contours with RFP

    def count_BF_cells(self, num, contours, debug=0):
        '''
        Counting the number of cells in the BF image
        '''

        self.arr_nb_cells[num] = len(contours)                 # cells number from contours
        if debug > 0: print("#### nb_cells  ", self.arr_nb_cells[num])

    def processings_on_contours(self, num, all_cntrs):
        '''
        Performing various processings on the contours.
        '''

        contours, contours_events = all_cntrs
        self.count_BF_cells(num, contours)             # count BF cells number..
        self.dilate_mask_shapes(2)                     # dilate mask for Floodfill
        if not self.args.show_pred:
            self.img_mask[ self.img_mask > 0 ] = 0     # zeroing the whole mask
        if self.args.contours:
            cv2.drawContours(self.img_mask, contours, -1, (0, 255, 0), self.contour_size)
        if self.args.track:
            self.cell_tracking_and_segmentation(num, all_cntrs)        # segment and track the cells
        if self.args.rfp:
            try:
                self.handle_fluo(num + self.shift_fluo)                # count and show RFP signal
            except:
                print('cannot handle fluo, probably index issue')
        if self.args.ellipse:
            self.make_ellipses(contours)         # make ellipses
        self.insert_cell_nb(num)                 # insert the number of cells in the video
        if self.args.insert_graph:
            self.insert_curve_cell_nb()          # insert the curve of cells number in the video .

    def add_previous_seg(self):
        '''
        Use previous mask for making the union with partial signal
        '''

        try:
            for mask in self.dic_mask_seg:
                self.img_mask[ mask == (255,255,255) ] = (255,255,255)
        except:
            print('no addition of previous segmentation mask..')

    def find_contours(self, img, save_cntrs=True, debug=1):
        '''
        Find the contours from the u-net predictions
        '''

        self.add_previous_seg()                                    # reinject previous segmentation in the mask
        imgray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)             # self.img_mask
        ret, thresh = cv2.threshold(imgray, 127, 255, 0)
        contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)[-2:]
        if debug > 0: print("### len(contours) ", len(contours))
        if save_cntrs: self.contours_pred[self.num] = contours
        self.nb_cntrs = len(contours)
        #
        return contours

    def add_weighted_images(self):
        '''
        Superimpose images to the original BF image
        '''

        if self.insert :
            added_image = cv2.addWeighted( self.img, 0.9, self.img_mask, 0.5, 0 )               # add contour on the cells
        else:
            added_image = self.img
        if self.insert_nuclei :
            added_image = cv2.addWeighted( self.img, 0.9, self.img_mask_nuclei, 0.5, 0 )        # add nuclei
        return added_image

    def find_contours_events(self):
        '''
        Determine the contours for the predicted events (buds etc..)
        '''

        try:
            contours_events = self.find_contours(self.img_mask_event)                      # find the contours on events prediction
            return contours_events
        except:
            print('A priori no contours events')
            return None

    def process_one_image(self, im):
        '''
        Load image and prediction mask, find contours and make image processings
        '''

        self.load_image_and_mask(im)
        ##
        if self.insert_nuclei : self.make_mask_nuclei()
        self.prepare_masks()                                                           # thresholding on predictions (self.thresh_after_pred)
        contours = self.find_contours(self.img_mask)                                   # find the contours on prediction
        contours_events = self.find_contours_events()
        all_cntrs = [contours, contours_events]
        self.processings_on_contours(self.num, all_cntrs)                              # count or make segmentation

    def superimpose_on_image(self):
        '''
        Superimpose informations and save
        '''

        added_image = self.add_weighted_images()
        cv2.imwrite( str(self.addr_im_mask), added_image )             # save the composite image (pic + mask)

    def send_num(self):
        '''
        Send the number of the current processed pic
        '''

        try:
            sleep(self.sleep_time)
            num_pic_over_tot_pics = str(self.num) + '/' + str(self.nb_imgs)
            emit( 'num_im', { 'mess': num_pic_over_tot_pics } ) # send the current num of pic processed over total nb of pics
        except:
            print('out of context')
        server.sleep(self.ts_sleep)

    def process_images_and_draw_curves(self, list_pred):
        '''
        Process each image using both the prediction and BF original image
        '''

        self.length = len(list_pred)
        self.find_max_nb_cells(list_pred[-1])          # find number max of cells
        for im in list_pred:                           # for each image in the prediction list..
            self.num = self.take_num(im)               # retrieve the num of the image
            if self.num in self.rem_imgs:              # images not used
                self.shift_fluo += -1                  # if BF image not here, shift fluo index
            else:
                self.send_num()                        # send num im to the interface
                self.process_one_image(im)             # processing on one image
                if self.args.track or self.args.show_pred:
                    self.superimpose_on_image()
            server.sleep(self.ts_sleep)
            self.emit_addr_curr_pic()
        plt.figure()
        self.draw_curves(plt, mpl=True)
        plt.legend()

    def make_list_for_pred(self, debug=0):
        '''
        Sorting the predictions
        '''

        try:
            not_sorted_list_pred = os.listdir( str(self.dir_movie_pred) )
        except:
            not_sorted_list_pred = os.listdir( str(self.dir_movie_pred_events) )
        list_pred = sorted(not_sorted_list_pred, key = lambda i: self.take_num(i)) # sorted list of the pred
        # not_sorted_list_pred_events = os.listdir(str(self.dir_movie_pred_events))
        # list_pred_events = sorted(not_sorted_list_pred_events, key = lambda i: self.take_num(i)) # sorted list of the pred events
        if debug > 0: print("#### list_pred ", list_pred)

        return list_pred #, list_pred_events

    def make_contour_and_superimpose(self, debug=0):
        '''
        Superimpose the prediction mask on the original pictures..
        '''

        self.dilate = False
        list_pred  = self.make_list_for_pred()
        self.nb_imgs = len(list_pred)
        self.arr_nb_cells = np.zeros( len(list_pred) )
        self.process_images_and_draw_curves( list_pred )     # process the images one after another
        if debug > 0: self.debug_SG()
        if self.args.optim_thresh:
            self.list_curv_nb_cells.append(self.arr_nb_cells)
        else:
            if self.args.graph_nb_cells:
                self.save_graph_nb_cells()

    def predict(self):
        '''
        Make the predictions with models on self.film
        '''
        for i , m in enumerate([ self.args.model, self.args.model_events ]):                     # applying the models
            if m:
                pred('movie', m, self.lm_loaded[i], self.name_film)
            else:
                print(f'cannot make prediction with model {m} !!!')
        self.settings_after_main_seg_pred()                             # prepare addresses before segmentation and tracking

    def process_after_predictions(self):
        '''
        Find contours, number of cells etc..
        '''

        if not self.args.stop_at_pred:
            self.make_contour_and_superimpose()

if __name__ == '__main__':
    fc = FIND_CELLS()
