
module.exports = function(RED) {
    "use strict";
    var settings = RED.settings;
    var events = require("events");
    var serialp = require("serialport");
    var context ;
    var bufMaxSize = 32768;  // Max serial buffer size, for inputs...
    var fs = require("fs");
    //var content = fs.readFileSync("node-red-contrib-cyberscope/locales/en-US/cyberscope.json");
    //var jsonContent = JSON.parse(content);
    //var master  = jsonContent.master.name; ///a méditer///
    var master = "Miss Marple";
    
    function SerialPortNode(n) {
        RED.nodes.createNode(this,n);
        this.serialport = n.serialport;
        this.newline = n.newline;
        this.addchar = n.addchar || "false";
        this.serialbaud = parseInt(n.serialbaud) || 57600;
        this.databits = parseInt(n.databits) || 8;
        this.parity = n.parity || "none";
        this.stopbits = parseInt(n.stopbits) || 1;
        this.bin = n.bin || "false";
        this.out = n.out || "char";
    }
    RED.nodes.registerType("serial-port-cyberscope",SerialPortNode);


    
    function SerialNodeCoolLed(n) {
        RED.nodes.createNode(this,n);
        this.serial = n.serial;
        console.log(this.serial);
        this.serialConfig = RED.nodes.getNode(this.serial);
        console.log(this.serialConfig);
        
        if (this.serialConfig) {
            var node = this;
            node.tout = null;
            var buf;
            context = this .context().global ;
            if (node.serialConfig.out != "count") { buf = new Buffer(bufMaxSize); }
            else { buf = new Buffer(Number(node.serialConfig.newline)); }
            var i = 0;
            node.status({fill:"grey",shape:"dot",text:"node-red:common.status.not-connected"});
            node.port = serialPool.get(this.serialConfig.serialport,
                this.serialConfig.serialbaud,
                this.serialConfig.databits,
                this.serialConfig.parity,
                this.serialConfig.stopbits,
                this.serialConfig.newline
            );
            //node.port = serialConfig.get('COM5',57600,8,'None',1,'');
            
            var device  =  n.model+'_'+n.link;
            var type    = 'light-source';
            var mode    = "init";
            var action  = "getChannelsValues" ;
            var compareDevice = n.model ;
            
            setTimeout(function(){
                if(node.port.error)
                    node.send({payload:{
                        'device'    : device,
                        'type'      : type,
                        'mode'      : mode,
                        'action'    : action,
                        'master'    : master,
                        'function'  : ['setChannelsValues','getChannelsValues','setAllChannelsClosed','setLockPod'],
                        'html'      : ['<button id="blink"></button>','<button id="high"></button>','<button id="low"></button>'],
                        'connected' : ! node.port.error
                    }});
                    else {getChannelsValues(device) ; node.log(device+':getChannelsValues');}              
            },3000);

            //node.send({payload:{'topic':topic,'device':device,'type':type,'mode':mode,'action':action,'master':master}});

            if(compareDevice === 'CoolLed_pE4000'){
                var pE4000 = {
                    'L' : [365,460,525,635],
                    'I' : [20,40,60,80],
                    'S' : ['ON','OFF','OFF','ON'],
                    'autoClose' : 0,
                    'nbChannels' : 4,
                    'lockPod' : 'OFF' ,
                    'getChannelsValues' : [['LAMS','CSS?'],[4,1],0],
                    'setChannelsValues' : [[['LOAD:','CxS','CxI'],['LOAD:','CxI','CxX']],[[2,1,1],[2,1,1]],0], //[[ON],[OFF]]
                    'setAllChannelsClosed' : [['CAX','CBX','CCX','CDX','LAMS','CSS?'],[1,1,1,1,4,1],0],
                    'setLockPod' : [[['PORT:P=ON'],['PORT:P=OFF']],[[1],[1]],0],
                    'validL' : [[365,385,405,435],[460,470,490,500],[525,550,580,595],[635,660,740,770]],
                    'validI' : [0,100],
                    'validS' : ['ON','OFF'],
                    'validautoClose' : [-1,60000]
                };
                context.set("busypE4000","no");
            }
            var req ; var res ; var cmd ; var len ; var order ;

            
            function setLockPod(device, payload){
                if(compareDevice === 'CoolLed_pE4000'){
                    context.set("busypE4000","yes");
                    action = 'setLockPod' ;
                    pE4000.lockPod = payload.lock_pod ;
                    
                    cmd   = pE4000.setLockPod[0][payload.lock_pod === 'OFF' ? 0 : 1 ] ;
                    len   = pE4000.setLockPod[1][payload.lock_pod === 'OFF' ? 0 : 1 ] ;
                    for(var j=0 ; j<pE4000.getChannelsValues[0].length;j++){
                        cmd.push(pE4000.getChannelsValues[0][j]);
                        len.push(pE4000.getChannelsValues[1][j]);
                    }
                    order = pE4000.setLockPod[2] ;
                    sendSimpleCommand(cmd[order]);
                }
            }
            function setAllChannelsClosed(device){
                if(compareDevice === 'CoolLed_pE4000'){
                    context.set("busypE4000","yes");
                    action = 'setAllChannelsClosed' ;
                    cmd   = pE4000.setAllChannelsClosed[0] ;
                    len   = pE4000.setAllChannelsClosed[1] ;
                    order = pE4000.setAllChannelsClosed[2] ;
                    sendSimpleCommand(cmd[order]);
                }
            }
            
            function getChannelsValues(device){
                if(compareDevice === 'CoolLed_pE4000'){
                    context.set("busypE4000","yes");
                    action = 'getChannelsValues' ; 
                    cmd   = pE4000.getChannelsValues[0] ;
                    len   = pE4000.getChannelsValues[1] ;
                    order = pE4000.getChannelsValues[2] ;
                    console.log(cmd);
                    console.log(len);
                    console.log(order);
                    sendSimpleCommand(cmd[order]);
                 }
            }
            function setChannelsValues(device, payload){
                if(compareDevice === 'CoolLed_pE4000'){
                    context.set("busypE4000","yes");
                    action = 'setChannelsValues' ; 
                    cmd = []; len = [] ;
                    var validCSS = 0 ;
                    var cpt = 1;

                    if(!((pE4000.L[0]===parseInt(payload.La))&&(pE4000.L[1]===parseInt(payload.Lb))&&(pE4000.L[2]===parseInt(payload.Lc))&&(pE4000.L[3]===parseInt(payload.Ld))&&(pE4000.I[0]===parseInt(payload.Ia))&&(pE4000.I[1]===parseInt(payload.Ib))&&(pE4000.I[2]===parseInt(payload.Ic))&&(pE4000.I[3]===parseInt(payload.Id))&&(pE4000.S[0]===(payload.Sa))&&(pE4000.S[1]===(payload.Sb))&&(pE4000.S[2]===(payload.Sc))&&(pE4000.S[3]===(payload.Sd)))){
                        cmd.push('CSF');len.push(1);
                        for(var i=0 ; i<pE4000.nbChannels;i++){
                            var select = - 1 ;
                            if((payload['S'+String.fromCharCode(97+i)] === pE4000.validS[0])&&(pE4000.S[i] === 'OFF')){cpt = cpt + 1 ;select = 0;}
                            if((payload['S'+String.fromCharCode(97+i)] === pE4000.validS[0])&&(pE4000.S[i] === 'ON')){
                                if(payload['L'+String.fromCharCode(97+i)] !== pE4000.L[i]){cpt = cpt + 1 ;select = 0;}
                                else {cmd.push('C'+String.fromCharCode(65+i)+'I'+payload['I'+String.fromCharCode(97+i)]); len.push(1);select = 0;}
                            }
                            if(payload['S'+String.fromCharCode(97+i)] === pE4000.validS[1]) select = 1 ;
                            if(select !== -1){
                                validCSS = validCSS + 1 ;
                                for(var x=0 ; x<pE4000.setChannelsValues[0][select].length;x++){
                                    cmd.push(pE4000.setChannelsValues[0][select][x].replace('x',String.fromCharCode(65+i)).replace('LOAD:','LOAD:'+payload['L'+String.fromCharCode(97+i)]).replace('C'+String.fromCharCode(65+i)+'I','C'+String.fromCharCode(65+i)+'I'+payload['I'+String.fromCharCode(97+i)]));
                                    len.push(pE4000.setChannelsValues[1][select][x]);   
                                }
                            }
                        }
                        if(validCSS !== 0){
                            cmd.push('CSN');len.push(cpt);
                        }
                        for(var j=0 ; j<pE4000.getChannelsValues[0].length;j++){
                            cmd.push(pE4000.getChannelsValues[0][j]);
                            len.push(pE4000.getChannelsValues[1][j]);
                        }
                        order = pE4000.setChannelsValues[2];
                        sendSimpleCommand(cmd[order]);//send
                        //timeout setOff
                        pE4000.autoClose = parseInt(payload.auto_close) ;
                    }
                }
            }
            function  verifyOwnProperty(payload){
                var validOwnProperty = false ;
                 if(compareDevice === 'CoolLed_pE4000'){
                    if (payload.hasOwnProperty("La")&&payload.hasOwnProperty("Lb")&&payload.hasOwnProperty("Lc")&&payload.hasOwnProperty("Ld")&&payload.hasOwnProperty("Ia")&&payload.hasOwnProperty("Ib")&&payload.hasOwnProperty("Ic")&&payload.hasOwnProperty("Id")&&payload.hasOwnProperty("Sa")&&payload.hasOwnProperty("Sb")&&payload.hasOwnProperty("Sc")&&payload.hasOwnProperty("Sd")&&payload.hasOwnProperty("auto_close")){
                        for(var i=0;i<pE4000.nbChannels;i++){
                            if((parseInt(payload['L'+String.fromCharCode(97+i)])==pE4000.validL[i][0])||(parseInt(payload['L'+String.fromCharCode(97+i)])==pE4000.validL[i][1])||(parseInt(payload['L'+String.fromCharCode(97+i)])==pE4000.validL[i][2])||(parseInt(payload['L'+String.fromCharCode(97+i)])==pE4000.validL[i][3])){
                                if(parseInt(payload['I'+String.fromCharCode(97+i)])>=pE4000.validI[0] && parseInt(payload['I'+String.fromCharCode(97+i)])<=pE4000.validI[1]){
                                    if(payload['S'+String.fromCharCode(97+i)]==pE4000.validS[0] || payload['S'+String.fromCharCode(97+i)]==pE4000.validS[1]) validOwnProperty = true ;
                                    else {validOwnProperty = false ; break;}         
                                } else {validOwnProperty = false ; break;}
                            } else {validOwnProperty = false ; break;}
                        }
                        if(parseInt(payload.auto_close)>=pE4000.validautoClose[0] && parseInt(payload.auto_close)<=pE4000.validautoClose[1]) validOwnProperty = true ;
                        else validOwnProperty = false ;
                    } else validOwnProperty = false ;
                }
                return validOwnProperty ;
            }
            function sendSimpleCommand(cmd){
                var payload = cmd ;
                node.addCh = "";
                if (node.serialConfig.newline.substr(0,2) == "0x") node.addCh = new Buffer([parseInt(node.serialConfig.newline)]);
                else node.addCh = new Buffer(node.serialConfig.newline.replace("\\n","\n").replace("\\r","\r").replace("\\t","\t").replace("\\e","\e").replace("\\f","\f").replace("\\0","\0")); // jshint ignore:line                
                if (!Buffer.isBuffer(payload)) {
                    if (typeof payload === "object") payload = JSON.stringify(payload);
                    else payload = payload.toString();
                    if ((node.serialConfig.out === "char") && (node.serialConfig.addchar === true)) { payload += node.addCh;}
                } else if ((node.serialConfig.out === "char") && (node.serialConfig.addchar === true) && (node.addCh !== "")) payload = Buffer.concat([payload,node.addCh]);                  
                node.port.write(payload,function(err,res) {
                if (err) {
                        var errmsg = err.toString().replace("Serialport","Serialport "+node.port.serial.path);
                        node.error(errmsg,msg);
                    }
                });
            }
            node.on("input",function(msg) {
                    
                    //node.port.change = true ;
                    //serialPool.close(this.serialConfig.serialport,function promiseResolve(x){});
                                  /*
                    setTimeout(function(){
                        getChannelsValues('CoolLed_pE4000');
                    },6000);*/
                    
                 if (true&&(context.get("busypE4000")||"yes") === "no"){    
                    if (msg.hasOwnProperty("payload")) {
                      
                      
                      
                        
                    
                        if(true&&(msg.payload.hasOwnProperty("device"))&&(msg.payload.device === device)){
                            if (msg.hasOwnProperty("res")) res = msg.res ;
                            if (msg.hasOwnProperty("req")) req = msg.req ;
                            if (msg.payload.hasOwnProperty("mode")) mode = msg.payload.mode ;
                            else mode = '' ;
                            if (msg.payload.hasOwnProperty("action")) {
                                var action = msg.payload.action ;
                                if (action === 'getChannelsValues'){getChannelsValues(device);}
                                if (action === 'setAllChannelsClosed'){setAllChannelsClosed(device);} 
                                if((action === 'setLockPod') && (msg.payload.hasOwnProperty("lock_pod"))){setLockPod(device,msg.payload);} 
                                if((action === 'setChannelsValues') && verifyOwnProperty(msg.payload)){setChannelsValues(device,msg.payload);}
                            }   
                        }
                    }
                }
            });

            var lenAnswer = 0; var answer = '';
            this.port.on('data', function(msg) {
                var splitc;
                if (node.serialConfig.newline.substr(0,2) == "0x")  splitc = new Buffer([parseInt(node.serialConfig.newline)]);
                else  splitc = new Buffer(node.serialConfig.newline.replace("\\n","\n").replace("\\r","\r").replace("\\t","\t").replace("\\e","\e").replace("\\f","\f").replace("\\0","\0")); // jshint ignore:line
                if ((node.serialConfig.newline === 0)||(node.serialConfig.newline === "")) {
                    if (node.serialConfig.bin !== "bin") { node.send({"payload": String.fromCharCode(msg), port:node.serialConfig.serialport}); }
                    else { node.send({"payload": new Buffer([msg]), port:node.serialConfig.serialport}); }
                }
                else {

                    if (node.serialConfig.out === "char") {
                        buf[i] = msg;
                        i += 1;
                        if ((msg === splitc[0]) || (i === bufMaxSize)) {
                            var n = new Buffer(i);
                            buf.copy(n,0,0,i);
                            if (node.serialConfig.bin !== "bin") { n = n.toString(); }
          
                            lenAnswer = lenAnswer + 1 ;
                            if(lenAnswer < len[order]) answer = answer + n ;
                            else {
                                                    node.warn("3");
                            var decodeLign = (answer+n).split("\n");
                                var id = 0 ;
                                var id_channel = 0 ;
                                if(compareDevice === 'CoolLed_pE4000'){
                                    for(id=0;id<decodeLign.length;id++){
                                        for(id_channel=0;id_channel<pE4000.nbChannels;id_channel++){
                                            if(decodeLign[id].substr(0,6)=='LAM:'+String.fromCharCode(65+id_channel)+':') pE4000.L[id_channel] = parseInt(decodeLign[id].substr(6,3));
                                            if(decodeLign[id].substr(0,3)=='CSS'){
                                                pE4000.I[id_channel] = parseInt(decodeLign[id].substr((id_channel+1)*6,3));
                                                pE4000.S[id_channel] = decodeLign[id].substr((id_channel+1)*6-1,1) =="N" ? 'ON' : 'OFF' ;
                                                //node.send({payload : pE4000});
                                           }
                                        }
                                    }
                                   // if((cmd[order] === 'CSS?'))
                                }
                                order = order + 1;
                                lenAnswer = 0 ;
                                answer = '' ;
                                if(order < cmd.length) { sendSimpleCommand(cmd[order]);}
                                else {
                                    node.send({"res" : res , "req": req, "payload":{'device':device, 'type':type, 'mode':mode, 'master':master, 'connected': ! node.port.error, 'La':pE4000.L[0],'Lb':pE4000.L[1],'Lc':pE4000.L[2],'Ld':pE4000.L[3],'Ia':pE4000.I[0],'Ib':pE4000.I[1],'Ic':pE4000.I[2],'Id':pE4000.I[3],'Sa':pE4000.S[0],'Sb':pE4000.S[1],'Sc':pE4000.S[2],'Sd':pE4000.S[3], 'auto_close' : pE4000.autoClose, 'lock_pod' : pE4000.lockPod}, port:node.serialConfig.serialport});
                                    if(action === 'setChannelsValues') {
                                        if(pE4000.autoClose > 0) {
                                            setTimeout(function(){
                                                setAllChannelsClosed(device);
                                                action = 'setAllChannelsClosed' ; 
                                                },pE4000.autoClose);
                                        }
                                        else {
                                            if(compareDevice === 'CoolLed_pE4000') {context.set("busypE4000","no");}
                                        }
                                    }
                                    else {
                                        if(compareDevice === 'CoolLed_pE4000') {context.set("busypE4000","no");}
                                    }
                                }
                            }
                            n = null;
                            i = 0;
                        }
                    }
                }
            });
           
            this.port.on('ready', function() {
                node.status({fill:"green",shape:"dot",text:"node-red:common.status.connected"});
            });
            this.port.on('closed', function() {
                node.status({fill:"red",shape:"ring",text:"node-red:common.status.not-connected"});
            });
        }
        else {
            this.error(RED._("serial.errors.missing-conf"));
        }

        
        this.on("close", function(done) {
           
            if (this.serialConfig) {
                serialPool.close(this.serialConfig.serialport,done);
            }
            else {
                done();
            }
        });    
    }
    RED.nodes.registerType("CoolLed",SerialNodeCoolLed);







    function SerialNodePriorScientific(n) {
    
        RED.nodes.createNode(this,n);
            this.serial = n.serial;
            this.serialConfig = RED.nodes.getNode(this.serial);
            
            if (this.serialConfig) {
                var node = this;
                node.tout = null;
                var buf;
                context = this .context().global ;
                if (node.serialConfig.out != "count") { buf = new Buffer(bufMaxSize); }
                else { buf = new Buffer(Number(node.serialConfig.newline)); }
                var i = 0;
                node.status({fill:"grey",shape:"dot",text:"node-red:common.status.not-connected"});
                node.port = serialPool.get(this.serialConfig.serialport,
                    this.serialConfig.serialbaud,
                    this.serialConfig.databits,
                    this.serialConfig.parity,
                    this.serialConfig.stopbits,
                    this.serialConfig.newline
                );
                
                
                var device  =  n.model;
                var type    = 'motion-stage';
                var mode    = "init";
                var action  = "getXYValues" ;
                var compareDevice = device;
                
                setTimeout(function(){
                    if(node.port.error)
                        node.send({payload:{
                            'device'    : device,
                            'type'      : type,
                            'mode'      : mode,
                            'action'    : action,
                            'master'    : master,
                            'function'  : ['setXYValues','getXYValues'],
                            'connected' : ! node.port.error
                        }});
                        else {getXYValues(device) ; node.log(device+':getXYValues');}              
                },3000);
    
                if(compareDevice === 'PriorScientific_V31XYZE'){
                   var v31XYZE = {
                       'X' : 100,
                       'Y' : 100,
                       'getXYValues' : [['PX','PY'],[1,1],0],
                       'setGRValues' : ['GR',1,0], 
                       'setGValues' :  ['G',1,0], 
                       'validGR' : [-5000,-2000,-1000,0,1000,2000,5000], //values
                       'validG' : [-50000,50000] //limit
                   };
                   context.set("busyV31XYZE","no");
               }
               var req ; var res ; var cmd ; var len ; var order ; var control = 1 ; var xControl ; var yControl ;
               
                function getXYValues(device){
                    if(compareDevice === 'PriorScientific_V31XYZE'){
                        context.set("busyV31XYZE","yes");
                        action = 'getXYValues' ;
                        control = 0 ;
                        cmd   = v31XYZE.getXYValues[0] ;
                        len   = v31XYZE.getXYValues[1] ;
                        order = v31XYZE.getXYValues[2] ;
                        sendSimpleCommand(cmd[order]);
                     }
                }
                function setGRValues(device,payload){
                    if(compareDevice === 'PriorScientific_V31XYZE'){
                        context.set("busyV31XYZE","yes");
                        action = 'setGRValues' ;
                        control = 1 ; xControl = v31XYZE.X+parseInt(payload.X) ; yControl = v31XYZE.Y+parseInt(payload.Y) ;
                        cmd = [] ; len = [];
                        cmd.push(v31XYZE.setGRValues[0]+','+payload.X+','+payload.Y) ;
                        len.push(v31XYZE.setGRValues[1]) ;
                        order = v31XYZE.setGRValues[2] ;
                        for(var j=0 ; j<v31XYZE.getXYValues[0].length;j++){
                            cmd.push(v31XYZE.getXYValues[0][j]) ;
                            len.push(v31XYZE.getXYValues[1][j]) ;
                        }
                        sendSimpleCommand(cmd[order]);
                     }
                }
                function setGValues(device,payload){
                    if(compareDevice === 'PriorScientific_V31XYZE'){
                        context.set("busyV31XYZE","yes");
                        action = 'setGValues' ;
                        control = 1 ; xControl = payload.X ; yControl = payload.Y ;
                        cmd = [] ; len = [];
                        cmd.push(v31XYZE.setGValues[0]+','+payload.X+','+payload.Y) ;
                        len.push(v31XYZE.setGValues[1]) ;
                        order = v31XYZE.setGValues[2] ;
                        for(var j=0 ; j<v31XYZE.getXYValues[0].length;j++){
                            cmd.push(v31XYZE.getXYValues[0][j]) ;
                            len.push(v31XYZE.getXYValues[1][j]) ;
                        }
                        sendSimpleCommand(cmd[order]);
                     }
                }
                
                function sendSimpleCommand(cmd){
                    var payload = cmd ;
                    node.addCh = "";
                    if (node.serialConfig.newline.substr(0,2) == "0x") node.addCh = new Buffer([parseInt(node.serialConfig.newline)]);
                    else node.addCh = new Buffer(node.serialConfig.newline.replace("\\n","\n").replace("\\r","\r").replace("\\t","\t").replace("\\e","\e").replace("\\f","\f").replace("\\0","\0")); // jshint ignore:line                
                    if (!Buffer.isBuffer(payload)) {
                        if (typeof payload === "object") payload = JSON.stringify(payload);
                        else payload = payload.toString();
                        if ((node.serialConfig.out === "char") && (node.serialConfig.addchar === true)) { payload += node.addCh;}
                    } else if ((node.serialConfig.out === "char") && (node.serialConfig.addchar === true) && (node.addCh !== "")) payload = Buffer.concat([payload,node.addCh]);                  
                    node.port.write(payload,function(err,res) {
                    if (err) {
                            var errmsg = err.toString().replace("Serialport","Serialport "+node.port.serial.path);
                            node.error(errmsg,msg);
                        }
                    });
                }
                
                node.on("input",function(msg) {
                    if ((context.get("busyV31XYZE")||"yes") === "no"){    
                        if (msg.hasOwnProperty("payload")) {
                                if((msg.payload.hasOwnProperty("device"))&&(msg.payload.device === device)){
                                if (msg.hasOwnProperty("res")) res = msg.res ;
                                if (msg.hasOwnProperty("req")) req = msg.req ;
                                if (msg.payload.hasOwnProperty("mode")) mode = msg.payload.mode ;
                                else mode = '' ;
                                if (msg.payload.hasOwnProperty("action")) {
                                    var action = msg.payload.action ;
                                    if (action === 'getXYValues'){getXYValues(device);}
                                    if ((action === 'setGRValues')&&(true)){ setGRValues(device,msg.payload);} //modifier true par fonction verify own properties
                                    if ((action === 'setGValues')&&(true)){ setGValues(device,msg.payload);} //modifier true par fonction verify own properties
                                }   
                            }
                        }
                    }
                });
    
                var lenAnswer = 0; var answer = '';           
                this.port.on('data', function(msg) {
                    var splitc; 
                    if (node.serialConfig.newline.substr(0,2) == "0x")  splitc = new Buffer([parseInt(node.serialConfig.newline)]);
                    else  splitc = new Buffer(node.serialConfig.newline.replace("\\n","\n").replace("\\r","\r").replace("\\t","\t").replace("\\e","\e").replace("\\f","\f").replace("\\0","\0")); // jshint ignore:line
                    if ((node.serialConfig.newline === 0)||(node.serialConfig.newline === "")) {
                        if (node.serialConfig.bin !== "bin") { node.send({"payload": String.fromCharCode(msg), port:node.serialConfig.serialport}); }
                        else { node.send({"payload": new Buffer([msg]), port:node.serialConfig.serialport}); }
                    }
                    else {
                        if (node.serialConfig.out === "char") {
                            buf[i] = msg;
                            i += 1;
                            if ((msg === splitc[0]) || (i === bufMaxSize)) {
                                var n = new Buffer(i);
                                buf.copy(n,0,0,i);
                                if (node.serialConfig.bin !== "bin") { n = n.toString(); }
              
                                lenAnswer = lenAnswer + 1 ;
                                if(lenAnswer < len[order]) answer = answer + n ;
                                else {
                                    if(compareDevice === 'PriorScientific_V31XYZE'){
                                       if(cmd[order] === 'PY') {
                                            v31XYZE.Y = parseInt((answer+n).substr(0,((answer+n)).length-1));
                                            if((Math.abs(v31XYZE.Y-yControl)>2)&&(control ===1)){cmd.push('PY'); len.push(1);}//control
                                            else {if(control===1) v31XYZE.Y = yControl;}
                                         }
                                        
                                        if(cmd[order] === 'PX') {
                                            v31XYZE.X = parseInt((answer+n).substr(0,(answer+n).length-1));
                                            if((Math.abs(v31XYZE.X-xControl)>2)&&(control ===1)){cmd.push('PX');  len.push(1);}//control
                                            else {if(control===1) v31XYZE.X = xControl ;}
                                        }
                                    }                                   
                                    order = order + 1;
                                    lenAnswer = 0 ;
                                    answer = '' ;
                                    if(order < cmd.length) { sendSimpleCommand(cmd[order]);}
                                    else {
                                        node.send({"res" : res , "req": req, "payload":{'device':device, 'type':type, 'mode':mode, 'master':master, 'connected': ! node.port.error, 'X':v31XYZE.X, 'Y':v31XYZE.Y}, port:node.serialConfig.serialport});     
                                        context.set("busyV31XYZE","no");
                                    }
                                }
                                n = null;
                                i = 0;
                            }
                        }
                    }
                });
               
                               
                this.port.on('ready', function() {
                    node.status({fill:"green",shape:"dot",text:"node-red:common.status.connected"});
                });
                this.port.on('closed', function() {
                    node.status({fill:"red",shape:"ring",text:"node-red:common.status.not-connected"});
                });
            }
            else {
                this.error(RED._("serial.errors.missing-conf"));
            }
    
            this.on("close", function(done) {
                if (this.serialConfig) {
                    serialPool.close(this.serialConfig.serialport,done);
                }
                else {
                    done();
                }
            });
        }
    
    RED.nodes.registerType("PriorScientific",SerialNodePriorScientific);

    function SerialNodeOlympus(n) {
        RED.nodes.createNode(this,n);
            var node = this;
            setTimeout(function(){
                node.send({payload:{
                    'device'    : 'Olympus_IX81',
                    'type'      : 'light-source',
                    'mode'      : 'init',
                    'connected' : true
                }});
            },1200);
            node.on("input",function(msg) {
                msg = '' ;
            node.send({'payload' : 'TEST'});
            });    
        }
    
    RED.nodes.registerType("Olympus",SerialNodeOlympus);

    function SerialNodeLumenDynamics(n) {
        RED.nodes.createNode(this,n);
            var node = this;
            setTimeout(function(){
                node.send({payload:{
                    'device'    : 'X_Cite_120PC_mosaic',
                    'type'      : 'light-source',
                    'mode'      : 'init',
                    'connected' : true
                }});
            },2000);
            node.on("input",function(msg) {
                msg = '' ;
                node.send({'payload' : 'TEST'});
            });
                
        }
    
    RED.nodes.registerType("LumenDynamics",SerialNodeLumenDynamics);

    var serialPool = (function() {
        //RED.nodes.createNode(this,n);
        var connections = {};
        return {
            get:function(port,baud,databits,parity,stopbits,newline,callback) {
                var id = port;
                if (!connections[id]) {
                    connections[id] = (function() {
                        var obj = {
                            _emitter: new events.EventEmitter(),
                            serial: null,
                            _closing: false,
                            tout: null,
                            on: function(a,b) { this._emitter.on(a,b); },
                            close: function(cb) { this.serial.close(cb); },
                            write: function(m,cb) { this.serial.write(m,cb); },
                            error : null,
                            change : null
                            }
                        //newline = newline.replace("\\n","\n").replace("\\r","\r");
                        var olderr = "";
                        var setupSerial = function() {
                            obj.serial = new serialp(port,{
                                baudRate: baud,
                                dataBits: databits,
                                parity: parity,
                                stopBits: stopbits,
                                //parser: serialp.parsers.raw,
                                autoOpen: true
                            }, function(err, results) {
                                if (err) {
                                    if (err.toString() !== olderr) {
                                        olderr = err.toString();
                                        RED.log.error(RED._("serial.errors.error",{port:port,error:olderr}));
                                        obj.error = true ;
                                    }
                                    obj.tout = setTimeout(function() {
                                        setupSerial();
                                    }, settings.serialReconnectTime);
                                }
                                });
                            obj.serial.on('error', function(err) {
                                RED.log.error(RED._("serial.errors.error",{port:port,error:err.toString()}));
                                obj._emitter.emit('closed');
                                obj.error = true ;
                                obj.tout = setTimeout(function() {
                                    setupSerial();
                                }, settings.serialReconnectTime);
                            });
                            obj.serial.on('close', function() {
                                if (!obj._closing) {
                                    RED.log.error(RED._("serial.errors.unexpected-close",{port:port}));
                                    obj._emitter.emit('closed');
                                    obj.tout = setTimeout(function() {
                                        setupSerial();
                                    }, settings.serialReconnectTime);
                                }
                                /*if(obj.change) {
                                    setTimeout(function(){
                                    /*obj.serial = new serialp('COM5',{
                                        baudRate: 57600,
                                        dataBits: 8,
                                        parity: 'none',
                                        stopBits: 1,
                                        //parser: serialp.parsers.raw,
                                        autoOpen: true
                                        }, function(err, results) {
                                            console.log(err+','+results);
                                        });*/
                               /*      setupSerial();
                                    },5000);
                                
                                    }*/
                            });
                            obj.serial.on('open',function() {
                                olderr = "";
                                RED.log.info(RED._("serial.onopen",{port:port,baud:baud,config: databits+""+parity.charAt(0).toUpperCase()+stopbits}));
                                obj.error = false ;
                                if (obj.tout) { clearTimeout(obj.tout); }
                                //obj.serial.flush();
                                obj._emitter.emit('ready');
                            });
                            obj.serial.on('data',function(d) {
                                console.log('EEE'+d);
                                for (var z=0; z<d.length; z++) {
                                    obj._emitter.emit('data',d[z]);
                                }
                            });
                            //console.log(obj);
                            // obj.serial.on("disconnect",function() {
                            //     RED.log.error(RED._("serial.errors.disconnected",{port:port}));
                            // });
                        }
                        setupSerial();
                        return obj;
                    }());
                }
                console.log(connections[id]);
                return connections[id];
            },
            close: function(port,done) {
                if (connections[port]) {
                    if (connections[port].tout != null) {
                        clearTimeout(connections[port].tout);
                    }
                    connections[port]._closing = true;
                    try {
                        connections[port].close(function() {
                            RED.log.info(RED._("serial.errors.closed",{port:port}));
                            done();
                        });
                    }
                    catch(err) { }
                    delete connections[port];
                }
                else {
                    done();
                }
            }
        }
    }());
    
    RED.httpAdmin.get("/serialports", RED.auth.needsPermission('serial.read'), function(req,res) {
        serialp.list(function (err, ports) {
            res.json(ports);
        });
    });
}
