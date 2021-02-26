from bokeh.io import output_notebook, show
from bokeh.plotting import figure, output_file, gridplot
from bokeh.palettes import Dark2_5 as palette
from bokeh.layouts import widgetbox, row, column
from bokeh.models import CheckboxButtonGroup, CheckboxGroup, CustomJS, Slider, Button
import itertools
import numpy as np

from bokeh.layouts import column, row, widgetbox

# create a new plot (with a title) using figure

start = 10.0
nbexp = 5              # number of experiments
nbframes = range(120)
nbcells = 160

class BOKEH_VISU():
    '''
    '''
    def __init__(self,  title=None, plwidth=800, plheight=400):
        '''
        '''
        self.p = figure(plot_width=plwidth, plot_height=plheight, title=title)

    def set_axis(self, xaxis, yaxis):
        '''
        '''
        p.xaxis.axis_label = xaxis # 'Frames'
        p.yaxis.axis_label = yaxis #'Normalized fluorescence'

    def make_curves(self):
        '''
        '''
        colors = itertools.cycle(palette)
        for exp in range(nbexp):
            for n in range(nbcells):
                y = np.cumsum(np.random.randn(1,len(nbframes)))
                #p.line(x, y, line_width=1, legend_label=str(n), color=next(colors), name=str(n))
                p.line(nbframes, y, line_width=1, color=next(colors), name= f'{exp}_{n}')
        make_curves()

    def define_callback(self):
        '''
        '''

        self.callback = CustomJS(code="""


                rend_list = fig.renderers
                var s1val = s1.value
                var s2val = s2.value
                var name_graph = s2val + '_' + s1val

                for (rend of rend_list) {

                    if (rend.name!==null) {
                        if (rend.name != name_graph){   // visible if corresponding to sliders values
                           rend.visible = false
                        }
                        else{rend.visible = true}


                    }
                }
        """)

    def make_widgets(self):
        '''
        '''

        #checkbox = CheckboxGroup(labels = ['show all'], active = [0], callback=callback1)
        #butt1 = Button(label="show all", button_type="success", width=50)

        s1 = Slider(start=0, end=nbcells, value=1, step=1, title="cell n°", callback=callback1)
        s2 = Slider(start=0, end=nbexp-1, value=1, step=1, title="experim", callback=callback1)
        ####
        self.callback.args["s1"] = s1
        self.callback.args["s2"] = s2
        self.callback.args['fig'] = self.p
        #callback1.args['cb'] = checkbox
        #butt1.on_click(make_curves)

        self.layout = column(
            self.p,
            widgetbox(s1,s2),
        )

        self.p.toolbar.logo = None

    def output(self, filename, title):
        '''
        '''
        # "fluo_frames.html"
        # "fluo evolution with time"
        output_file(filename, title=title)
        show(self.layout)
