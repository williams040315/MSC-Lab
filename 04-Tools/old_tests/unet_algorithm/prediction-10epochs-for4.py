#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import numpy as np
import cv2
from tensorflow.keras import models

print("""
Created on Sat Mar 21 23:10:31 2020
@author: williams BRETT
""")

my_model = models.load_model('./models_generated/10epochs-for4')
dir_test_images='./test/eye/'

tab_test_images=[]
tab_files=[]
for fichier in os.listdir(dir_test_images):
    img=cv2.imread(dir_test_images+fichier)
    tab_test_images.append(img[:576, :560])
    tab_files.append(fichier.split('_')[0])

tab_test_images=np.array(tab_test_images, dtype=np.float32)/255
tab_files=np.array(tab_files)

for id in range(len(tab_test_images)):
    mask=np.zeros((584, 565, 1), dtype=np.float32)
    prediction=my_model.predict(np.array([tab_test_images[id]]))
    mask[:576, :560]=prediction[0]*255
    cv2.imwrite("./predictions/"+str(tab_files[id])+".png", mask)