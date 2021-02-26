import os, sys, glob, re, json
op = os.path
opd, opb, opj = op.dirname, op.basename, op.join
opa = op.abspath
import shutil as sh
from time import time
import inspect as insp
from pathlib import Path
from PIL import Image
import numpy as np
from skimage import io
##
from matplotlib import pyplot as plt
##
import cv2
#
from utils.sep_tif_layers import SEP_TIF_LAYERS as STL
from analyse_results import ANALYSE_RESULTS as AR
from modules_unet.util import UTIL
ut = UTIL()

class FULL_PROC():
    '''
    '''
    def __init__(self, dir_data, dir_exp, root_file, list_layers, dest):
        '''
        '''
        self.dir_data = Path(dir_data)
        self.dir_exp = dir_exp
        self.root_file = root_file
        self.root_file_dest = root_file.replace(' ','_')
        self.dest = dest
        self.list_layers = list_layers

    def num_file(self,i):
        '''
        '''
        return f'0{i}' if i<10 else f'{i}'

    def merge_t0000_t0001_tifs(self, list_tif=None, root_file=None, suffix_file=None):
        '''
        merge t000000 and t000001
        '''
        #
        tmerge0 = time()
        if not list_tif:
            list_tif = range(25)
        for i in list_tif:
            numf = self.num_file(i)
            f0 = f'{self.root_file}{numf}{suffix_file}0.tif'
            f1 = f'{self.root_file}{numf}{suffix_file}1.tif'
            addr0 = self.dir_data + '/' + self.dir_exp + '/' + f0
            addr1 = self.dir_data + '/' + self.dir_exp + '/' + f1
            stl = STL("a","b")
            stl.add_tif(addr0, addr1)
        tmerge1 = time()
        print(f"time elapsed is {(tmerge0-tmerge1)/60} min")

    def convert_4layers_to_3layers_all_tifs(self, list_tif=None, root_file=None, suffix_file=None):
        '''

        '''
        #
        tconv0 = time()
        if not list_tif:
            list_tif = range(25)
        for i in list_tif:
            numf = self.num_file(i)
            f = f'{self.root_file}{numf}.tif'
            addr = opj(self.dir_data, self.dir_exp, f)
            stl = STL(addr, self.dest)
            stl.convert_4layers_to_3layers()
        tconv1 = time()
        print(f"time elapsed is {(tconv0-tconv1)/60} min")

    def extract_layers_of_list_tif(self, list_tif=None, cpdest=True):
        '''
        Extract the layers (BF and fluo layers)
        '''
        if not list_tif:
            list_tif = range(25)
        for i in list_tif:
            t0_extract = time()           # time for extract
            numf = self.num_file(i)
            f0 = f'{self.root_file}{numf}.tif'
            addr0 = opj(self.dir_data, self.dir_exp, f0)
            stl = STL(addr0,self.dest)
            stl.list_layers = self.list_layers #['BF','fluo1'] #,'fluo2'
            stl.extract_all_layers(rem_bad_pics=True, keep_ref_vid=True)
            if cpdest : stl.cp_to_dest() # copy to destination
            t1_extract = time()
            print(f"time elapsed for extract is {(t1_extract-t0_extract)/60} min")

    def segm_track_list_tif(self, list_tif=None):
        '''
        Segment and track cells
        '''
        if not list_tif: list_tif = range(25)
        for n in list_tif:
            numf = self.num_file(n)
            for f in glob.glob(self.dest + f'/*f00{numf}/*cleaned_BF.avi'):
                tproc0 = time()
                root = opd(f)
                addr_BF = f
                dir_prog = opd(os.getcwd())
                os.chdir(dir_prog)
                proc_args = f'-f {addr_BF} -m ep5_v3 --video --track all --num_cell --save_in {root}'
                comm = f'python detect_cells.py {proc_args}'
                os.system(comm)
                tproc1 = time()
                print(f"time elapsed is {(tproc1-tproc0)/60} min")

    def find_max_curve(self, debug=[1]):
        '''
        '''
        if 1 in debug:
            print(self.ar.curr_obs[:10])
        try:
            maxy = max(self.ar.curr_obs)
        except:
            maxy = 500
        if type(maxy) == list :
            maxy = 500

        return maxy

    def extract_invidual_fluo(self, ct, debug=[1]):
        '''
        ct : correct track
        '''
        fig = plt.figure()
        if 1 in debug: print(self.ar.curr_obs[:10])
        maxy = self.find_max_curve() # int(1.3*maxy)
        self.ar.cell(ct).fluos('sum','1',norm=True).plot(ylim=[0,maxy*1.5])  # individual fluo
        plt.savefig(opj(self.addr_anal_fluo, f'evol_fluo{ct}.jpg'))
        lfluo = (np.round(self.ar.curr_obs,1)).tolist()
        json.dump({ct:lfluo}, self.json_fluo)
        plt.close(fig)

    def extract_individual_area(self,ct):
        '''
        '''
        fig = plt.figure()
        self.ar.cell(ct).areas().plot(ylim=[0,3000])   # surface
        plt.savefig(opj(self.addr_anal_area, f'evol_area{ct}.jpg'))
        larea = (np.round(self.ar.curr_obs,1)).tolist()
        json.dump({ct:larea}, self.json_area)
        plt.close(fig)

    def prepare_main_folder(self):
        '''
        '''
        self.addr_all_analyses = opj(self.dest, f'analyses_{ut.date()}')
        # if not os.path.exists(self.addr_all_analyses):
        #     os.mkdir(self.addr_all_analyses)

    def prepare_folders(self,num):
        '''
        '''
        numf = self.num_file(num)
        addr = opj(self.dest,f'{self.root_file_dest}{numf}')
        self.addr_analysis = opj(addr, f'analysis_{num}') # folder for analysis
        if os.path.exists(self.addr_analysis):
            sh.rmtree(self.addr_analysis)
        if not os.path.exists(self.addr_analysis):
            os.mkdir(self.addr_analysis)
        ##
        self.addr_anal_fluo = opj(self.addr_analysis, 'fluos')
        os.mkdir(self.addr_anal_fluo)
        #
        self.addr_anal_area = opj(self.addr_analysis, 'areas')
        os.mkdir(self.addr_anal_area)
        ##
        self.json_fluo = open(opj(self.addr_anal_fluo, 'val_fluos.json'), 'w')
        self.json_area = open(opj(self.addr_anal_area, 'val_areas.json'), 'w')

    def make_sorted_list_cntrs(self):
        '''
        '''
        l0 = glob.glob(self.dest + '/*/processings/proc_*-*/pkl_cntrs_[!pred]*')
        l0_sorted = sorted(l0, key= lambda elem : int(re.findall('f00(\\d+)', elem)[0]))
        return l0_sorted

    def make_addr(self,num, l0_sorted):
        '''
        '''
        numf = self.num_file(num)
        addr_cntrs = l0_sorted[num]
        addr_fluo = opj(self.dest,f'{self.root_file_dest}{numf}')
        addr_tif = opj(self.dir_data, self.dir_exp, f'{self.root_file}{numf}.tif')
        print(f'addr_cntrs is {addr_cntrs}')
        print(f'addr_fluo is {addr_fluo}')
        return addr_cntrs, addr_fluo, addr_tif

    def global_fluo(self,ar):
        '''
        '''
        ar.fluo_in_images(col='1').plot()                            # global fluo
        plt.savefig(opj(self.addr_anal_fluo, 'evol_global_fluo.jpg'))
        lfluo_gen = (np.round(ar.curr_obs,1)).tolist()
        json.dump({'global':lfluo_gen}, self.json_fluo)

    def extract_infos_from_procs_and_tif(self, load_fluo=1, list_tif=None):
        '''
        '''
        nb_fluo = len(self.list_layers)-1
        l0_sorted = self.make_sorted_list_cntrs() # sorted list of contours
        self.prepare_main_folder()                # folders for analysis
        if not list_tif: list_tif = range(25)
        for num in list_tif:
            tfig0 = time()
            self.prepare_folders(num)
            c, f, t = self.make_addr(num, l0_sorted)
            self.ar = AR(c,t,f, nb_fluo=nb_fluo, load_fluo=[load_fluo], ext='png')
            self.global_fluo(self.ar)
            self.ar.list_correct_tracks()                                     # keep only the good tracks
            for ct in self.ar.correct_tracks:                                 # ct : correct track
                self.extract_invidual_fluo(ct)
                self.extract_individual_area(ct)
            tfig1 = time()
            print(f'time elapsed is {(tfig1-tfig0)/60} min')
            sh.copytree( self.addr_analysis, self.addr_all_analyses )
            self.json_fluo.close()
            self.json_area.close()
