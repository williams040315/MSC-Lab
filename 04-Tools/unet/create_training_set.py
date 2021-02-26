#!/usr/bin/env python3
# -*- coding: utf-8 -*-

'''
Detect the cells and superimpose a mask
Syntax:
    * python create_training_set.py --new -b fullpath_to_BF_movie -r fullpath_to_RFP_movie
    * python create_training_set.py --mix --d1 fullpath_to_dataset1 --d2 fullpath_to_dataset2
Options
    * --new : create a new training set from videos
    * --mix : mix two yet existing training sets
Created by Lionel 24/7/2020
'''

import os
import random
from pathlib import Path
from datetime import datetime
import json
import shutil as sh
import argparse
from PIL import Image
from matplotlib import pyplot as plt
import numpy as np
import cv2

class CREATE_TRAINING_SET():

    def __init__(self):
        '''
        '''
        self.ext = 'tiff'            # image extension
        self.size = 512
        self.nb_pics = 20
        parser = argparse.ArgumentParser(description='apply u-net to a video')
        parser.add_argument('-b', '--bf', type=str, help='Bright Field')
        parser.add_argument('-r', '--rfp', type=str, help='RFP')
        parser.add_argument('--d1', type=str, help='dataset 1')
        parser.add_argument('--d2', type=str, help='dataset 2')
        parser.add_argument('--new', action='store_true')                   # create a new dataset..
        parser.add_argument('--mix', action='store_true')
        ##
        self.args = parser.parse_args()
        ##
        root = 'build_training_set'
        if self.args.new:
            name_training_set = 'training_' + os.path.basename(self.args.bf)[:-4] + '_' + self.date()
            self.output_folder = Path(root) / name_training_set
            self.new_dataset()
        elif self.args.mix:
            d1 = os.path.basename(self.args.d1).replace('training_','')
            d2 = os.path.basename(self.args.d2).replace('training_','')
            name_training_set = 'training_' + d1 + '_with_' + d2 + '_' + self.date()
            print(name_training_set)
            self.output_folder = Path(root) / name_training_set
            self.mix_datasets()

    def date(self):
        '''
        Return a string with day, month, year
        '''
        now = datetime.now()
        dt_string = now.strftime("%d-%m-%Y") # -%H-%M
        return dt_string

    def copy_randomly_to_dataset(self, path):
        '''
        '''
        p = Path(path)
        p1m, p1i = p / 'masks', p / 'images'
        paired_list = list(zip(os.listdir(p1m),os.listdir(p1i)))
        random_pairs = random.choices(paired_list, k=self.nb_pics//2)
        for image, mask in random_pairs:
            sh.copy(p1i / image,  self.output_folder / 'images' / image.replace('frame',''))
            sh.copy(p1m / mask,  self.output_folder / 'masks' / mask.replace('frame',''))

    def mix_datasets(self):
        '''
        '''
        self.make_folders()
        self.copy_randomly_to_dataset(self.args.d1)
        self.copy_randomly_to_dataset(self.args.d2)

    def new_dataset(self):
        '''
        Create a new dataset for training from video
        '''
        self.make_folders()
        self.folder = { 0:'images', 1:'masks' }
        self.extract_images()
        self.keep_randomly_files(self.output_folder)

    def make_folders(self):
        '''
        Make the folders for the images and the associated masks .
        '''
        self.path_mask = self.output_folder / 'masks'
        self.path_images = self.output_folder / 'images'
        output, masks, images = self.output_folder, self.path_mask, self.path_images
        try:
            sh.rmtree(output)
        except:
            print(f'no existing folder {output}, will create it.. ')
        lpath = [ output, masks, images ]
        for p in lpath:
            if not os.path.exists(p):
                os.mkdir(p)

    def extract_images(self):
        '''
        Extract the images from the video
        addr_image : address where the images are extracted..
                     and saved with tiff format..
        '''
        for self.type, self.film_addr in enumerate([self.args.bf, self.args.rfp]):
            ext = os.path.splitext(self.film_addr)[1]
            print(f'#### extension is {ext} !!! ')
            self.curr_folder = self.folder[self.type]
            if ext in ['.mp4','.avi']:
                self.read_extract_mp4 ()
            elif ext == '.tif':
                self.read_extract_tif()

    def keep_randomly_files(self, path):
        '''
        '''
        p = Path(path)
        p1m, p1i = p / 'masks', p / 'images'
        paired_list = list(zip(os.listdir(p1m),os.listdir(p1i)))
        random_pairs = random.choices(paired_list, k=self.nb_pics)
        for pair in paired_list:
            if pair not in random_pairs:
                image,mask = pair
                os.remove(p1i / image)
                os.remove(p1m / mask)

    def read_extract_mp4 (self):
        '''
        Extract image from mp4 video..
        '''
        vidcap = cv2.VideoCapture(self.film_addr)
        success, image = vidcap.read()
        count = 0
        while success:
            addr_image = self.output_folder / self.curr_folder / "frame{0}.{1}".format(count, self.ext)
            print(addr_image)
            cv2.imwrite( str(addr_image), image )     # save frame
            success,image = vidcap.read()
            #print('Read a new frame: ', success)
            count += 1

    def resize_img(self, img):
        '''
        Resize the images to the size : self.size
        '''
        res = cv2.resize(img, dsize=(self.size, self.size), interpolation=cv2.INTER_CUBIC) # dsize=(512, 512)
        print("res.shape ", res.shape)
        #
        ####
        dpi_val = 100
        fig = plt.figure(figsize=(self.size/dpi_val, self.size/dpi_val), dpi=dpi_val)
        ax = plt.Axes(fig, [0., 0., 1., 1.])
        ax.set_axis_off()
        fig.add_axes(ax)
        ax.imshow(res, aspect='equal', cmap='gray')

    def read_extract_tif(self):
        '''
        '''
        print("The selected stack is a .tif")
        dataset = Image.open(self.film_addr)
        h,w = np.shape(dataset)
        for i in range(dataset.n_frames):
            addr_image = self.output_folder / self.curr_folder / "frame{0}.{1}".format(i, self.ext)
            print(addr_image)
            dataset.seek(i)
            img = np.array(dataset).astype(np.double)
            #print("img.shape ", img.shape)
            self.resize_img(img)
            plt.savefig( str(addr_image), dpi=100 )       # save as 512x512 picture..

if __name__ == '__main__':
    mt = CREATE_TRAINING_SET()
