#!/usr/bin/python
# Add the storm-control directory that this module is located in to
# sys.path, remove any default storm-control directory (if it exists).
#

import os
import sys

sc_directory = os.path.abspath(__file__)
for i in range(3):
    sc_directory = os.path.split(sc_directory)[0]

# Remove the default storm-control directories (if it exists).
for elt in sys.path:
    if (elt.endswith("storm-control")):
        sys.path.remove(elt)

# Add the new storm-control directory.
sys.path.append(sc_directory)
