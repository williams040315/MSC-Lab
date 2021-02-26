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

class FLUO_NUCLEUS():
    '''
    '''
    def __init__(self):
        pass

    def find_contours_fluo(self, img):
        '''
        Contours obtain with RFP images..
        '''
        img = self.cf.bytescaling(img)
        img = cv2.GaussianBlur(img,(5,5),0)
        img = self.cf.filter2D(img) # filtering with kernel..
        ret2, th2 = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        self.cntrs_fluo, hierarchy = cv2.findContours(th2.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[-2:]

    def fluo_positions(self):
        '''
        in one fluo image make list of the positions..
        '''
        self.positions_fluo = []
        for c in self.cntrs_fluo:
            self.positions_fluo.append(self.pos(c))

    def find_nearest_fluo_contour(self,im_num):
        '''
        Find nearest contour for tracking in fluo
        '''
        pos_fluo = np.array(self.positions_fluo)     # all fluo positions in image im_num
        pos_segm = self.positions[self.id][im_num]   # pos of cell self.id in image im_num
        list_distances = list( map( norm, ( pos_fluo - np.array(pos_segm) ) ) )
        self.ind_fluo_nearest = np.argmin( list_distances )
        print("index of fluo contour nearest from cell {0} is {1} ".format(self.id, self.ind_fluo_nearest))

    def nearest_fluo_index(self, im_num):
        '''
        Find index of the nearest contour
        '''
        img = self.list_imgs_red_fluo[im_num]
        self.find_contours_fluo(img)
        self.fluo_positions()
        self.find_nearest_fluo_contour(im_num)

    def nearest_fluo_contour(self, im_num):
        '''
        Find the nearest fluo contour
        '''
        self.nearest_fluo_index(im_num)
        nearest_fluo_cntr = self.cntrs_fluo[self.ind_fluo_nearest]
        #mask = self.self.mask_from_cntr(nearest_fluo_cntr)

    def func_fluo_in_nucleus(self,i,func):
        '''
        Generic function for fluo applied in the segmented contour..
        c : contour
        i : image index
        '''
        c = self.nearest_fluo_contour(i)
        mask = self.mask_from_cntr(c)
        val = getattr(self.list_imgs_yellow_fluo[i][ mask == 255 ],func)() # operation on fluo image in the contour mask..
        return val

    def sum_yellow_fluo(self, c,i):
        '''
        Integration of the fluorescence using the segmentation mask
        c : contour
        i : image index
        '''
        return self.func_fluo_in_nucleus(i,'sum')
