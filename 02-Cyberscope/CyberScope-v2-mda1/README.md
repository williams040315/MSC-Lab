To do : move API_nodeJS_CyberScope folder in development version

# Branch CyberScope-v2-mda1

- Associated folder : [API_nodeJS_CyberScope / Android_Client_CyberScope / ReactNativeClientMDA2 / CyberScope-v2-mda1](https://github.com/Lab513/CyberScope/tree/CyberScope-v2-mda1/Development-version/CyberScope-v2-mda1)

- Microscopy and microfluidics controller for Cybergenetics, version 2, mda 1.1. This version allows sequential acquisitions. [The management of microfluidics is independent](Https://github.com/Lab513/CyberLab/tree/master/MicroFluidicControl). The server (equipment control) and the client (server API) are installed on different machines. This architecture makes it possible to secure the microscope.

To use GIT on Windows, start by installing [Git BASH](https://gitforwindows.org/)
Then open the terminal prompt and type `git clone https://github.com/Lab513/CyberScope.git`

CyberScope is divided in three parts, Node.js server, Node-RED server and an Android client

Node.js server is located in the `API_nodeJS_CyberScope` folder.
Step to run the Node.js server :
1. Install [Node.js](https://nodejs.org/en/)
2. Install [MongoDB](https://www.mongodb.com/download-center/community?jmp=docs)
3. `cd CyberScope/API_nodeJS_CyberScope`
4. `npm install`
5. `node index.js`

For now Node-RED is not finished yet. Follow the step below to simulate a CyberScope's Node-RED server :
1. Open a new terminal
2. Install node-red : `npm install node-red`
3. Open a new tab in your web browser and go to `127.0.0.1:1880`
4. On your flow click on the top right burger button
5. Then click Import > Clipboard
6. Copy Paste thes flow code API_nodeJS_CyberScope/API_nodeJS_CyberScope.json
7. Click on the "Import" button
8. Then click on the top right button "Deploy"
9. That's it ! You have simulate Node-RED

Now you can Open your Web browser and go to `localhost:4000` :
1. Create your account and then login to CyberScope
2. Go to Administration Panel on the top menu
3. Click on the button "Add a new microscope", set a random name and IP and click "Add microscope"
4. Click on the top left "Home" button
5. Now you can Book your new microscope
6. WARNING : You won't be able to access the "Manuel" and the "Settings Channels" panels for now because the deployment script is not finish yet.
7. To perform an MDA click on the "MDA" button on the top nav bar
8. That's it ! You have successfully simulate the CyberScope application !

This directory contains all the codes to perform a multidimensional acquisition on the Miss Marple, Mustard, Dr Who, and Sherlock microscopes.
The equipment is as follows: Olympus IX-71/81/83, Uniblitz-VCM-D1, Ismatec-RegloDigital, CoolLED-PE4000, CoolLEd-PE300, Pro-Scan2 (Prior), XCite-Exact/120PC, Photometrics-Evolv512/CoolSnap, Andor-MOSAIC3/ZYLA/NEO
- Each of these nodes must be installed as indicated by the node-red site (https://nodered.org/docs/) with the npm command.
- The settings.js must be configured in the nod-red installation file by indicating the link and name of the static library.
- The flow can be directly copied from the graphical interface of nod-red thanks to the clipboard.

------------------------------------------------------------------------------------------------------------------------------------------
Pierre-Louis CRESCITZ | Lab513 
