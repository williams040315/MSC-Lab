"""
@Auteur: Williams BRETT
@Date:   18/09/2019
@brief:  find the best focus image in a z-sstack
"""
import sys
import cv2 as cv
import numpy as np

def bytescaling(data, cmin=None, cmax=None, high=255, low=0):
    if data.dtype == np.uint8:
        return data
    if high > 255:
        high = 255
    if low < 0:
        low = 0
    if high < low:
        raise ValueError("`high` should be greater than or equal to `low`.")
    if cmin is None:
        cmin = data.min()
    if cmax is None:
        cmax = data.max()
    cscale = cmax - cmin
    if cscale == 0:
        cscale = 1
    scale = float(high - low) / cscale ; bytedata = (data - cmin) * scale + low
    return (bytedata.astype(np.uint8))

global varianceCalculation
def variance_of_laplacian(image):    
    if image is None:
        print ('Erreur: opening image')
        return -1
    image = cv.cvtColor(image,cv.COLOR_GRAY2BGR)                                                        
    image = cv.GaussianBlur(image, (3, 3), 0)                                                           
    src_gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)                                                    
    kernel_size = 3
    varianceCalculation.append(cv.Laplacian(src_gray, cv.CV_16S, ksize=kernel_size).var())              

if __name__ == "__main__":

    folder = "data/"
    varianceCalculation = []
    image_names = ["img_000000000_Transmission_000.tif", "img_000000000_Transmission_001.tif", "img_000000000_Transmission_002.tif", "img_000000000_Transmission_003.tif", "img_000000000_Transmission_004.tif", "img_000000000_Transmission_005.tif", "img_000000000_Transmission_006.tif", "img_000000000_Transmission_007.tif", "img_000000000_Transmission_008.tif", "img_000000000_Transmission_009.tif", "img_000000000_Transmission_010.tif", "img_000000000_Transmission_011.tif", "img_000000000_Transmission_012.tif"]
    images = [bytescaling(cv.imread(folder + i_name,cv.IMREAD_UNCHANGED)) for i_name in image_names]    #images 16Bits en 8Bits sans perdre de profondeur
    
    for idx in range(0, len(images)):
        variance_of_laplacian(images[idx])
                                
    idx_laplacian = varianceCalculation.index(np.max(varianceCalculation))
    cv.imshow('Best focus image: '+image_names[idx_laplacian], images[idx_laplacian])
    cv.waitKey(0)
    cv.destroyAllWindows()
    
    