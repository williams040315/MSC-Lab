#!/usr/bin/env python
# encoding: utf-8
"""
define_all_pages.py
Build the variables used by jinja needed for the views
"""
import os, re
import os.path as op
opd, opb, opj = os.path.dirname, os.path.basename, os.path.join
import shutil as sh
import glob
from flask import url_for, session
import json

Interface_subtitle = ""

def scan_processed(path):
    '''
    Find the list of the processed folders
    '''
    list_dir = []
    for item in os.listdir(path):
        print(item)
        if item not in ['.DS_Store']:
            list_dir.append(item)
    return list_dir

def atoi(text):
    return int(text) if text.isdigit() else text

def natural_keys(text):
    '''
    take number in the name
    '''
    return [ atoi(c) for c in re.split('(\d+)', text) ]

class define_page(object):
    '''
    General template
    '''
    def __init__(self):
        self.body = {}
        self.header = {}
        self.footer = {}
        ### Body
        self.body['main_title'] = ""
        self.body['subtitle'] = ""
        self.body['explanations'] = ""
        ### Header
        self.header['main_title'] = ""
        self.header['presentation_interface'] = ""
        self.header['background'] = op.join('static/img/T2_ILT_clean_very_very_reduced_opacity.jpg')

        self.header['url_reload'] = url_for('processed')
        self.header['url_doc'] = url_for('documentation')
        self.header['url_visu'] = url_for('visu_results')

        ### Footer
        self.footer['background'] = op.join('static/img/black.jpg')
        self.footer['copyright'] = "no Copyright, version 0.0.0"

class define_firstpage(define_page):
    def __init__(self):
        '''
        Welcome page with link for login.
        '''
        define_page.__init__(self)
        self.header['main_title'] = 'Welcome'
        self.header['presentation_interface'] = 'Laplace Inverse Transform for 2D Relaxation experiments'
        ###
        self.body['main_title'] = ""
        self.body['subtitle'] = ""
        # Baseline correction, adjustement & data visualization
        self.body['explanations'] = " "
        self.body['begin'] = u"Begin \u2192"

class define_upload_page(define_page):
    def __init__(self):
        '''
        Page (index_folder.html) for entering the parameters and launching the processings.
        '''
        try:
            proc_done = opj(os.getcwd(), 'static','proc_done.p')
            with open(proc_done) as f :
                self.proc_done = True
        except:
            self.proc_done = False
        define_page.__init__(self)

class define_processing(define_page):
    def __init__(self):
        '''
        Page (index_folder.html) for entering the parameters and launching the processings.
        '''
        define_page.__init__(self)
        ### Header
        self.header['main_title'] = "Processing"
        self.header['presentation_interface'] = Interface_subtitle
        self.url_processing = url_for('processing')

class define_visu_results(define_page):
    def __init__(self, debug=1):
        '''
        Produce the data needed in the page visu_results.html
        '''
        define_page.__init__(self)
        ### Header
        self.header['background'] = op.join('static/img/blue_degr.jpg')
        self.header['main_title'] = "Visualisation"
        self.header['presentation_interface'] = Interface_subtitle
        ####
        addr_data = opj('static','list_proc.json')                  # address of the data to be processed with other informations
        with open(addr_data, 'r') as f:
            if debug>0: print("###### In define_visu_results, list_proc is ", f)
            dict_data = json.load(f)
        self.dict_data_short = {}
        self.dict_visu = [{}]
        self.dict_name_visu = [{}]
        self.dict_control = [{}]
        if debug>0: print("dict_data ", dict_data)

        ######        Peakpicking

        # with open(name_pp , 'r') as f:
        #     self.dict_pp = json.load(f)
        #     if debug>0: print("###### dict_pp is ", self.dict_pp)
        #self.all_dict_pp.append(self.dict_pp)
        try:
            downloadready = opj(os.getcwd(),'static','download_ready.p')
            with open(downloadready) as f :
                self.download = True
                if debug>0: print("########   attribute for permitting to open download is True")
        except:
            self.download = False
            if debug>0: print("########   attribute for permitting to open download is False  !!! ")

        if debug>0: print("self.dict_visu ", self.dict_visu)

class define_processed(define_page):
    def __init__(self):
        '''
        Page (index_folder.html) for entering the parameters and launching the processings.
        '''
        define_page.__init__(self)
        ### Header
        self.header['main_title'] = "Processed"
        self.header['presentation_interface'] = Interface_subtitle
        self.url_processed = url_for('processed')
        self.list_dir = scan_processed(opj(os.getcwd(), 'static', 'previous_proc'))

class define_documentation(define_page):
    def __init__(self):
        '''
        Page for the documentation
        All the doc is done in markdown using straptoc.js
        '''
        define_page.__init__(self)
        ### Header
        self.header['main_title'] = "Documentation"
        self.header['presentation_interface'] = Interface_subtitle
