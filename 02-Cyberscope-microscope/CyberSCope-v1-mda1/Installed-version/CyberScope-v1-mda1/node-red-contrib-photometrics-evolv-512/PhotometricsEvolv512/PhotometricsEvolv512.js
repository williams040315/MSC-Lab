module.exports = function(RED) {
    "use strict";
    function PhotometricsEvolv512Node(config) {
        RED.nodes.createNode(this,config);
        
        var node = this;
        var spawn = require('child_process').spawn;
        
       //Init
        node.status({fill:"yellow",shape:"dot",text:"initialize ..."});
        var msg = {};
        this.topic = "Camera1";
        this.device = 'PHOTOMETRICS-EVOLV-512';
        this.payload = 'PHOTOMETRICS-EVOLV-512';
        msg.payload = this.payload;
        msg.topic = this.topic;
        msg.device = this.device;
        msg.mode = 'init' ;

        node.send(msg);
        //node.warn(msg);
        
        node.status({fill:"green",shape:"dot",text:"ready ..."});

        node.on("input",function(msg) {

            if((msg.device === this.device)&&(msg.topic === this.topic)){
                node.status({fill:"blue",shape:"dot",text:"busy"});
                var py = spawn('python', ['C:/Users/Williams/Desktop/node-red-contrib-photometrics-evolv-512/PhotometricsEvolv512/test.py']);
                var dataString = '';
                var errString = '';
                py.stdout.on('data', function(data){
                  dataString += data.toString();
                });
                py.stderr.on('data', function(data){
                  errString += String(data);
                });
                py.on('close', function(code) {
                  if (code){
                    node.error('exit code: ' + code + ', ' + errString);
                  } else{
                        msg.payload = "done";
                        msg.update ={'name': dataString};
                        msg.status = {"SUCCESS" : Date.now()};
                        node.send(msg);
                        node.status({fill:"green",shape:"dot",text:"ready ..."});
                  }
                });
            }
          });
        node.on('close', function() {
          return;
        });
    }
    RED.nodes.registerType("PhotometricsEvolv512",PhotometricsEvolv512Node);
}