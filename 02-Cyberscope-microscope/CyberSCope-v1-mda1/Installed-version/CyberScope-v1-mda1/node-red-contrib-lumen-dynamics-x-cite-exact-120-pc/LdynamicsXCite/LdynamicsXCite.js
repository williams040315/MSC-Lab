module.exports = function(RED) {
    "use strict";
    function LdynamicsXCiteNode(config) {      
        RED.nodes.createNode(this,config);
        
        var node = this;                
        var myPort ;

        var serialport = require('serialport');
        
        var topic   = "Fluorescence2";
        var device  = 'X-Cite-120PC';
        var type    = 'ligth-source';
        var mode    = "init" ;
        var action  = "set" ;
        
        var intensity = 10 ;
        var shutter = false;
         var timeout = -1 ;
        var keep = -1;
        
       var config = {
            "A" : ["Intensity: <input required name='%A0' id='%A0' type='number' min='0' max='100' step='1'/>","Shutter: <select required name='%A1' id='%A1'><option value=ON>ON</option><option value=OFF>OFF</option></select>"],
            "B" : ["<br>Color mapping: <input required name='%B0' id='%B0' type='color'>"]
        };
        
        node.status({fill:"yellow",shape:"dot",text:"busy ..."});
        myPort = new serialport("COM22",{baudRate: 9600,databits: 8,parity: 'none',stopbits: 1,flowControl: false});
        
        var cmd = ['tt','jj','cc','gg','d010'];
        //var cmd = ['1LOG OUT'];
        
        //var control = 0 ;
        var order = 0;
        var nodeSend = 1 ;
        sendSimpleCommand(cmd[order]);
        
        function sendSimpleCommand(cmd){
            myPort.write(cmd);
            myPort.write(new Buffer([parseInt('0x0d')]));
        }
        
   
        var answer = "";
        
        myPort.on('data', function (data) {
            answer = answer + data.toString('utf8') ;
            console.log(device+'>Request:'+cmd[order]+","+answer.substr(0,answer.length-2));
            if(data[data.byteLength-1] === 13){
                order = order + 1;
                if(order < cmd.length){
                    sendSimpleCommand(cmd[order]);
                }
                else {                    
                    if ((nodeSend === 1)){
                        nodeSend = 0;
                        var msg = {};
                        msg.payload = 'done' ; msg.topic = topic; msg.device = device; msg.type = type ; msg.mode = mode ; msg.action = action ;
                        msg.update = {'A' : {}} ;
                        msg.update['A'] = {"intensity" : intensity, "shutter" : shutter };
                        msg.status = {"state" : "SUCCESS", "date" : Date.now()}
                        msg.config = config ;
                        node.send(msg);
                        node.status({fill:"green",shape:"dot",text:"ready ..."});
                        }
                    }
                   answer = '';
               
                }
            }
        });
        
        this.on('input', function (msg) {            
             if( true ){
            //if( context.get("availablePriorProScan") === "yes" ){
                //context.set("availablePriorProScan","no");
                if((msg.device === device)&&(msg.topic === topic)){
                    node.status({fill:"blue",shape:"dot",text:"busy"});
                    /*if(msg.action === 'setChannel'){
                        cmd = [];
                        var cmd_intensity = '' ;
                        var cmd_shutter = '' ;
                        intensity = parseInt(msg.update['intensity']) ;
                        if( parseInt(msg.update['intensity']) < 100 ) {
                            cmd_intensity = 'd0' + msg.update['intensity'];
                        }
                        else cmd_intensity = 'd'+ msg.update['intensity'] ;
                        
                        cmd_shutter = msg.update['shutter'] == true ? "mm" : "zz"  ;
                        shutter = msg.update['shutter'] ;
                        //cmd.push('d'+str_intensity);
                        cmd.push(cmd_intensity);
                        cmd.push(cmd_shutter);
                    }
                    mode = msg.mode ;
                    action = msg.action; 
                    order = 0;
                    nodeSend = 1 ;
                    sendSimpleCommand(cmd[order]);*/
                     
                }
            }
            
        });
    }
    RED.nodes.registerType("EXACT",LdynamicsXCiteNode);
}