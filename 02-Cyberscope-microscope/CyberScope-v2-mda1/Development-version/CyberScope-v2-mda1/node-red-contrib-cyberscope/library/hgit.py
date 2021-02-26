#!/usr/bin/env python
"""
A very simple git parser.
"""
import subprocess
from subprocess import check_output

branch = "master"
version = ""
try:
    branch = check_output(["git", "rev-parse", "--abbrev-ref", "HEAD"]).strip().decode()
    version = check_output(["git", "rev-parse", "HEAD"]).strip().decode()
except FileNotFoundError:
    pass
except subprocess.CalledProcessError:
    pass
    
def getBranch():
    return branch

def getVersion():
    return version

if (__name__ == "__main__"):
    print("Branch:", branch)
    print("Version:", version)
