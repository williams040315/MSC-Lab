#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Mar 24 14:44:40 2020

@author: williams
"""

#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import numpy as np
import cv2
from tensorflow.keras import models

my_model = models.load_model('./models_generated/cell-missmarple-4epochs-for6')
dir_test_images='./test/cell-missmarple-convert/'

tab_test_images=[]
tab_files=[]
for fichier in os.listdir(dir_test_images):
    if fichier.split('.')[1] == 'tiff':
        img=cv2.imread(dir_test_images+fichier)
        tab_test_images.append(img)
        tab_files.append(fichier.split('_')[0])

tab_test_images=np.array(tab_test_images, dtype=np.float32)/255
tab_files=np.array(tab_files)

for id in range(len(tab_test_images)):
    mask=np.zeros((512, 512, 1), dtype=np.float32)
    prediction=my_model.predict(np.array([tab_test_images[id]]))
    mask=prediction[0]*255
    cv2.imwrite("./predictions/"+str(tab_files[id])+".png", mask)