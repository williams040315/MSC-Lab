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

class MISC():
    '''
    '''
    def __init__(self):
        pass

    def make_training_set_masks_from_segm(self):
        '''
        Produce a training set..
        '''
        addr_train_set = Path('training_set_masks_from_segm')/ self.date
        if not os.path.exists(addr_train_set):
            os.makedirs(addr_train_set)
        for num_img in self.cntrs.keys():
            self.make_masks_from_segm(num_img, addr_train_set)

    def rename_for_masks(self, date):
        '''
        passing from frame_num to num.tiff
        Specific to the first training set for cell's segmentation "training-cells" and its variants
        '''
        addr = 'test_code/training_set_from_segm/' + date + '/'
        sh.rmtree('better_masks')
        os.mkdir('better_masks')
        lnum = [6,30,55,60,81,91,93,94,105,112,116,119,121,141,142,153,154,155,176,178]
        lf = os.listdir(addr)
        lfs = sorted(lf, key = lambda name: int(name[5:-4]))
        for i,f in enumerate(lfs):
            print(f[5:], lnum[i])
            sh.copy2(addr + f ,'better_masks/' + str(lnum[i]) + '.tiff')
