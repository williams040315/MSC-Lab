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

class FLUO():
    '''
    '''
    def __init__(self):
        pass

    def func_fluo(self,c,i,func,col,debug=[]):
        '''
        Generic function for fluo applied in the segmented contour..
        c : contour
        i : image index
        func : fucntion called (sum, std etc..)
        col : fluo color asked
        '''
        mask = self.mask_from_cntr(c)
        list_fluo = getattr(self,f'list_imgs_fluo{col}')
        if 1 in debug:
            print(f'## len(list_fluo) is {len(list_fluo)}')
            print(f'i is {i}')
            print(f'type(list_fluo[0]) is {type(list_fluo[0])}')
        val = getattr(list_fluo[i][ mask == 255 ],func)() # operation on fluo image in the contour mask..
        return val

    def std_fluo(self,c,i,col,norm=False):
        '''
        Standard deviation of the fluorescence using the segmentation mask in one cell
        c : contour
        i : image index
        col : fluo color asked
        norm = normalization factor, using contour area
        '''
        norm = cv2.contourArea(c) if norm else 1
        return self.func_fluo(c,i,'std')/norm

    def sum_fluo(self,c,i,col,norm=False,debug=[]):
        '''
        Integration of the fluorescence using the segmentation mask  in one cell
        c : contour
        i : image index
        col : fluo color asked
        norm = normalization factor, using contour area
        '''
        area = cv2.contourArea(c) if norm else 1
        area = 1 if area == 0  else area                      # protecting against null areas..
        if 1 in debug: print(f"area is {area}")
        return self.func_fluo(c,i,'sum',col)/area
