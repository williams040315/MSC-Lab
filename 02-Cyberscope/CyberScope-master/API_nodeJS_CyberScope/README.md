
# CyberScope

Microscopy and microfluidics controller for Cybergenetics

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
6. Copy Paste this code [{"id":"5328c626.03ad48","type":"tab","label":"Flow 2","disabled":false,"info":""},{"id":"8f06d34c.74216","type":"http in","z":"5328c626.03ad48","name":"","url":"/comment-est-votre-blanquette","method":"post","upload":false,"swaggerDoc":"","x":160,"y":260,"wires":[["eafa4f5c.1e555"]]},{"id":"4a259e17.002a1","type":"http response","z":"5328c626.03ad48","name":"","statusCode":"200","headers":{},"x":500,"y":260,"wires":[]},{"id":"eafa4f5c.1e555","type":"function","z":"5328c626.03ad48","name":"","func":"msg.payload.status = 'connected';\nreturn msg;","outputs":1,"noerr":0,"x":370,"y":260,"wires":[["4a259e17.002a1"]]},{"id":"f6928415.55ad98","type":"http in","z":"5328c626.03ad48","name":"","url":"/simple-tes","method":"post","upload":false,"swaggerDoc":"","x":100,"y":320,"wires":[["a1b0069c.6da4d8"]]},{"id":"19255f28.048f81","type":"http response","z":"5328c626.03ad48","name":"","statusCode":"200","headers":{},"x":500,"y":320,"wires":[]},{"id":"a1b0069c.6da4d8","type":"function","z":"5328c626.03ad48","name":"","func":"msg.payload.message='OMG ITS WORKING, MESSAGE SENT FROM nodeRED!';\nreturn msg;","outputs":1,"noerr":0,"x":370,"y":320,"wires":[["19255f28.048f81"]]},{"id":"1464374.a5470c9","type":"http in","z":"5328c626.03ad48","name":"","url":"/simple-test","method":"post","upload":false,"swaggerDoc":"","x":100,"y":380,"wires":[["516701fe.c21c1"]]},{"id":"af28d420.0e5a38","type":"http response","z":"5328c626.03ad48","name":"","statusCode":"200","headers":{},"x":500,"y":380,"wires":[]},{"id":"516701fe.c21c1","type":"function","z":"5328c626.03ad48","name":"","func":"msg.payload.message='OMG ITS WORKING, MESSAGE SENT FROM nodeRED!';\nreturn msg;","outputs":1,"noerr":0,"x":370,"y":380,"wires":[["af28d420.0e5a38"]]},{"id":"ce1c3e60.d90d2","type":"http in","z":"5328c626.03ad48","name":"","url":"list-device-connected","method":"post","upload":false,"swaggerDoc":"","x":140,"y":200,"wires":[["71593082.be874"]]},{"id":"fe52e6c2.54dab8","type":"http response","z":"5328c626.03ad48","name":"","statusCode":"200","headers":{},"x":500,"y":200,"wires":[]},{"id":"71593082.be874","type":"function","z":"5328c626.03ad48","name":"","func":"msg.payload.CoolLed_pE4000_fluorescence = 'connected';\nmsg.payload.X_Cite_120PC_fluorescence = 'connected';\nmsg.payload.CoolLed_pE100_fluorescence = 'connected';\nmsg.payload.CoolLed_pE300_mosaic = 'connected';\nmsg.payload.Olympus_IX81 = 'connected';\nmsg.payload.Fluigent_micro_fluidic_10_valves = 'connected';\nreturn msg;","outputs":1,"noerr":0,"x":370,"y":200,"wires":[["fe52e6c2.54dab8"]]},{"id":"6d3e1e5a.c7793","type":"http in","z":"5328c626.03ad48","name":"","url":"test-prior","method":"post","upload":false,"swaggerDoc":"","x":100,"y":440,"wires":[["64c3cf55.0a3f8"]]},{"id":"64c3cf55.0a3f8","type":"function","z":"5328c626.03ad48","name":"","func":"var myX = Math.floor((Math.random() * 10000) + 1);\nvar myY = Math.floor((Math.random() * 10000) + 1);\nvar myZ = Math.floor((Math.random() * 10000) + 1);\nmsg.payload.X = myX;\nmsg.payload.Y = myY;\nmsg.payload.Z = myZ;\nreturn msg;","outputs":1,"noerr":0,"x":370,"y":440,"wires":[["3b348c66.577e84"]]},{"id":"3b348c66.577e84","type":"http response","z":"5328c626.03ad48","name":"","statusCode":"200","headers":{},"x":500,"y":440,"wires":[]},{"id":"82d94ab3.75a848","type":"http in","z":"5328c626.03ad48","name":"","url":"run-protocol","method":"post","upload":false,"swaggerDoc":"","x":110,"y":500,"wires":[["2b8f8b9e.98ad64"]]},{"id":"2b8f8b9e.98ad64","type":"function","z":"5328c626.03ad48","name":"","func":"\nmsg.payload.status='OK';\nreturn msg;","outputs":1,"noerr":0,"x":370,"y":500,"wires":[["7c8ab818.2098e8"]]},{"id":"7c8ab818.2098e8","type":"http response","z":"5328c626.03ad48","name":"","statusCode":"200","headers":{},"x":500,"y":500,"wires":[]}]
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

This directory contains all the codes to perform a multidimensional acquisition on the Miss Marple microscope.
The equipment is as follows:

-Olympus IX-81

-CoolLED-PE4000

-XCite-Exact-120PC

-Photometrics-Evolv512

The equipment available soon are:

-Andor-MOSAIC3

-Andor-ZYLA

Each of these nodes must be installed as indicated by the node-red site (https://nodered.org/docs/) with the npm command.

The settings.js must be configured in the nod-red installation file by indicating the link and name of the static library.

The flow can be directly copied from the graphical interface of nod-red thanks to the clipboard.
