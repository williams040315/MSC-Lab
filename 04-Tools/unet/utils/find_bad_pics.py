import os, re, glob
op = os.path
opd, opb, opj, opa = op.dirname, op.basename, op.join, op.abspath
##
import numpy as np
import shutil as sh
from pathlib import Path
from PIL import Image
from matplotlib import pyplot as plt
from scipy.optimize import curve_fit
import cv2

class FIND_BAD_PICS():
    '''
    '''
    def __init__(self):
        pass

    # def func_fit_blur(self, x, a, b, c):
    #     '''
    #     Function for fit on list_blur_scores
    #     '''
    #     return a * x**2 + b * x + c

    def func_fit_quality(self, x, a, b):
        '''
        Function for fit on list_blur_scores
        '''
        return a * x + b

    def make_blur_score(self, img):
        '''
        Calculate the score for bluriness
        '''
        self.quality_score = cv2.Laplacian(img.astype('uint8'),3).var()

    def make_contrast_score(self, img):
        '''
        Calculate the score for contrast
        '''
        self.quality_score = round(np.abs(img.astype('uint8')).std(),2)

    def estimate_quality(self, addr_img, kind=None, show_score=False):
        '''
        Estimate  the quality
        '''
        img = np.abs(Image.open(addr_img))
        if kind =='blurriness': self.make_blur_score(img)
        elif kind =='contrast': self.make_contrast_score(img)
        if show_score: print(f'The score is {self.quality_score}')
        self.list_quality_scores.append(self.quality_score)

    def plot_quality(self, y, xdata, ydata):
        '''
        '''
        fig = plt.figure()
        plt.title(f'find the pics with pb of {self.kind_pic_score}')
        plt.ylabel('quality score')
        plt.plot(self.list_quality_scores)                # plot curve of blur_scores
        plt.plot(xdata, ydata)                            # plot fit curve through blur_scores
        for i in self.ind_bad_pics:
            plt.plot(xdata[i],y[i], 'og')                 # bad points
        plt.savefig( str(Path(self.folder_analyzed) / f'img_quality_{self.kind_pic_score}.jpg') )
        plt.close(fig)

    def find_bad_pics(self, xdata, ydata, debug=[1]):
        '''
        Find the data under the linear fit curve
        '''
        y = np.array(self.list_quality_scores)
        self.margin_down = 0.75*(ydata-y).std()
        diffy = ydata-self.margin_down-y                        # if positive, bad
        self.ind_bad_pics = ( np.where(diffy > 0)[0] ).tolist()                       # list with indices of the bad pics
        if 1 in debug: print(f'indices of bad images for {self.kind_pic_score} are : {self.ind_bad_pics}')
        if self.show_curve_quality:
            self.plot_quality(y, xdata, ydata)

    def fit_on_list_quality_scores(self):
        '''
        '''
        xdata = np.arange(len(self.list_quality_scores))
        popt, pcov = curve_fit(self.func_fit_quality, xdata , self.list_quality_scores)  # fit
        ydata = np.array(self.func_fit_quality(xdata, *popt))

        return xdata, ydata

    def pick_bad_pics(self, show_curve_quality=True):
        '''
        Detect the bad pictures, blurry, bad quality, no good frontiers
        '''
        self.show_curve_quality = show_curve_quality
        xdata, ydata = self.fit_on_list_quality_scores()
        self.find_bad_pics(xdata, ydata)

    def take_num_frame(self, elem):
        '''
        frame34.tiff or frame34.png  --> 34
        '''
        return int(re.findall('\d+', elem)[0])

    def find_bad_pics_in_folder(self, folder, ext='png', kind=None, margin_down=30, debug=[]):
        '''
        ext: format of the test_images
        kind : blurriness or contrast
        margin_down : margin for separating good pics for bad pics
        '''
        self.kind_pic_score = kind
        self.folder_analyzed = folder
        #self.margin_down = margin_down
        self.list_quality_scores = []                # list of scores
        ld = [ opb(img) for img in glob.glob(f'{folder}/*.{ext}') ]
        ld_sorted = sorted(ld, key = lambda i: self.take_num_frame(i)) #
        if 0 in debug: print(f'## ld_sorted  {ld_sorted}')
        for img in ld_sorted:
            self.estimate_quality(opj(folder,img), kind=kind)
        if 1 in debug: print(f'## self.list_quality_scores  {self.list_quality_scores}')
        self.pick_bad_pics()  # find the bad pics
