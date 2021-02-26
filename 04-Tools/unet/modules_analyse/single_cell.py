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
from scipy.linalg import norm

class SINGLE_CELL():
    '''
    '''
    def __init__(self):
        pass

    def cell(self,i):
        '''
        Select a cell
        i : cell id
        '''
        self.id = i                                # identity of the cell
        self.list_cntrs_ci = []                    # list of contours for cell i
        for j,lc in self.cntrs.items():            # go through the images, lc : list_contours for current image
            try:
                self.list_cntrs_ci.append(lc[i])   # add contour cell i
            except:
                self.list_cntrs_ci.append(0)       # no contour at this time

        return self

    def make_list_areas(self, l):
        '''
        l : list of the contours for a specific cell during time
        '''
        list_areas = []
        for c in l:           # contour for unique cell during time
            try:
                list_areas.append(cv2.contourArea(c))   # append the surface in function of the time
            except:
                list_areas.append(0)                    # no contour at this time
        return list_areas                 # list of areas during time for unique cell

    def areas(self, title=None):
        '''
        list of the areas of the cell during time
        '''
        self.obs = 'area'
        list_areas = self.make_list_areas(self.list_cntrs_ci)
        self.curr_obs = list_areas
        if not title:
            self.title = f'area evolution for cell {self.id}'
        else:
            self.title = title
        self.xlabel = 'frames'
        self.ylabel = 'cell area'
        return self

    def track(self, *args, debug=[]):
        '''
        make the list of the positions of the cell during the time
        '''
        self.obs = 'track'
        list_pos_ci = []                                # list of the position of the cell i
        self.positions = {}
        for c in self.list_cntrs_ci:
            try:
                list_pos_ci.append(self.pos(c))             # append the position in function of the time
            except:
                if 1 in debug: print('position not existing')
        x, y = [p[0] for p in list_pos_ci], [p[1] for p in list_pos_ci]
        self.positions[self.id] = list_pos_ci
        for arg in args:
            if arg == 'corr': x,y = self.cut_at_big_jump(x,y)   #  cut the tracking when there is a "big jump"
        self.title = 'cell tracking'
        self.curr_obs = [x,y]

        return self

    def find_steps(self):
        '''
        '''
        self.steps = list( map( norm, np.diff( self.positions[self.id], axis=0 ) ) )
        return self

    def find_if_big_jumps(self,big_jump=50):
        '''
        '''
        self.find_steps()
        return True if max(self.steps) > big_jump else False

    def step_track(self):
        '''
        list of the distances between the tracking steps..
        '''
        self.find_steps()
        self.steps_filtered = []
        for s in self.steps:
            self.steps_filtered += [s]
            if s > self.lim_step_max:
                break
        print("len(self.steps) ", len(self.steps))
        print("len(self.steps_filtered) ", len(self.steps_filtered))
        self.len_no_jump = len(self.steps_filtered)

    def cut_at_big_jump(self,x,y):
        '''
        Cut x and y at the first big jump
        A posteriori correction
        '''
        self.step_track()
        s = slice(self.len_no_jump)

        return x[s],y[s]

    def list_correct_tracks(self):
        '''
        '''
        self.count()
        max_nb_cells = self.nb_cells[len(self.cntrs)-1]
        self.correct_tracks = []
        for i in range(216):
            try:
                if not self.cell(i).track().find_if_big_jumps():
                    self.correct_tracks += [i]
            except:
                pass

    def fluo_val(self,c,i,col,norm):
        '''
        '''
        try:
            s = self.sum_fluo(c,i,col,norm=norm)
        except:
            s = 0
        return s

    def fluos(self,kind,col,norm=False,lim_fluo=[-1e6,1e6]):
        '''
        make the list of the fluo integral for the cell during the time
        kind : sum or std
        col : an index : 1, 2 etc..
        norm : normalized
        '''
        self.obs = 'fluo'
        self.title = 'fluorescence evolution'
        self.xlabel = 'frames'
        self.ylabel = 'normalized fluorescence' if norm else 'fluorescence'
        list_fluos_ci = []
        for i,c in enumerate(self.list_cntrs_ci):          # i is the image index
            if kind == 'sum':
                list_fluos_ci.append(self.fluo_val(c,i,col,norm))   # append the fluo in function of the time
            elif kind =='std':
                list_fluos_ci.append(self.std_fluo(c,i,col))   # append the fluo in function of the time
        cnd0 = max(list_fluos_ci) < lim_fluo[1]
        cnd1 = min(list_fluos_ci) > lim_fluo[0]
        self.curr_obs = list_fluos_ci if cnd0 and cnd1 else np.zeros(len(list_fluos_ci))
        return self
