module.exports = function(RED) {
    "use strict";
    function PriorProScanNode(config) {
        RED.nodes.createNode(this,config);
            
        var node = this;                
        var myPort ;
        //var scan = true ;
        //var portName = '' ;
        var serialport = require('serialport');
        var context = this.context().global ;
        
        var topic   = "MotionStage1";
        var device  = 'PRIOR-PRO-SCAN';
        var type    = 'motion';
        var mode    = "init" ;
        var action  = "get" ;
       
        /*serialport.list(function (err, ports) {
            ports.forEach(function(port) {
                if(scan == true){
                    scan = false ;
                    portName = ports.ename ;
                }
          });
        });*/
        
        myPort = new serialport("COM3",{baudRate: 9600,databits: 8,parity: 'none',stopbits: 1,flowControl: false});
//        var cmd = ['PORT:P=ON','CSF','CAX','LOAD:435','CAS','CBX','LOAD:490','CBS','CCX','LOAD:525','CCS','CDX','LOAD:635','CDS','CSN','CSS?','PORT:P=OFF'];
        var cmd = ['PX','PY'];
        var control = 0 ;
        var order = 0;
        var nodeSend = 1 ;
        sendSimpleCommand(cmd[order]);
        
        function sendSimpleCommand(cmd){
            myPort.write(cmd);
            myPort.write(new Buffer([parseInt('0x0d')]));
        }
        
        var answer = "";
        
        var xPositionControl = -1 ;
        var yPositionControl = -1 ;
        
        var xPosition = '';
        var yPosition = '';
        var moveType = "";
        
        myPort.on('data', function (data) {
            
            answer = answer + data.toString('utf8') ;
            if(data[data.byteLength-1] === 13){
                if(cmd[order] === 'PY') {
                    yPosition = parseInt(answer.substr(0,answer.length-1));
                    if((Math.abs(yPosition-yPositionControl)>2)&&(control ===1)){cmd.push('PY');}//control
                    else {if(control===1) yPosition = yPositionControl ; yPositionControl = -1 ;}
                }
                
                if(cmd[order] === 'PX') {
                    xPosition = parseInt(answer.substr(0,answer.length-1));
                    if((Math.abs(xPosition-xPositionControl)>2)&&(control ===1)){cmd.push('PX');}//control
                    else {if(control===1) xPosition = xPositionControl ; xPositionControl = -1 ;}
                }
                console.log(device+'>Request:'+cmd[order]+","+answer.substr(0,answer.length-2));
                
                if((xPositionControl === -1) && (yPositionControl === -1)) nodeSend = 1 ;
                
                order = order + 1;
                if(order < cmd.length){
                    sendSimpleCommand(cmd[order]);
                }
                else {                    
                    if ((nodeSend === 1)){
                        nodeSend = 0;
                        var msg = {};
                        msg.payload = 'done' ; msg.topic = topic; msg.device = device; msg.type = type ; msg.mode = mode ; msg.action = action ;
                        msg.update = {} ;
                        //msg.update['xPosition'] = parseFloat(xPosition/50); msg.update['yPosition'] = parseFloat(yPosition/50);
                        msg.status = {"state" : "SUCCESS", "date" : Date.now()}
                        msg.update['xPosition'] = xPosition; msg.update['yPosition'] = yPosition;
                        node.send(msg);
                        //context.set("availablePriorProScan","yes");
                        node.status({fill:"green",shape:"dot",text:"ready ..."});
                        }
                    }
                    
                   answer = '';
                   
                   
            }
        });
        
        node.on("input",function(msg) {
            //node.warn(msg);
            //node.warn(context.get("availablePriorProScan"));
            if( true ){
            //if( context.get("availablePriorProScan") === "yes" ){
                //context.set("availablePriorProScan","no");
                if((msg.device === device)&&(msg.topic === topic)){
                    node.status({fill:"blue",shape:"dot",text:"busy"});
                    if(msg.action === 'set'){
                        if(msg.update['moveType'] === 'GR'){
                            control = 0 ;
                            cmd = [];
                            cmd.push('GR,'+parseInt(50*msg.update['xPosition'])+','+parseInt(50*msg.update['yPosition']));
                            
                        }
                        if(msg.update['moveType'] === 'G'){
                            control = 1 ;
                            cmd = [];
                            cmd.push('G,'+parseInt(msg.update['xPosition'])+','+parseInt(msg.update['yPosition']));
                            xPositionControl = parseInt(msg.update['xPosition']);
                            yPositionControl = parseInt(msg.update['yPosition']);   
                        }
                    }
                    if(msg.action === 'get'){
                        control = 0 ;
                        cmd = [];
                    }                    
                    cmd.push('PX','PY');
                    mode = msg.mode ;
                    action = msg.action; 
                    order = 0;
                    nodeSend = 0 ;
                    sendSimpleCommand(cmd[order]);
                     
                }
            }
            
            
            
            //node.warn(msg.device+" "+this.device);
            if((msg.device === this.device)&&(msg.topic === this.topic)){
                node.status({fill:"blue",shape:"dot",text:"busy"});
                setTimeout(function(){
                    msg.payload = "done";
                    msg.update ={"x" : 2000, "Y": 4000};
                    msg.status = {"SUCCESS" : Date.now()};
                    node.send(msg);
                    node.status({fill:"green",shape:"dot",text:"ready ..."});
                },2500);
            }
        });
        node.on('close', function() {
          return;
        });
    }
    RED.nodes.registerType("PriorProScan",PriorProScanNode);
}