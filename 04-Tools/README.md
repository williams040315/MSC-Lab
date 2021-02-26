# Tools
Global repository: Set of image analysis and other analysis code that are usefull for everyone.

------------------------------------------------------------------------------------------------------------------------------------------

### convert_16_to_8bits_image: 
This file contains the codes to convert a 16-bit gray level image into 8 bits without losing depth. 
Three functions are also implemented: one to adjust the gamma, one to apply a custom color mapping or defined in OpenCV, and one to automatically correct the brightness and contrast of the image.

### extract_caracteristics:
This file contains the codes to extract all the characteristics of cell nuclei from a fluorescence image. We use the code snippet from spot_detection to find the cell nuclei. Then we look for the contours of the cells. Finally, we calculate the centers of mass, the areas, the perimeters and the average light intensity in gray level. As output, the code generates a JSON object containing all of the calculated characteristics. 
For the moment, there are no filters to activate (size limit for example). The code can therefore calculate null areas

### find_Focus_in_zStack: 
This file contains all the codes to find the best image in the focus from a stack of image in Z. 
The detection is realized thanks to the computation of the variance following the application of a Laplacian convolution on the origin image

### spot_detection: 
This file contains all the codes to find all the luminous points of a fluorescence image. 
In this example, we use RFP illumination. We use a convolutive technique preceded by a Gaussian blur. Finally, we apply a threshold (OTSU's binairize). 
You can program a noise reduction filter, but this will slow down the calculation time and the performance of the algorithm.

### tracking1 (mother cell and children cells)
It is a development code.
Constraints and grouping variables are still missing to avoid the yo-yo effects between cell groupings.

### unet_algorithm
This file contains all the codes to perform training and predictions using the UNET algorithm (https://lmb.informatik.uni-freiburg.de/people/ronneber/u-net/). We use Python / OpneCV / Tensorflow / Keras to facilitate writing the code.

### unet 
This folder contains tools for training unet, creating training sets from videos (BF and RPF) or mixing  them  and a tool for performing cell detection and analysis
This last tool permits also to evaluate the performance of the u-net models and optimize the thresholding parameter via the comparison with RFP analysis (OTSU algorithm).


