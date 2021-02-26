#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Created on Tue Mar 24 14:44:40 2020

@author: Williams modified by Lionel 2/7/2020

"""

import os
from pathlib import Path
import numpy as np
import cv2
from tensorflow.keras import models
from modules_unet.util_predict import UTIL
from modules_unet.handle_images import HANDLE

def pred(test, model_name, model_loaded, file):
    '''
    test: folder where are the pictures
    model_name: model used name
    model_loaded : model loaded
    file:
    '''
    ut = UTIL(test, model_name, file)
    dir_test_images = Path('test') / ut.test
    ha = HANDLE(dir_test_images, kind='test', dim=512)

    ut.make_predict_subdir(ha)                               # subdir for the predictions

    for i,test_im in enumerate(ha.tab_test_images):
        prediction = model_loaded.predict(np.array([test_im]))
        ut.save_prediction(i, prediction)

    print('########  Predictions done')
