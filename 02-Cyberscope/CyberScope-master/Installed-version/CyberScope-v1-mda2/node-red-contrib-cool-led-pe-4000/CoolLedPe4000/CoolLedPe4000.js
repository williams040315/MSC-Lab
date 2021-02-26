//mettre variable global pour verrouiller
//regarder le mode init, .....
//X-CITE

module.exports = function(RED) {
    "use strict";
    function CoolLedPe4000Node(config) {      
        RED.nodes.createNode(this,config);
        
        var node = this;                
        var myPort ;
        //var scan = true ;
        //var portName = '' ;
        var serialport = require('serialport');
        var context = this.context().global ;
        
        var topic   = "Fluorescence1";
        var device  = 'CoolLed-PE4000';
        var type    = 'ligth-source';
        var mode    = "init" ;
        var action  = "set" ;
        
        var config =  {
            "A" : ["LambdaA: <select required name='%A0' id='%A0'><option value=365>365</option><option value=385>385</option><option value=405>405</option><option value=435>435</option></select>","IntensityA: <input required name='%A1' id='%A1' type='number' min='0' max='100' step='1'/>","ShutterA: <select required name='%A2' id='%A2'><option value=ON>ON</option><option value=OFF>OFF</option></select>"],
            "B" : ["LambdaB: <select required name='%B0' id='%B0'><option value=460>460</option><option value=470>470</option><option value=490>490</option><option value=500>500</option></select>","IntensityB: <input required name='%B1' id='%B1' type='number' min='0' max='100' step='1'/>","ShutterB: <select required name='%B2' id='%B2'><option value=ON>ON</option><option value=OFF>OFF</option></select>"],
            "C" : ["LambdaC: <select required name='%C0' id='%C0'><option value=525>525</option><option value=550>550</option><option value=320>580</option><option value=595>595</option></select>","IntensityC: <input required name='%C1' id='%C1' type='number' min='0' max='100' step='1'/>","ShutterC: <select required name='%C2' id='%C2'><option value=ON>ON</option><option value=OFF>OFF</option></select>"],
            "D" : ["LambdaD: <select required name='%D0' id='%D0'><option value=635>635</option><option value=660>660</option><option value=740>740</option><option value=770>770</option></select>","IntensityD: <input required name='%D1' id='%D1' type='number' min='0' max='100' step='1'/>","ShutterD: <select required name='%D2' id='%D2'><option value=ON>ON</option><option value=OFF>OFF</option></select>"],
            "E" : ["<br>Color mapping: <input required name='%E0' id='%E0' type='color'>"],
            "F" : ["<br>Wheel Filter: <input required name='%F0' id='%F0' type='number' min='1' max='6' step='1'>"]
        };

        /*serialport.list(function (err, ports) {
            ports.forEach(function(port) {
                if(scan == true){
                    scan = false ;
                    portName = ports.ename ;
                }
          });
        });*/
        
        myPort = new serialport("COM5",{baudRate: 38400,databits: 8,parity: 'none',stopbits: 1,timeout: 0.1,flowControl: false});
//        var cmd = ['PORT:P=ON','CSF','CAX','LOAD:435','CAS','CBX','LOAD:490','CBS','CCX','LOAD:525','CCS','CDX','LOAD:635','CDS','CSN','CSS?','PORT:P=OFF'];
        var cmd = ['LAMS','CSS?'];
        var order = 0;
        var nodeSend = 1 ;
        sendSimpleCommand(cmd[order]);
        
        function sendSimpleCommand(cmd){
            myPort.write(cmd+'\n');
        }
        
        var lambda = [0,0,0,0] ;
        var intensity = [0,0,0,0] ;
        var shutter = [0,0,0,0] ;
        var loaded = [0,0,0,0];
        var answer = "";
        var timeout = -1 ;
        var keep = -1;
        
        myPort.on('data', function (data) {
            answer = answer + data.toString('utf8') ;
            node.status({fill:"yellow",shape:"dot",text:"busy ..."});
            order = order + 1;
            if(order < cmd.length) sendSimpleCommand(cmd[order]);
            else {
                console.log(device+'>Request:',data);
                order = 0 ;
                var decodeLign = answer.split("\n");
                var id = 0 ;
                var id_channel = 0 ;
                var channel = ['A','B','C','D'];
                for(id=0;id<decodeLign.length;id++){
                    for(id_channel=0;id_channel<channel.length;id_channel++){
                        if(decodeLign[id].substr(0,6)=='LAM:'+channel[id_channel]+':') lambda[id_channel] = parseInt(decodeLign[id].substr(6,3));
                        if(decodeLign[id].substr(0,3)=='CSS'){
                            intensity[id_channel] = parseInt(decodeLign[id].substr((id_channel+1)*6,3));
                            shutter[id_channel] = decodeLign[id].substr((id_channel+1)*6-1,1) =="N" ? true : false ; 
                            loaded[id_channel] = (decodeLign[id].substr((id_channel+1)*6-2,1));  
                       }
                    }
                }
                if (nodeSend == 1){
                    nodeSend = 0;
                    var msg = {};
                    msg.payload = 'done' ;  msg.topic = topic; msg.device = device; msg.type = type ; msg.mode = mode ; msg.action = action ;
                    msg.update = {} ;
                    msg.update['A'] = [lambda[0], intensity[0], shutter[0]]; msg.update['B'] = [lambda[1], intensity[1], shutter[1]]; msg.update['C'] = [lambda[2], intensity[2], shutter[2]]; msg.update['D'] = [lambda[3], intensity[3], shutter[3]]; msg.update['E'] = ['#808080']; msg.update['F'] = [1]; msg.status = {"state" : "SUCCESS", "date" : Date.now()}
                    msg.config = config ;
                    node.send(msg);
                    //context.set("availableCoolLedPe4000","yes");
                }
                //node.warn(timeout);
               
                node.status({fill:"green",shape:"dot",text:"ready ..."});
                answer = '';
                if(timeout > 0){
                    setTimeout(function(){
                        if(keep === false){
                            cmd = ['CAX','CBX','CCX','CDX'];
                            sendSimpleCommand(cmd[order]);
                        }
                        else {cmd = ['CSS?'];sendSimpleCommand(cmd[order]);}
                        nodeSend = 1 ;
                    },timeout);
                    timeout = -1 ;
                }
            }
        });
        
        myPort.on("open", function () {
        });
        myPort.on('error', function(err) {
            console.log('Error: ', err.message);
        });
        myPort.on('close', function (err) {
            console.log('port closed', err);
        });
 
        var id_channel = 0 ;
        var channel = ['A','B','C','D'];
        var cmd_CxI = ['CAI','CBI','CCI','CDI'];
        var cmd_CxS = ['CAS','CBS','CCS','CDS'];
        var cmd_CxX = ['CAX','CBX','CCX','CDX'];
        
        this.on('input', function (msg) {            
            //node.warn(msg);
            //timeout = -1 ;
            if( true ){
            //if( context.get("availableCoolLedPe4000") === "yes" ){
                //context.set("availableCoolLedPe4000","no");
                if((msg.device === device)&&(msg.topic === topic)){
                    node.status({fill:"yellow",shape:"dot",text:"busy ..."});
                    if(msg.action === 'set'){    
                        //order = 0 ;
                        cmd = [];
                        cmd.push('CSF');
                        for(id_channel=0;id_channel<channel.length;id_channel++){
                            if ((msg.update[channel[id_channel]][2]==true)){
                                cmd.push('LOAD:'+msg.update[channel[id_channel]][0]);
                                cmd.push(cmd_CxS[id_channel]);
                                cmd.push(cmd_CxI[id_channel]+msg.update[channel[id_channel]][1]);
                            }
                            else {
                                cmd.push(cmd_CxX[id_channel]);
                                cmd.push('LOAD:'+msg.update[channel[id_channel]][0]);
                                cmd.push(cmd_CxI[id_channel]+msg.update[channel[id_channel]][1]);
                            }
                        }
                        cmd.push('CSN');                
                        cmd.push('LAMS');
                        cmd.push('CSS?');
                        
                  }
                    if(msg.action === 'setChannel'){    
                        //order = 0 ;
                        nodeSend = 1 ;
                        cmd = [];
                        //cmd.push('CSF'); //décharge tous
                        for(id_channel=0;id_channel<channel.length;id_channel++){
                            if ((msg.update[channel[id_channel]][2]==true)&&(shutter[id_channel]==false)){
                                cmd.push('C'+channel[id_channel]+'F');
                                cmd.push('LOAD:'+msg.update[channel[id_channel]][0]);
                                cmd.push(cmd_CxS[id_channel]);
                                cmd.push(cmd_CxI[id_channel]+msg.update[channel[id_channel]][1]);
                            }
                            if (msg.update[channel[id_channel]][2]==false){
                                cmd.push(cmd_CxX[id_channel]);
                                cmd.push('LOAD:'+msg.update[channel[id_channel]][0]);
                                cmd.push(cmd_CxI[id_channel]+msg.update[channel[id_channel]][1]);
                            }
                        }
                        cmd.push('CSN');  //charge tous               
                        cmd.push('LAMS');
                        cmd.push('CSS?');
                        
//                        var timeout = -1;
                        if(parseInt(msg.update['timeout']) !==-1) timeout = parseInt(msg.update['timeout']);
                        keep = (msg.update['keep']);
                    }
                    
                    if(msg.action === 'get'){
                        cmd = ['LAMS','CSS?'];
                        nodeSend = 1 ;
                        sendSimpleCommand(cmd[order]);
                    }
                    if(msg.action === 'setOFF'){
                        cmd = ['CAX','CBX','CCX','CDX'];
                        for(var i=0;i<4;i++) shutter[i] = false ;
                        nodeSend = 1 ;
                        sendSimpleCommand(cmd[order]);
                    }
                    try {
                        mode = msg.mode ;
                        action = msg.action; 
                        order = 0;
                        //if(timeout === -1)
                        nodeSend = 1 ;
                        //else nodeSend = 0 ;
                        sendSimpleCommand(cmd[order]);
                    }
                    catch(error){
                        var msg = {};
                        msg.topic = topic; msg.device = device; msg.type = type ; msg.mode = mode ; msg.action = action ;
                        msg.update = {} ;
                        msg.update['A'] = [lambda[0], intensity[0], shutter[0]]; msg.update['B'] = [lambda[1], intensity[1], shutter[1]]; msg.update['C'] = [lambda[2], intensity[2], shutter[2]]; msg.update['D'] = [lambda[3], intensity[3], shutter[3]]; msg.status = {"state" : "SUCCESS", "date" : Date.now()}
                        msg.config = config ;
                        node.send(msg);
                        context.set("availableCoolLedPe4000","yes");
                        node.status({fill:"green",shape:"dot",text:"ready ..."});
                    }
                    //node.status({fill:"green",shape:"dot",text:"ready ..."});
               }
            }
        });
        this.on('close', function(done, myPort) {
            myPort.close();
            return ;
        });
    }
    RED.nodes.registerType("CoolLedPe4000",CoolLedPe4000Node);
}