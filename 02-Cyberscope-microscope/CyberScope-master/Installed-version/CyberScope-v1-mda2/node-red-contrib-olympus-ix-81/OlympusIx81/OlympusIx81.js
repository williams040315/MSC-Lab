module.exports = function(RED) {
    "use strict";
    function OlympusIx81Node(config) {
        RED.nodes.createNode(this,config);
        
        var node = this;                
        var myPort ;
        
        var serialport = require('serialport');
        var context = this.context().global ;
        
        
        var topic = "Microscope1";
        var device = 'OLYMPUS-IX-81';
        var type = 'ligth-source';
        var mode = "init" ;
        var action  = "set" ;
        
        var config =  {
            "A" : ["Intensity: <input required name='%A0' id='%A0' type='number' min='0' max='12' step='0.1'/>"],
            "B" : ["<br>Color mapping: <input required name='%B0' id='%B0' type='color'>"],
            "C" : ["<br>Wheel Filter: <input required name='%C0' id='%C0' type='number' min='1' max='6' step='1'>"]
       };

        var wheelFilter = "" ;
        var shutter = "";
        var intensity = "";
        var lamp = "" ;
        var zPosition = "";
        var farLmt = "";
        var nearLmt = "";
        var affLmt = "" ;
        var afnLmt = "" ;
        var aftbl = "" ; // objective UPlanAPO 20x
        var offset = 0 ;
        var timeout = -1 ;
        var keep = false ;
        
        /*serialport.list(function (err, ports) {
            ports.forEach(function(port) {
                if(scan == true){
                    scan = false ;
                    portName = ports.ename ;
                }
          });
        });*/
        node.status({fill:"yellow",shape:"dot",text:"busy ..."});
        myPort = new serialport("COM1",{baudRate: 19200,databits: 8,parity: 'even',stopbits: 1,flowControl: false});
        var cmd2 = [];
        var cmd = ['1LOG IN','1MU 1','1MU?','1SHUT1 IN','1SHUT1?','1LMPSW ON','1LMPSW?','1LMP 12','1LMP?','1LOG OUT','2LOG IN','2FARLMT 1','2FARLMT?','2NEARLMT 3000000','2NEARLMT?','2AFFLMT?','2AFNLMT?','2AFTBL 36','2AFTBL?','2LOG OUT','2POS?'];
        //var cmd = ['1LOG OUT'];
        
        var control = 0 ;
        var order = 0;
        var nodeSend = 1 ;
        sendSimpleCommand(cmd[order]);
        
        function sendSimpleCommand(cmd){
            myPort.write(cmd);
            myPort.write(new Buffer([parseInt('0x0d')]));
            myPort.write('\n');
        }
        
        var answer = "";
        var autofocus = "NOT USED";
        var wheelFilterControl = -1 ;
        var shutterControl = -1 ;
        var zPositionControl = -1 ;
        
        myPort.on('data', function (data) {
            
            answer = answer + data.toString('utf8') ;
            var stop = 0 ;
            if(data[data.byteLength-1] === 10){
                if(cmd[order] === '1MU?') {
                    wheelFilter = parseInt(answer.substr(4,1));
                    //node.warn(wheelFilter+","+wheelFilterControl);
                    if(wheelFilterControl !==-1){
                        if((wheelFilter !== wheelFilterControl)&&(control ===1)){
                            stop = stop + 1;
                            cmd.push('1LOG IN');
                            cmd.push('1MU?');
                            cmd.push('1LOG OUT');
                            if(stop===5) {wheelFilterControl = -1 ; stop = 0 ;}
                            }//control
                        else {wheelFilterControl = -1 ;}
                    } else wheelFilterControl = -1 ;
                }
                if(cmd[order] === '1SHUT1?') {
                    shutter = answer.substr(cmd[order].length,2) === 'IN' ? false : true;
                    if(shutterControl !==-1){
                       if((shutter !== shutterControl)&&(control ===1)){cmd.push('1LOG IN'); cmd.push('1SHUT?'); cmd.push('1LOG OUT');} //control
                        else {shutterControl = -1 ;}
                    }
                }
                if(cmd[order] === '1LMPSW?') { lamp = answer.substr(cmd[order].length,2) === 'OF' ? false : true;}
                if(cmd[order] === '1LMP?') { intensity = parseFloat(answer.substr(cmd[order].length,answer.length-cmd[order].length)/10); }
                if(cmd[order] === '2FARLMT?') { farLmt = parseInt(answer.substr(cmd[order].length,answer.length-cmd[order].length)); }
                if(cmd[order] === '2NEARLMT?') { nearLmt = parseInt(answer.substr(cmd[order].length,answer.length-cmd[order].length)); }
                if(cmd[order] === '2AFFLMT?') { affLmt = answer.substr(cmd[order].length,1) !== 'X' ?  parseInt(answer.substr(cmd[order].length,answer.length-cmd[order].length)) : 'X'; }
                if(cmd[order] === '2AFNLMT?') { afnLmt = answer.substr(cmd[order].length,1) !== 'X' ?  parseInt(answer.substr(cmd[order].length,answer.length-cmd[order].length)) : 'X'; }
                if(cmd[order] === '2AFTBL?') { aftbl = parseInt(answer.substr(cmd[order].length,answer.length-cmd[order].length)); }
                if(cmd[order] === '2POS?') {
                    zPosition = parseInt(answer.substr(cmd[order].length,answer.length-cmd[order].length)); 
                    if((zPosition !== zPositionControl)&&(control ===1)){cmd.push('2LOG IN'); cmd.push('2POS?'); cmd.push('2LOG OUT');}
                    else {zPositionControl = -1 ;}
                }
                if(cmd[order] === '2AF SHOT') {
                    if(answer.substr(0,5) === ('2AF +')) autofocus = "SUCCESS" ;
                    else autofocus = "ECHEC" ;
                }
                if((wheelFilterControl === -1) && (shutterControl === -1) &&(zPositionControl === -1)) nodeSend = 1 ;
                //if((cmd[order] ==='1LOG OUT') || (cmd[order] ='1LOG IN')) nodeSend = 0 ;
                console.log(device+'>Request:'+cmd[order]+","+answer.substr(0,answer.length-2));
                
                order = order + 1;
                if(order < cmd.length){
                    sendSimpleCommand(cmd[order]);
                }
                else {                    
                    if ((nodeSend === 1)){
                        nodeSend = 0;
                        var msg = {};
                        msg.payload = 'done'; msg.config = config; msg.topic = topic; msg.device = device; msg.type = type ; msg.mode = mode ; msg.action = action ;
                        msg.update = {'A' : {}} ;
                        msg.update['A']['wheelFilter'] = wheelFilter; msg.update['A']['shutter'] = shutter; msg.update['A']['lamp'] = lamp; msg.update['A']['intensity'] = intensity;
                        msg.update['A']['zPosition'] = zPosition; msg.update['A']['farLimit'] = farLmt; msg.update['A']['nearLimit'] = nearLmt; msg.update['A']['affLimit'] = affLmt; msg.update['A']['afnLimit'] = afnLmt; msg.update['A']['objective'] = aftbl;
                        msg.update['B'] = ['#808080']; //F
                        msg.update['C'] = [1];
                        
                        msg.status = {"state" : "SUCCESS", "autofocus" : autofocus , "date" : Date.now()}
                        msg.config = config ;
                        autofocus = "NOT USED";
                        node.send(msg);
                        //context.set("availableOlympusIx81","yes");
                        node.status({fill:"green",shape:"dot",text:"ready ..."});
                        //cmd = [] ;
                        }
                        // node.warn(timeout);
                        
                    }
                    answer = '';
                    if(timeout > 0){
                        setTimeout(function(){
                            cmd = [] ;
                            order = 0 ;
                            nodeSend = 1 ;
                            node.warn(keep);
                            if(keep === false){
                                cmd.push('1SHUT1 IN','1LOG OUT');
                                sendSimpleCommand(cmd[order]);
                                shutter = false ;
                            }
                            else {
                                cmd.push('1LOG OUT');
                                sendSimpleCommand(cmd[order]);
                                shutter = true ;
                            }
                        },timeout);
                        timeout = -1 ;
                    }
                    
                   
                   
                   
            }
        });
    
        node.on("input",function(msg) {
            //node.warn(msg);
            if( true ){
            //if( context.get("availableOlympusIx81") === "yes" ){
                //context.set("availableOlympusIx81","no");
                node.status({fill:"yellow",shape:"dot",text:"busy ..."});
                if((msg.device === device)&&(msg.topic === topic)){
                    node.status({fill:"blue",shape:"dot",text:"busy"});
                    //timeout = -1 ;
                    console.log(msg.action);
                    if(msg.action === 'set'){
                        
                        cmd = [];
                        control = 1 ;
                        //msg.update['wheelFilter'] = msg.update['wheelFilter'] | wheelFilter ;
                        if(wheelFilter !== parseInt(msg.update['wheelFilter'])){
                            cmd.push('1LOG IN'); cmd.push('1MU  '+parseInt(msg.update['wheelFilter'])); wheelFilterControl = parseInt(msg.update['wheelFilter']) ; //cmd.push('1LOG OUT');
                            /*cmd.push('1LOG IN');*/ cmd.push('1MU?'); cmd.push('1LOG OUT');
                        } 
                        //msg.update['shutter'] = msg.update['shutter'] | shutter ;
                        if(shutter !== msg.update['shutter']){
                            cmd.push('1LOG IN'); cmd.push(msg.update['shutter'] == true ? "1SHUT1 OUT" : "1SHUT1 IN"); shutterControl = msg.update['shutter'] ; //cmd.push('1LOG OUT');
                            /*cmd.push('1LOG IN');*/ cmd.push('1SHUT1?'); cmd.push('1LOG OUT');
                        }
                        //msg.update['lamp'] = msg.update['lamp'] | lamp ;
                        if(lamp !== msg.update['lamp']){
                            cmd.push('1LOG IN');
                            cmd.push(msg.update['lamp'] === true ? "1LMPSW ON" : "1LMPSW OFF");
                            lamp = msg.update['lamp'] ;
                            cmd.push('1LOG OUT');
                        }
                        //msg.update['intensity'] = msg.update['intensity'] | intensity ;
                        if(intensity !== parseFloat(msg.update['intensity'])){
                            cmd.push('1LOG IN');
                            cmd.push('1LMP '+(parseInt(parseFloat(msg.update['intensity'])*10)));
                            intensity = msg.update['intensity'] ;
                            cmd.push('1LOG OUT');
                        }
                        //msg.update['zPosition'] = msg.update['zPosition'] | zPosition ;
                        if(zPosition !== parseInt(msg.update['zPosition'])){
                            cmd.push('2LOG IN'); cmd.push('2MOV d,'+parseInt(msg.update['zPosition'])); zPositionControl = parseInt(msg.update['zPosition']) ; //cmd.push('2LOG OUT');
                            /*cmd.push('2LOG IN');*/ cmd.push('2POS?'); cmd.push('2LOG OUT');
                        }
                        //msg.update['affLimit'] = msg.update['affLimit'] | affLmt ;
                        if(affLmt !== parseInt(msg.update['affLimit'])){
                            cmd.push('2LOG IN');
                            cmd.push('2AFFLMT '+parseInt(msg.update['affLimit']));
                            affLmt = parseInt(msg.update['affLimit']) ;
                            cmd.push('2LOG OUT');
                        }
                        //msg.update['afnlimit'] = msg.update['afnlimit'] | afnLmt ;
                        if(afnLmt !== parseInt(msg.update['afnlimit'])){
                            cmd.push('2LOG IN');
                            cmd.push('2AFNLMT '+parseInt(msg.update['afnlimit']));
                            afnLmt = parseInt(msg.update['afnlimit']) ;
                            cmd.push('2LOG OUT');
                        }
                        //msg.update['objective'] = msg.update['objective'] | aftbl ;
                        if(aftbl !== parseInt(msg.update['objective'])){
                            cmd.push('2LOG IN');
                            cmd.push('2AFTBL '+parseInt(msg.update['objective']));
                            aftbl = parseInt(msg.update['objective']) ;
                            cmd.push('2LOG OUT');
                        }
                    }
                    if(msg.action === 'setWheelFilter'){
                        
                        //msg.update['wheelFilter'] = msg.update['wheelFilter'] | wheelFilter ;
                        //node.warn(wheelFilter+",,,,"+wheelFilterControl+',,,,'+msg.update['wheelFilter']);
                        //if(wheelFilter !== parseInt(msg.update['wheelFilter'])){
                            cmd = [];
                            control = 0 ;
                            cmd.push('1LOG IN'); cmd.push('1MU '+parseInt(msg.update['wheelFilter'])); wheelFilterControl = parseInt(msg.update['wheelFilter']) ; cmd.push('1MU?'); cmd.push('1LOG OUT');
                            node.warn('setWheel'+cmd);
                        //}
                    }
                    if(msg.action === 'setWheelFilter2'){
                        
                        //msg.update['wheelFilter'] = msg.update['wheelFilter'] | wheelFilter ;
                        //node.warn(wheelFilter+",,,,"+wheelFilterControl+',,,,'+msg.update['wheelFilter']);
                        //if(wheelFilter !== parseInt(msg.update['wheelFilter'])){
                            cmd = [];
                            control = 1 ;
                            cmd.push('1LOG IN'); cmd.push('1MU '+parseInt(msg.update['wheelFilter'])); wheelFilterControl = parseInt(msg.update['wheelFilter']) ; cmd.push('1MU?'); cmd.push('1LOG OUT');
                            node.warn('setWheel'+cmd);
                        //}
                    }
                    if(msg.action === 'setOFF'){
                        cmd = [];
                        control = 0 ;
                        nodeSend = 0;
                        //node.warn(msg.update['shutter'] == true ? "1SHUT1 OUT" : "1SHUT1 IN");
                        cmd.push('1LOG IN');
                        cmd.push("1SHUT1 IN");
                        cmd.push('1LOG OUT');
                        shutter = false ;
                     }
                     
                     if(msg.action === 'reset'){
                        cmd = [];
                        control = 0 ;
                        nodeSend = 1 ;
                        //node.warn(msg.update['shutter'] == true ? "1SHUT1 OUT" : "1SHUT1 IN");
                        cmd.push('1LOG OUT');
                        cmd.push("2LOG OUT");
                     }
                    
                    if(msg.action === 'setChannel'){
                        cmd = [];
                        control = 0 ;
                        nodeSend = 1 ;
                        //node.warn(msg.update['shutter'] == true ? "1SHUT1 OUT" : "1SHUT1 IN");
                        cmd.push('1LOG IN');
                        //if(shutter !== msg.update['shutter']){
                            
                            cmd.push(msg.update['shutter'] == true ? "1SHUT1 OUT" : "1SHUT1 IN");
                            shutter = msg.update['shutter'] ; /*cmd.push('1LOG OUT');*/
                         //   cmd.push('1LOG OUT');
                        //}
                        //if(lamp !== msg.update['lamp']){
                         //   cmd.push('1LOG IN');
                            cmd.push(msg.update['lamp'] === true ? "1LMPSW ON" : "1LMPSW OFF");
                            lamp = msg.update['lamp'] ;
                         //   cmd.push('1LOG OUT');
                        //}
                        node.warn(msg.update['intensity'])
                        //if(intensity !== parseFloat(msg.update['intensity'])){
                         //   cmd.push('1LOG IN');
                         
                            cmd.push('1LMP '+(parseInt(parseFloat(msg.update['intensity'])*10)));
                            intensity = msg.update['intensity'] ;
                         //   cmd.push('1LOG OUT');    
                        //}
                        //node.warn('setchannel: '+cmd);
                        if(parseInt(msg.update['timeout'])!==-1) timeout = parseInt(msg.update['timeout']);                        
                        else cmd.push('1LOG OUT');
                        keep = (msg.update['keep'])
                    }
                    if(msg.action === 'setZPosition'){
                        cmd = [];
                        control = 0 ;
                        if((msg.update['moveType'] === 'F')||(msg.update['moveType'] === 'N')) var pos = 100 * parseInt(msg.update['zPosition']) ;
                        else var pos = parseInt(msg.update['zPosition'])+offset ;
                        cmd.push('2LOG IN'); cmd.push('2MOV '+msg.update['moveType']+','+pos); cmd.push('2LOG OUT');
                    }
                    if(msg.action === 'get'){
                        control = 0 ;
                        cmd = ['1LOG IN','1MU?','1SHUT1?','1LMPSW?','1LMP?','1LOG OUT','2LOG IN','2AFFLMT?','2AFNLMT?','2FARLMT?','2NEARLMT?','2AFTBL?','2POS?','2LOG OUT'];
                    }
                    if(msg.action === 'getZPosition'){
                        control = 0 ;
                        cmd = ['2POS?'];
                    }
                    if(msg.action === 'af'){
                        //miss: make a control
                        //if((farLmt !== 0)&&(nearLmt !== 0)&&(affLmt!==0)&(afnLmt!==0)&(farLmt<nearLmt)&(affLmt<afnLmt)&&(aftbl!=0)){
                            control = 0;
                            node.warn('af');
                            var offsetZ = '2MOV F,0';
                            offset = parseInt(msg.update['offset']);
                            if(parseInt(msg.update['offset'])>0) offsetZ = '2MOV N,'+parseInt(Math.abs(msg.update['offset']));
                            else offsetZ = '2MOV F,'+parseInt(Math.abs(msg.update['offset']));
                            cmd = ['2LOG IN', '2FARLMT '+msg.update['farLimit'],'2FARLMT?','2NEARLMT '+msg.update['nearLimit'],'2NEARLMT?','2AFFLMT '+msg.update['affLimit'],'2AFFLMT?','2AFNLMT '+msg.update['afnLimit'],'2AFNLMT?','2aftim 4','2AFTBL '+msg.update['objective'],'2AF SHOT','2POS?',offsetZ,'2LOG OUT'];
                        //}
                    }
                   
                    try {
                        mode = msg.mode ;
                        action = msg.action; 
                        order = 0;
                        nodeSend = 0 ;
                        sendSimpleCommand(cmd[order]);
                    } catch(error){
                        var msg = {};
                        msg.payload = 'done' ; msg.topic = topic; msg.device = device; msg.type = type ; msg.mode = mode ; msg.action = action ;
                        msg.update = {} ;
                        msg.update['wheelFilter'] = wheelFilter; msg.update['shutter'] = shutter; msg.update['lamp'] = lamp; msg.update['intensity'] = intensity;
                        msg.update['zPosition'] = zPosition; msg.update['farLimit'] = farLmt; msg.update['nearLimit'] = nearLmt; msg.update['affLimit'] = affLmt; msg.update['afnLimit'] = afnLmt; msg.update['objective'] = aftbl;
                        msg.config = config ;
                        msg.status = {"state" : "SUCCESS", "autofocus" : autofocus , "date" : Date.now()}
                        autofocus = "NOT USED";
                        node.send(msg);
                        context.set("availableOlympusIx81","yes");
                        node.status({fill:"green",shape:"dot",text:"ready ..."});
                    }
                }
            }
        });
        node.on('close', function() {
          return;
        });
    }
    RED.nodes.registerType("OlympusIx81",OlympusIx81Node);
};