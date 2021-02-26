import os
import json
import shutil as sh
from datetime import datetime
from pathlib import Path
import pickle as pkl
from matplotlib import pyplot as plt
from PIL import Image
import cv2
import numpy as np
from scipy.linalg import norm

class SINGLE_IMAGE():
    '''
    '''
    def __init__(self):
        pass

    def image(self,i):
        '''
        Select an image
        '''
        self.img_id = i                                # identity of image
        self.list_cntrs_img_i = []
        for c in self.cntrs[i]:
            self.list_cntrs_img_i.append(c)            # list of the contours in the image
        return self

    def area_hist(self,nbbins=10):
        '''
        histogram of cells surface in the image
        '''
        self.obs = 'area_hist'
        self.title = 'area histogram'
        list_areas = self.make_list_areas(self.list_cntrs_img_i)   # list of the cells areas in the image
        self.curr_obs = list_areas
        self.nbbins = nbbins
        return self

    def cells(self):
        '''
        Select all cells
        For counting etc..
        '''
        self.all_cells = True                      # take into account all the cells

        return self

    def count(self):
        '''
        Make the list of nb of cells
        '''
        self.nb_cells = []
        self.obs = 'count'
        for j,lc in self.cntrs.items():
            self.nb_cells.append(len(lc))
        self.curr_obs = self.nb_cells
        self.title = 'count cells'
        return self

    def mean_fluo_for_one_image(self,j,lc,col):
        '''
        Mean fluo for one image
        '''
        normed_sum_fluo = 0
        nbc = 0
        for c in lc:
            # try:
            area = cv2.contourArea(c)
            if area > 10:
                normed_sum_fluo += self.sum_fluo(c,j,col)/area      # normalized integral of fluo
                nbc += 1
            # except:
            #     print('probably issue with null area')
        self.list_normed_sum_fluo.append(normed_sum_fluo/nbc)           # averaged over all the cells in the image

    def fluo_in_images(self, col='1'):
        '''
        Mean fluo over images..
        '''
        self.list_normed_sum_fluo = []
        self.obs = 'image_fluo'
        for j,lc in self.cntrs.items():
            self.mean_fluo_for_one_image(j,lc,col)
        self.curr_obs = self.list_normed_sum_fluo
        self.title = f'fluo average over frames'
        self.xlabel = 'frames'
        self.ylabel = 'normalized fluorescence'
        return self
