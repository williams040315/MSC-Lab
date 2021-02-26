To do : remove API_nodeJS_CyberScope folder

# Branch CyberScope-v1-mda1

- Microscopy and microfluidics controller for Cybergenetics, version 1, mda 1. This version allows sequential acquisitions. [The management of microfluidics is independent](https://github.com/Lab513/CyberLab/tree/master/MicroFluidicControl). The server and the client are installed on the same machine.

Installation / start-up
----------------------------
1. Install the recommended version of [nodeJS](https://nodejs.org/en/)
2. Install [node-red](https://nodered.org/docs/getting-started/)
3. Install [Anaconda 3 and Python3](https://www.anaconda.com/distribution/)
4. Install OpenCV package for python
5. Follow the recommented instructions for [Photometrics Camera](https://github.com/Photometrics/PyVCAM) and install the wrapper Python
6. Install the node-red-contrib-* node: to do this, open a command terminal and move to the node-red folder; usually ./node-red and then run the following installation command: `npm install [full path where the node is located] / node-red-contrib-*`. For example, if the node is in c: / desktop, you need to run the `npm install c: / desktop / node-red-contrib-*` command [section: Testing your node in Node-RED](https://nodered.org/docs/creating-nodes/first-node)
7. In `./node-red/setting.js` update the ligne `httpStatic` with `[full path node red]/cyberscope/`, 
8. Start node-red with the node-red command; if it does not work check that node-red is set as environment variable on your system
9. Once node-red is launched, import a [cyberScope_v1_mda1](https://github.com/Lab513/CyberScope/tree/CyberSCope-v1-mda1/Installed-version/CyberScope-v1-mda1/flows) code (in folder flows, just drag and drop) from http://127.0.0.1:1880
10. Deploy the server by clicking on 'deploy'
11. [Lunch the web navigator (google chrome for example)](http://127.0.0.1:1880:Cyberscope)

------------------------------------------------------------------------------------------------------------------------------------------
Williams BRETT | Lab513 | wllmsbrtt@gmail.com for any questions
