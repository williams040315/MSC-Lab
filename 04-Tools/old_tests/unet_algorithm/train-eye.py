#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from tensorflow.keras import models
from sklearn.model_selection import train_test_split
from PIL import Image
import os
import numpy as np
import cv2
import model
import traitement_images as ti

print("""
Created on Sat Mar 21 14:52:24 2020
@author: Williams
@script: train-10epochs-for4.py - UNET segmentation with Tensorflow Keras
      """)

activate_ti = False
dir_images='./training-eye/images/'
dir_mask  ='./training-eye/1st_manual/'

if not os.path.isdir(dir_images):
    quit("The directory {} don't exist !".format(dir_images))
if not os.path.isdir(dir_mask):
    quit("The directory {} don't exist !".format(dir_mask))

tab_images=[]
tab_masks=[]

list_file=os.listdir(dir_images)
if list_file is None:
    quit("No file in {} !".format(dir_images))


for fichier in list_file:
    img_orig=cv2.imread(dir_images+fichier)
    print('Creating and change {}'.format(dir_images+fichier))
    tab_images.append(img_orig[:576, :560])
    num=fichier.split('_')[0]
    file_mask=dir_mask+num+'_manual1.gif'
    if not os.path.isfile(file_mask):
        quit("Mask of {} don't exist in {}".format(file_mask, dir_mask))
    img_mask_orig=np.array(Image.open(file_mask))
    cv2.imshow('mask',img_mask_orig)
    cv2.waitKey(0)
    tab_masks.append(img_mask_orig[:576, :560])
    

    if activate_ti :
        
        for angle in range(0, 360, 90):
 
            print(" Angle {}°".format(angle))
            
            img_r=ti.rotateImage(img_orig, angle)
            img=img_r.copy()
            img=ti.random_change(img)
            tab_images.append(img[:576, :560])
            img_mask=ti.rotateImage(img_mask_orig, angle)
            tab_masks.append(img_mask[:576, :560])
            
            img=cv2.flip(img_r, 0)
            img=ti.random_change(img)
            tab_images.append(img[:576, :560])
            img_m=cv2.flip(img_mask, 0)
            tab_masks.append(img_m[:576, :560])
    
            img=cv2.flip(img_r, 1)
            img=ti.random_change(img)
            tab_images.append(img[:576, :560])
            img_m=cv2.flip(img_mask, 1)
            tab_masks.append(img_m[:576, :560])
    
            img=cv2.flip(img_r, -1)
            img=ti.random_change(img)
            tab_images.append(img[:576, :560])
            img_m=cv2.flip(img_mask, -1)
            tab_masks.append(img_m[:576, :560])


tab_images=np.array(tab_images, dtype=np.float32)/255
tab_masks =np.array(tab_masks,  dtype=np.float32)[:, :, :]/255

print(len(tab_images))
print(len(tab_masks))

train_images, test_images, train_masks, test_masks=train_test_split(tab_images, tab_masks, test_size=0.05)

print(len(train_images))
print(len(test_images))
print(len(train_masks))
print(len(test_masks))

print(train_images.dtype)
print(test_images.dtype)
print(train_masks.dtype)
print(test_masks.dtype)

del tab_images
del tab_masks

my_model = model.model(64,576,560)
my_model.compile(optimizer='adam',
                 loss='binary_crossentropy',
                 metrics=['accuracy'])
my_model.fit(train_images,
             train_masks,
             epochs=10,
             batch_size=4,
             validation_data=(test_images, test_masks))
models.save_model(my_model,'./models_generated/10epochs-for4')
print("""
      Finished - Model saved and can be used for make predictions images
      Williams BRETT
      """)