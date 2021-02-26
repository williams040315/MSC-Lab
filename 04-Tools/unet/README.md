Introduction
------------------------------------------------------------------------------------------------------------------------------------------
This directory regroup three utilities : create_training_set, train_unet.py and detect_cells.py
The first is used to create new training sets from videos (Bright Field for images and RFP for masks) or to mix yet existing datasets.
The second one is used to produce a model with a given training set.
The last one is used for cells analysis and can be used also for validating models.


Installation and dependencies
------------------------------------------------------------------------------------------------------------------------------------------

Anaconda

Retrieve Anaconda package and install https://www.anaconda.com/products/individual

NVIDIA GPU installation

[https://shawnhymel.com/1961/how-to-install-tensorflow-with-gpu-support-on-windows/](https://shawnhymel.com/1961/how-to-install-tensorflow-with-gpu-support-on-windows/)

- cuda_10.1.243_426.00_win10.exe

    can be found at the address : [https://www.filehorse.com/download-nvidia-cuda-toolkit/42676/](https://www.filehorse.com/download-nvidia-cuda-toolkit/42676/)

- cudnn-10.1-windows10-x64-v7.6.5.32.zip

    can be found at the address : [https://github.com/pwnshui/certutil/releases](https://github.com/pwnshui/certutil/releases)

    a) 3 files to copy from cudnn to Cuda

    - bin: Copy <cuDNN directory>\cuda\bin\*.dll to C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\vxx.x\bin
    - include : Copy <cuDNN directory>\cuda\include\*.h to C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\vxx.x\include
    - lib : Copy <cuDNN directory>\cuda\lib\x64\*.lib to C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\vxx.x\lib\x64

    b) check you have in the environment variables those 2 paths :

    - C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\vxx.x\bin
    - C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\vxx.x\libnvvp

Tesnsorflow

pip install tensorflow-gpu==2.2.0

Configuration
------------------------------------------------------------------------------------------------------------------------------------------
There are five folders with differente purposes.
* build_training_set
When creating a new training set, the resulting training set is saved in build_training_set.
* training_sets
For producing a new model with a training_set, this training set needs to be placed in the training_sets folder and then called by its name.
* models
At the end of the training the model is save there with the code used to produce it.
* test
When running a detection on a video, the images extracted from the video are placed here in a movie folder.
* prediction
During a detection process the predicted masks are stocked in a movie folder inside a folder with the date and the name of the model used.


Usage
------------------------------------------------------------------------------------------------------------------------------------------
Usage examples

create_training_set.py

For creating a new training set:
* python create_training_set.py --new -b fullpath_to_BF_movie -r fullpath_to_RFP_movie
For mixing existing traning sets
* python create_training_set.py --mix --d1 fullpath_to_dataset1 --d2 fullpath_to_dataset2

train_unet.py

Performing a training
* python train_unet -d name_of_the_training_set_in_the_folder_training_sets

detect_cells.py

Different analysis scenarii
* sentence 0 = python detect_cells.py -f fullpath_to_movie -m relative_path_model
* simple video with cells counting :
    * sentence 0
* graph of number of cells :
    * sentence 0  --no_video --graph_nb_cells
* graph of number of cells with growth rate fit without video :
    * sentence 0  --no_video --nb_fits 1
* video with prediction mask :
    * sentence 0  --no_video --nb_fits 1
* graphs of comparison or validation test with RFP for various threshold  :
    * sentence 0  --rfp  --optim_thresh --no video

Analysis
------------------------------------------------------------------------------------------------------------------------------------------
detect_cells.py permits:
* to count the number of cells image per image,
  to plot the curve of the number of cells and to extract the growth rate.
* to make the segmentation of the cells in a film

Interface
------------------------------------------------------------------------------------------------------------------------------------------
The Flask interface pilots "detect_cells.py"

Need to install packages for websocket:

pip install flask-socketio
pip install gevent

Launching the interface:

python -m image_analysis.run

------------------------------------------------------------------------------------------------------------------------------------------
Lionel Chiron | Lab513 | lchiron@curie.fr
