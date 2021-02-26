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
from skimage import io
from scipy.linalg import norm
##
from scipy.interpolate import interp2d
from scipy.optimize import curve_fit
from scipy.signal import savgol_filter
##
from modules_unet.read_extract_fluo import READ_EXTRACT_FLUO as REF
from modules_unet.count_fluo import COUNT_FLUO as CF
from modules_unet.fit_growth import FIT_GROWTH as FG
from modules_unet.plots import PLOTS as PL
from modules_analyse.single_cell import SINGLE_CELL as SG
from modules_analyse.single_image import SINGLE_IMAGE as SI
from modules_analyse.fluo_nucleus import FLUO_NUCLEUS as FN
from modules_analyse.fluo import FLUO as FL
from modules_analyse.util_cyber import CYBER as CY
from modules_analyse.miscellaneous import MISC as MI
from modules_analyse.test_analyse import TEST_ANALYSE as TA

class ANALYSE_RESULTS(REF,CF,FG,PL,SG,SI,FN,FL,MI,CY,TA):
    '''
    Analysis of the images after contours detection..
    name_result : contours
    addr_fluo : list of addr of fluo files
    load_fluo : list, eg: ['1', '2']
    addr_buds : addr for detection buds contours
    '''

    def __init__(self, name_result=None, addr_tif=None, addr_fluo=None,\
                  load_fluo=None, nb_fluo=None, ext='tif', extract_addr_fluo=None, addr_buds=None):
        '''
        '''
        ldep = [REF,CF,FG,PL,SG,SI,FN,FL,MI,CY,TA]
        [dep.__init__(self) for dep in ldep]                    # init for all the inheritances

        ##
        self.name_result = name_result
        self.addr_tif = addr_tif
        self.nb_fluo = nb_fluo
        self.addr_buds = addr_buds
        self.ext = ext
        ##
        self.dic_json = {}
        #self.size = 512                                          # size of the images
        self.size = 2048                                          # size of the images
        self.addr_fluo = addr_fluo                                # address images fluo
        self.load_fluo = load_fluo                                # load locally the fluo from imgs_fluo
        self.extract_addr_fluo = extract_addr_fluo                #
        self.lim_step_max = 10                                    # maximal step allowded before cutting the track
        self.list_imgs_fluo1 = []                                 # list of the red fluo pictures
        self.list_imgs_fluo2 = []                                 # list of the yellow fluo pictures
        self.load_files_for_analyse()                             # loads the contours from the pickle file
        self.cf = CF()                                            # count fluo with OTSU

    @property
    def date(self):
        '''
        Return a string with day, month, year, Hour and Minute..
        '''
        now = datetime.now()
        dt_string = now.strftime("%d-%m-%Y-%H-%M")
        return dt_string

    def load_shape4(self, debug=[]):
        '''
        '''
        setattr( self, f'list_imgs_BF', self.film[:,0,:,:] )                      # load BF
        for col in self.load_fluo:
            setattr( self, f'list_imgs_fluo{col}', self.film[:,int(col),:,:] )   # load fluos (shifted by int(col) )

    def load_shape3(self, debug=[]):
        '''
        '''
        step = self.nb_fluo+1
        if 1 in debug: print(f'step is {step}')
        setattr( self, f'list_imgs_BF', self.film[::step] )                      # load BF
        for col in self.load_fluo:
            setattr( self, f'list_imgs_fluo{col}', self.film[int(col)::step] )   # load fluos (shifted by int(col) )

    def analyse_load_layers(self, debug=[1,2,3]):
        '''
        '''
        print(f'self.addr_tif { self.addr_tif }')
        self.film = io.imread(self.addr_tif)
        print(f'self.film.shape is { self.film.shape } ')
        if len(self.film.shape) == 3:          # case exp87
            self.load_shape3()
        elif len(self.film.shape) == 4:        # case exp82
            self.load_shape4()

    def analyse_load_cntrs(self, debug=[]):
        '''
        '''
        with open(self.name_result, 'rb') as f:
            dic_cntrs = pkl.load(f)
            self.cntrs = {}
            for j,lc in dic_cntrs.items():
                self.cntrs[j] = []
                for c in lc:
                    self.cntrs[j] += [4*c]  # passing to 2048x2048

        if 1 in debug: print(self.cntrs[0])
        if 2 in debug: print(f'len(self.cntrs) is { len(self.cntrs) } ')

    def analyse_extract_fluo(self):
        '''
        '''
        for i,addr in enumerate(self.extract_addr_fluo):
            kind_fluo = str(i+1)
            self.extract_fluo(addr, kind_fluo)                          # extract imgs fluo from video

    def load_files_for_analyse(self, debug=[1]):
        '''
        Load the dictionary of the list of contours for each image
        '''
        self.analyse_load_cntrs()           # load the contours
        if self.extract_addr_fluo:
            self.analyse_extract_fluo()
        if self.load_fluo:
            self.analyse_load_layers()      # load BF and fluo
        if self.addr_buds:
            with open(self.addr_buds, 'rb') as f:
                self.buds = pkl.load(f)                                     # load the buds contours dictionary

    # def load_fluo_frame(self,i,col,debug=[]):
    #     '''
    #     Color fluo frame i
    #     i : fluo image index
    #     col : 1 or 2, current "color"
    #     '''
    #     addr_fluo = Path('imgs_fluo') if not self.addr_fluo else Path(self.addr_fluo)
    #     im_fluo_i = addr_fluo / f'fluo{col}' / (f'frame{i}.{self.ext}')
    #     list_fluo = getattr( self, f'list_imgs_fluo{col}' )
    #     list_fluo.append( cv2.imread(str(im_fluo_i)) )           # list of fluo images
    #     if 1 in debug:
    #         print(f"im_fluo_i is {im_fluo_i}")
    #         print(f"type(list_fluo[0]) {type(list_fluo[0])}")

    def pos(self,c):
        '''
        position from contour
        '''
        x, y, w, h = cv2.boundingRect(c)
        pos = ( int(x + w/2), int(y + h/2) )
        return pos

    def fill_list_pos_interm(self, lc):
        '''
        Make the list of positions
        '''
        list_pos_interm = []
        for c in lc:
            pos = self.pos(c)
            list_pos_interm.append(pos)
        return list_pos_interm

    def find_positions(self):
        '''
        Make list of list of positions self.list_pos for each image
        '''
        self.list_pos = []
        for j,lc in self.cntrs.items():
            self.list_pos.append(self.fill_list_pos_interm(lc)) # add a list of positions

    def mask_from_cntr(self, cntr, mask=None):
        '''
        Find mask from contour
        '''
        try :
            s = mask.shape
        except:
            mask = np.zeros((self.size,self.size))
        cv2.drawContours( mask, [cntr], -1, (255,255,255), -1 )  # save mask of the segmentation
        return mask

    def make_masks_from_segm(self, num_img, addr_cntrs, debug=[]):
        '''
        Using segmentation for making masks
        num_img : image index
        addr_cntrs : address of pickle file with the contours
        '''
        mask = np.zeros((self.size,self.size))
        for c in self.cntrs[num_img]:
            mask = self.mask_from_cntr(c,mask)           # adding contour c to the mask
        ##
        maskcv = cv2.cvtColor(np.float32(mask), cv2.COLOR_GRAY2BGR)
        addr_img_mask = str(addr_cntrs / f'frame{num_img}.tif')
        if 1 in debug : print("## addr_img_mask ", addr_img_mask)
        cv2.imwrite( addr_img_mask, maskcv )          # save the mask

    def try_settings(self, attr, debug=[1]):
        '''
        '''
        try:
            getattr( plt, attr )( getattr(self,attr) )
        except:
            if 1 in debug: print(f'No attribute {attr}')

    def settings_plot(self, xlim=None, ylim=None):
        '''
        Settings for the plot
        '''
        plt.title(self.title)
        self.try_settings('xlabel')
        self.try_settings('ylabel')
        if xlim:
            plt.xlim(*xlim)
        if ylim:
            plt.ylim(*ylim)

    def savisky(self):
        '''
        '''
        self.curr_obs = savgol_filter(self.curr_obs, 21, 2)

    def cure_plot(self):
        '''
        '''
        for i,v in enumerate(self.curr_obs):
            if i > self.cure_lim[1]:
                if v == 0 :
                    self.curr_obs[i] = self.curr_obs[i-1]
                # if (self.curr_obs[i]-self.curr_obs[i-1]) > 1e2:
                #     self.curr_obs[i] = self.curr_obs[i-1]
            elif i < self.cure_lim[0]:
                if v == 0:
                    self.curr_obs[i] = 100
                if (self.curr_obs[i]-self.curr_obs[i-1]) > 1e2:
                    self.curr_obs[i] = self.curr_obs[i-1]

    def plot(self, xlim=None, ylim=None, new_fig=False,
                   cure=False, cure_lim=[20,100], link=[],
                   title=''
                ):
        '''
        plot the current observation for the cell
        Can be : the position, fluorescence, area
        '''
        if title != '':
            self.title = title
        self.curr_obs = np.array( self.curr_obs )
        for lim in link:
            print(f'lim[0],lim[1] is { lim[0],lim[1] }')
            print(f'lim[0] is { lim[0] }')
            if lim[0] < lim[1]:
                self.curr_obs[lim[0]:lim[1]] = self.curr_obs[lim[0]] # points between limits have all value at lim[0]
            else:
                if lim[1] == 0:
                    lim[1] = None
                    print('changing in None')
                self.curr_obs[lim[0]:lim[1]:-1] = self.curr_obs[lim[0]]
        if cure:
            self.cure_lim = cure_lim
            #self.cure_plot()
            self.savisky()
        if new_fig: plt.figure()
        self.settings_plot( xlim=xlim, ylim=ylim )
        if self.obs == "track":
            plt.plot(*self.curr_obs, label=str(self.id))            # cells positions
        elif self.obs == "count":
            plt.plot(self.curr_obs)                                 # graph of cell number
        elif self.obs == "area_hist":
            plt.hist(self.curr_obs, self.nbbins)                    # histogram cells area
        elif self.obs == "image_fluo":
            plt.plot(self.curr_obs)                                 # normalized fluo in the time through images
        else:
            if not ylim:
                plt.ylim(0,max(self.curr_obs)*1.25)
            plt.plot(self.curr_obs, label=str(self.id))             #
        plt.legend()
