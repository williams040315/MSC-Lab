import os, re, glob
op = os.path
opd, opb, opj, opa = op.dirname, op.basename, op.join, op.abspath
##
import json
import numpy as np
import shutil as sh
from pathlib import Path
from PIL import Image
from skimage.external import tifffile as tif
from matplotlib import pyplot as plt
import pylab
import cv2
from find_bad_pics import FIND_BAD_PICS as FB
from skimage import io

class SEP_TIF_LAYERS(FB):
    '''
    stl = SEP_TIF_LAYERS(addr0)
    stl.list_layers = ['BF','fluo1','fluo2']
    #stl.extract_all_layers()
    stl.extract_layer('BF')
    '''
    def __init__(self, addr, dest=None):
        '''
        addr : name of the file with multiple layers
        dest : target folder for the results..
        '''
        FB.__init__(self)
        self.addr = addr                      # address of the file to desenterlace
        self.dest = dest                      # folder where to copy the results
        self.folder = str(self.addr)[:-4]     # folder for pics and videos
        self.name_file = opb(self.addr)       # name of the file to desenterlace
        self.size = 512                       # pictures size
        self.list_layers = []                 # list of layers in the movie
        self.lim_index=1e3                    # index max for allowing extraction of the the pictures

    def make_dir_with_file_name(self):
        '''
        Principal folder
        '''
        print("self.name_file ", self.name_file)
        if not os.path.exists(self.folder):
            os.makedirs(self.folder)

    def make_fig_ax(self):
        '''
        '''
        dpi_val = 100
        fig = plt.figure(figsize=(self.size/dpi_val, self.size/dpi_val), dpi=dpi_val)
        ax = plt.Axes(fig, [0., 0., 1., 1.])
        ax.set_axis_off()
        fig.add_axes(ax)

        return fig, ax

    def resize_img(self, img, debug=0):
        '''
        Resize the images to the size : self.size
        '''
        pylab.ioff()
        res = cv2.resize(img, dsize=(self.size, self.size), interpolation=cv2.INTER_CUBIC) # dsize=(512, 512)
        if debug > 0: print("res.shape ", res.shape)
        ##
        fig, ax = self.make_fig_ax()
        ax.imshow(res, aspect='equal', cmap='gray')
        pylab.ion()
        return fig

    def deal_with_img(self, img, addr_img):
        '''
        Different operations on the image
        '''
        fig = self.resize_img(img)                # resize
        plt.savefig( addr_img, dpi=100 )          # save frame in self.output_folder
        plt.close(fig)

    def extract_one_image_from_layer(self, i, num_lay, step):
        '''
        Extract image i from layer num lay
        '''
        self.film.seek(i)                                    # go to frame i, passing from film to image
        self.curr_num = int((i-num_lay)/step)
        ##
        addr_img = opj(self.folder_layer, f'frame{self.curr_num}')
        img = np.array(self.film).astype(np.double)[:,:]
        if i < self.lim_index:
            self.deal_with_img(img, addr_img)

    def make_list_of_blurry_pics(self, debug=[1]):
        '''
        Find the blurry pics
        '''
        self.find_bad_pics_in_folder(self.folder_layer, kind='blurriness', margin_down=30)  # find indices of blurry pics
        self.pics_to_rem = self.ind_bad_pics
        if 2 in debug : print(f' self.pics_to_rem after burriness is {self.pics_to_rem}')

    def make_list_of_bad_contrast_pics(self, debug=[1]):
        '''
        Find the pics with low contrast
        '''
        self.find_bad_pics_in_folder(self.folder_layer, kind='contrast', margin_down=5)     # find indices of low contrast pics
        self.pics_to_rem += self.ind_bad_pics
        if 2 in debug : print(f' self.pics_to_rem after contrast is {self.pics_to_rem}')

    def make_list_pic_to_rem(self, debug=[1]):
        '''
        Build the list of pictures to remove from the video..
        Removal by duplicating previous pictures or putting nothing at the place..
        '''
        self.pics_to_rem = []
        self.make_list_of_blurry_pics()
        self.make_list_of_bad_contrast_pics()
        ##
        ll = sorted(list(set(self.pics_to_rem)))                        # sorted list of bad pics
        if 1 in debug : print(f' list ll of pics to be removed is {ll}')
        with open(str(Path(self.folder) / 'rem_pics.json'),'w') as f:   # save the list of the bad pics
            json.dump(ll,f)

    def BF_ref(self):
        '''
        Video of BF without any cleaning..
        '''
        if self.name_layer == 'BF':
            if self.keep_ref_vid:
                self.create_video_layer(clear=False)  # keep a reference video with all the pics, not cleaned

    def make_layer_folder(self):
        '''
        '''
        self.folder_layer = Path(self.folder) / self.name_layer
        if not os.path.exists(self.folder_layer):
            os.makedirs(self.folder_layer)

    def remove_bad_pics_from_layer(self, video, clear, debug=[]):
        '''
        '''
        if self.name_layer == 'BF':
            self.make_list_pic_to_rem()                              # make the list  self.pics_to_rem
        lb = list(set(self.pics_to_rem))
        if 1 in debug: print(f'for layer {self.name_layer}, list of bad pics is {lb}')
        if video :
            self.BF_ref()                                                   # video without any cleaning
            self.create_video_layer(remove_bad_pics = lb, clear=clear)      # cleaned video

    def extract_layer(self, layer, video=True, rem_bad_pics=False, clear=True, debug=[]):
        '''
        Extract one layer
        '''
        self.name_layer = layer                               # name of the layer, eg: BF, fluo, RFP etc..
        self.make_layer_folder()
        num_lay = self.list_layers.index(layer)               # layer index
        self.film = Image.open(self.addr)                     # load the movie
        step = len(self.list_layers)
        for i in range(num_lay, self.film.n_frames, step):               # go throught the pics
            self.extract_one_image_from_layer(i, num_lay, step)          # deal with one image in given layer
        if rem_bad_pics:
            self.remove_bad_pics_from_layer(video, clear)
        else:
            if video : self.create_video_layer(clear=clear)   # no bad pic correction
        #plt.show()

    def extract_all_layers(self, rem_bad_pics=False, keep_ref_vid=False):
        '''
        Extract all the images from different layers
        keep_ref_vid : keep the video associated to the pictures
        '''
        self.keep_ref_vid = keep_ref_vid
        self.make_dir_with_file_name()                                            # folder with the name of the dataset
        for layer in self.list_layers:                             # go through the layers
            self.extract_layer(layer, rem_bad_pics=rem_bad_pics)   # extract the pics for one layer

    def take_num_frame_png_layer(self,elem):
        '''
        find num
        '''
        return int(re.findall('\d+', elem)[0])

    def make_list_imgs_for_video_layer(self, debug=0):
        '''
        '''
        ll = [opb(img) for img in glob.glob(f'{self.folder_layer}/*.png')]   # list of the images for given layer
        list_imgs_sorted = sorted(ll, key = lambda i: self.take_num_frame_png_layer(i))  #
        if debug>0:
            print(f'## ll is {ll}')
            print(f'## list_imgs_sorted is {list_imgs_sorted}')
        self.list_imgs_vid = []
        for f in list_imgs_sorted:
            img = cv2.imread(opj(self.folder_layer,f))
            self.list_imgs_vid.append(img)             # list of the images for the video

    def clear_folder_from_imgs(self):
        '''
        Remove the pics after the videos has been done..
        '''
        for img in glob.glob(f'{self.folder}/*.png'):
            os.remove(img)

    def create_video_layer(self, remove_bad_pics=None, clear=True):
        '''
        Create a video
        '''

        self.make_list_imgs_for_video_layer()
        if remove_bad_pics:
            op = 'cleaned_'
        else:
            op = ''
        addr_movie = Path(self.folder) / f'movie_{op}{self.name_layer}.avi'
        out = cv2.VideoWriter( str(addr_movie), cv2.VideoWriter_fourcc(*'DIVX'), 15, (self.size, self.size) )
        for i, img in enumerate(self.list_imgs_vid):
            if remove_bad_pics:
                if i in remove_bad_pics and i != 0:
                    out.write(prev_img)      # replace with previous image
                else:
                    out.write(img)
                    prev_img = img           # keep the image in case of the next image is bad
            else:
                out.write(img)
        out.release()
        if clear : self.clear_folder_from_imgs()

    def cp_to_dest(self):
        '''
        Copy in the destination folder..
        '''
        dest = opj(self.dest, opb(self.folder).replace(' ','_'))
        sh.copytree(self.folder, dest)

    def add_tif(self, tif0, tif1):
        '''
        Concatenate tif videos with "tiffcp" command
        '''
        outp = tif0
        outp = re.sub(r'_t\d+\.tif', '.tif', outp)
        print(f"outp is {outp}")
        os.system(f'tiffcp "{tif0}" "{tif1}" "{outp}"')

    def extract_tif_layers(self):
        '''
        Simply extract all the layers in tif format
        BF is layer 0
        '''
        film = io.imread(self.addr)
        for i,layer in enumerate(self.list_layers):
            io.imsave(f'{self.addr[:-4]}_{layer}.tif', film[i::3])

    def convert_4layers_to_3layers(self):
        '''
        Convert from (frames, layers, sizex, sizey) to (interwined frames, sizex, sizey)
        '''
        film = io.imread(self.addr)
        part_film = {}
        for i,layer in enumerate(self.list_layers):
            part_film[i] = film[:,i,:,:]
        s = part_film[0].shape
        img_final = np.empty((s[0]*2,s[1],s[2]), dtype=film.dtype)
        nblay = len(self.list_layers)
        for i,layer in enumerate(self.list_layers):
            img_final[i::nblay] = part_film[i]
        io.imsave(f'{self.addr[:-4]}_3layers.tif', img_final)
