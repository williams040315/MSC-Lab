Installation / start-up
----------------------------
Install the recommended version of Python and all of its OpenCV dependencies

Training & prediction
---------------------
I did my tests in two stages

1. I validated the writing of the algorithm on eye images. In the training_eye file are the eye images (in images folder) and the corresponding masks (1st_manual folder). I launched the training algorithm by adjusting the loop for line 52 and the number of epochs line 109 to generate a prediction model in the models_generated folder. It is not necessary to have a large dataset. You can create new images from existing ones by adding noise, rotating, or changing the contrast, for example (traitement_images.py).
Once the model has been generated, simply load a model and specify the folder where the prediction images will be generated (prediction-10epochs-for4.py for the eye image prediction).

2. I restarted with the white light images of miss marple and with the use of the spot_detection (training-cell folder, images folder and 1st_manual folder) as a mask. For now, I have only made 4 epochs with a partial result (result/missmarple-cell/miss-marple-4epochs-for6,7h folder).
You have to start training again with a more powerful machine because I am limited on mine (eg GPU). I can go up to 10/15 epochs after my CPU is saturated.

Important
---------
1. You must created two folder: models_generated and predictions on a root folder
2. You must indicate the size of image in ligne 103 in train-(x).py. 
The best is also even sizes. If it is not the case it is necessary to resize the images (as in that for the eyes) 

As soon as possible
-------------------
I will post the next results soon with 10 or 15 epochs

------------------------------------------------------------------------------------------------------------------------------------------
Williams BRETT | Lab513 | wllmsbrtt@gmail.com for any questions
