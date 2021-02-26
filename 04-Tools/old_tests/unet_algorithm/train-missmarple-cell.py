#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import cv2
import numpy as np
from sklearn.model_selection import train_test_split
import model
from tensorflow.keras import models
import traitement_images as ti

print("""
Created on Sat Mar 21 14:52:24 2020
@author: Williams
@script: train1-cell-missmarple.py - UNET segmentation with Tensorflow Keras
""")
  
dir_images='./training_cell/images/'
dir_masks  ='./training_cell/1st_manual/'

if not os.path.isdir(dir_images):
    quit("The directory {} don't exist !".format(dir_images))
if not os.path.isdir(dir_masks):
    quit("The directory {} don't exist !".format(dir_masks))

activate_ti = True
show_table = False
calculated = True

tab_images=[]
tab_masks=[]

list_file=os.listdir(dir_images)
if list_file is None:
    quit("No file in {} !".format(dir_images))

for fichier in list_file:
    if fichier.split('.')[1] == 'tiff':     
        img_orig=cv2.imread(dir_images+fichier)
        print('Creating and change {}'.format(dir_images+fichier))
        tab_images.append(img_orig)
        num=fichier.split('_')[0]
        file_mask=dir_masks+num+'_manual1.tiff'
        img_mask_orig=cv2.imread(file_mask,0) #np.array(Image.open(file_mask))
        tab_masks.append(img_mask_orig)
    
        if activate_ti :
            
            for angle in range(0, 360, 60):
     
                print(" Angle {}°".format(angle))
                
                img_r=ti.rotateImage(img_orig, angle)
                img=img_r.copy()
                img=ti.random_change(img)
                tab_images.append(img)
                img_mask=ti.rotateImage(img_mask_orig, angle)
                
                tab_masks.append(img_mask)
                
                img=cv2.flip(img_r, 0)
                img=ti.random_change(img)
                tab_images.append(img)
                img_m=cv2.flip(img_mask, 0)
                tab_masks.append(img_m)
        
                img=cv2.flip(img_r, 1)
                img=ti.random_change(img)
                tab_images.append(img)
                img_m=cv2.flip(img_mask, 1)
                tab_masks.append(img_m)
        
                img=cv2.flip(img_r, -1)
                img=ti.random_change(img)
                tab_images.append(img)
                img_m=cv2.flip(img_mask, -1)
                tab_masks.append(img_m)


if show_table == True:
    for id in range(len(tab_masks)):
        print(id)
        cv2.imshow('imageOpen',tab_images[id])
        cv2.imshow('maskOpen',tab_masks[id])
        cv2.waitKey(0)

if calculated == True :
    tab_images=np.array(tab_images, dtype=np.float32)/255
    tab_masks =np.array(tab_masks,  dtype=np.float32)[:, :, :]/255
    
    train_images, test_images, train_masks, test_masks=train_test_split(tab_images, tab_masks, test_size=0.05)
    
    del tab_images
    del tab_masks
    
    my_model = model.model(64,512,512)
    my_model.compile(optimizer='adam',
                     loss='binary_crossentropy',
                     metrics=['accuracy'])
    my_model.fit(train_images,
                 train_masks,
                 epochs=4,
                 batch_size=4,
                 validation_data=(test_images, test_masks))
    models.save_model(my_model,'./models_generated/cell-missmarple-4epochs-for6')

print("""
Finished - Model saved and can be used for make predictions images
Williams BRETT
""")