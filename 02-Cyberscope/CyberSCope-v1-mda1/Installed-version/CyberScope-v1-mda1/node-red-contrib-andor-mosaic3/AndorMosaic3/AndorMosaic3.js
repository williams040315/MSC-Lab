module.exports = function(RED) {
    "use strict";
    function AndorMosaic3Node(config) {
        RED.nodes.createNode(this,config);
        
        var node = this;
        
        //Init
        node.status({fill:"yellow",shape:"dot",text:"initialize ..."});
        var msg = {};
        this.topic = "Mosaic1";
        this.device = 'ANDOR-MOSAIC-3';
        this.payload = 'ANDOR-MOSAIC-3';

        msg.payload = this.payload;
        msg.topic = this.topic;
        msg.device = this.device;
        msg.mode = 'init' ;
                
        node.send(msg);

        node.status({fill:"green",shape:"dot",text:"ready ..."});
        
        node.on("input",function(msg) {
            if((msg.device === this.device)&&(msg.topic === this.topic)){
                node.status({fill:"blue",shape:"dot",text:"busy"});
                setTimeout(function(){
                    msg.payload = "done";
                    msg.update ={"matrice" : 2000};
                    msg.status = {"SUCCESS" : Date.now()};
                    node.send(msg);
                    node.status({fill:"green",shape:"dot",text:"ready ..."});
                },4500);
            }
        });
        node.on('close', function() {
          return;
        });
    }
    RED.nodes.registerType("AndorMosaic3",AndorMosaic3Node);
}