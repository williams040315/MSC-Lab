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

class TEST_ANALYSE():
    '''
    '''
    def __init__(self):
        pass

    def test_contours_with_BF(self, num):
        '''
        '''
        img = self.list_imgs_BF[num]
        img = cv2.drawContours(img, self.cntrs[num], -1, (255, 255, 255), -1)
        plt.imshow(img)
