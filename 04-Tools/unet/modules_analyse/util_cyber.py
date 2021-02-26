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

class CYBER():
    '''
    '''
    def __init__(self):
        pass

    def make_json(self, addr_json):
        '''
        json file for Cyberscope part
        Information about the last picture
        '''
        self.count()
        self.dic_json['nb_cells'] = self.nb_cells[-1]   # number of cells
        self.find_positions()
        self.dic_json['positions'] = self.list_pos[-1]  # cells positions

        with open(addr_json,'w') as f:
            json.dump(self.dic_json, f)
