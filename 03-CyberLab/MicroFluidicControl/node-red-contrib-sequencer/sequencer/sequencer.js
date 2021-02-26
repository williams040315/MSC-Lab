/**
 * Author: Williams BRETT
 * Date: 24/11/2018
 * Project: drive the µFluidic valves system
 * post-PhD, lab manager: Fabien Duveau, Kalina Haas, Céline Cordier
 **/

module.exports = function(RED) {
    //"use strict";
    function sequencerNode(config) {
        RED.nodes.createNode(this,config);
        
        var node = this;
        this.topic = config.topic;
        this.rules = config.rules;
        this.name = config.name;
        this.save = config.save;
        this.duration = config.duration ;
        this.ApiKey = config.ApiKey;
        this.BaseKey = config.BaseKey ;
        
        var Airtable = require('airtable');
            
        var context = this.context().global;
        context.set("lock_sequencer","unlock");
        context.set("rowIdsequencer","");
        node.status({fill:"green",shape:"dot",text:"ready..."});
        
        var repeat          = [];
        var clock           = [];
        var stateofvalve    = [];
        var modulo          = [];
        var alternate       = [];
        var enable          = [];
        
        var indexation      = 0;
        node.log("Init node-red-contrib-sequencer >> done");
            
        this.on('input', function (msg) {
                    
            var args_json = Object.keys(msg.payload).length;
            var args_node = this.rules.length ;
            
            var used_data ;
            var used_length ;
            var validate = false ;
            var name;
            var save;
            var delay;            
            var base;
            
            if (args_json > 3){
                validate = true;
                used_data = msg.payload.vRules;
                used_length = Object.keys(msg.payload.vRules).length;
                delay= msg.payload.duration;
                name= msg.payload.name || "empty";
                save= msg.payload.save || "empty";
                base = new Airtable({apiKey: msg.payload.api_key}).base(msg.payload.base_key);
            }
            else if (args_node > 0) {
                validate = true;
                used_data = this.rules;
                used_length = args_node;
                delay= this.duration;
                name = this.name || "empty";
                save = this.save || "empty";
                base = new Airtable({apiKey: this.ApiKey}).base(this.BaseKey);
            }

            if (validate === true){
                if( (msg.payload.run === true) && ((context.get("lock_sequencer")||"unlock") === "unlock")){
                    context.set("lock_sequencer","lock") ;
                    node.log("Running node-red-contrib-sequencer >> done");
                    msg.payload.run = true;
                    
                    var timestamp = new Date().getTime() ;
                    //airTable(name, used_data, used_length, delay, timestamp);
                    for (var i=0;i<used_length;i++) {
                        repeat [i] = 0;
                        clock[i] = -1;
                        
                        if((used_data[i].es).toString() === (false).toString()) stateofvalve[i] = 0;
                        else stateofvalve[i] = 1;
                        if((used_data[i].stc).toString() === (false).toString()) alternate[i] = true ;
                        else alternate[i] = false ;
                        if(used_data[i].en_c === true) {enable[i] = true;}
                        else {
                            enable[i] = false;
                            if((used_data[i].en_s).toString() === (false).toString()) { stateofvalve[i] = 0;}
                            else {stateofvalve[i] = 1;}
                        }
                        modulo[i] = parseInt(used_data[i].et); 
                        update(i,used_length, used_data, delay, name, save, timestamp);
                    }
                }
                if(msg.payload.run === false){
                    msg.payload.run = false;
                    context.set("lock_sequencer","unlock");
                    node.status({fill:"red",shape:"dot",text:"node stopped"});
                    node.log("Stop node-red-contrib-sequencer >> done");
                }
            }
            
            
            function update(i,lg,rule,duration,name,save, timestamp){
                
                if(save !== "empty"){
                    var save_write = "";
                    var fs = require('fs'); 
                    var date = new Date(); 
                    var ws = fs.createWriteStream(save+'_'+timestamp+'.txt');    
                    var wsFormatted = fs.createWriteStream("formatted_"+save+'_'+timestamp+'.txt');    
                    var write = "Time";
                    for(var k=0; k<lg; k++){
                        write = write + ","+rule[k].nm;
                    }
                    wsFormatted.write(write + "\n");
                            
                }
                repeat[i] = setInterval(function(){

                var output = {};
                output.topic = name || "empty";
                output.payload = {};

                if(clock[i]>=0){
                    if( (clock[i] < ((duration*60)-1)) && (context.get("lock_sequencer") ==="lock") ){
                            clock[i] = clock[i] + 1 ;
                            if(enable[i] === true){
                                if (clock[i] >= parseInt(rule[i].et)){
                                    if((clock[i] % ((modulo[i])*60)) === 0){
                                        if(alternate[i] === false){ modulo[i] = parseInt(modulo[i]) + parseInt(rule[i].ths) ; stateofvalve[i] = 1 ;}
                                        if(alternate[i] === true){  modulo[i] = parseInt(modulo[i]) + parseInt(rule[i].tls) ; stateofvalve[i] = 0 ;}
                                        alternate[i] = !alternate[i] ;
                                    }
                                }
                                else {
                                    if((rule[i].es).toString() === (false).toString()) stateofvalve[i] = 0;
                                    else stateofvalve[i] = 1;
                                }
                            }                            
                        }
                        else {
                            //clock[i] = 0;
                            //if((rule[i].stc).toString() === (false).toString()) alternate[i] = true ;
                            //else alternate[i] = false ;
                            //modulo[i] = parseInt(rule[i].et); 
                            if(enable[i] === true){
                                if((rule[i].sws).toString() === (false).toString()) stateofvalve[i] = 0;
                                else stateofvalve[i] = 1;
                            }
                            clearInterval(repeat[i]);
                            context.set("lock_sequencer","unlock") ;
                        }
                    }
                    else {
                        clock[i] = clock[i] + 1 ;
                        output.payload["state"] = "unlock" ;
                        node.send(output);                    
                    }
              
                    if(clock[i]>=0){
                        if(i === (lg-1)){
                            var write = "" ;
                            var writeFormatted = "";
                            var write_com = Math.abs(stateofvalve[0] - 1);
                            for(var k=0; k<lg; k++){
                                output.payload[rule[k].nm] = stateofvalve[k];
                                write = write + ","+rule[k].nm+":"+stateofvalve[k];
                                writeFormatted = writeFormatted + ","+stateofvalve[k];
                                if (k !== 0) write_com = write_com + ";" + Math.abs(stateofvalve[k] - 1) ;
                            }
                            output.payload["com"] = write_com ;
                            output.payload["state"] = context.get("lock_sequencer") ;
                            if((save !== "empty")&&(write !== save_write)){
                                date = new Date().getTime(); 
                                var stream  = "{Time:"+date + write + "}" ;
                                var streamFormatted  = date + writeFormatted;
                                ws.write(stream + "\n");
                                wsFormatted.write(streamFormatted + "\n");
                                //airTable_output(stream,indexation) ;
                                indexation = indexation + 1;
                            }
                            save_write = write ;
                            node.send(output);                    
                            if(context.get("lock_sequencer") === "unlock") node.status({fill:"green",shape:"dot",text:"ready..."});
                            else node.status({fill:"green",shape:"ring",text:"running..."});
                        }
                    }
                    if(context.get("lock_sequencer")==="unlock") indexation = 0 ;
                },1000);        
            }  
        
            function airTable_output(value, id){
                base('output').create({
                  "key_output": "data["+id+"]",
                  "data": value,
                  "sequencer":[context.get("rowIdsequencer")],
                }, function(err, record, date) {
                    if (err) { console.error(err); return; }
                        //console.log(context.get("rowIdsequencer"));
                        base('sequencer').update(context.get("rowIdsequencer"), {
                        "Timestamp (stop)": new Date().getTime()
                      }, function(err, record) {
                          if (err) { console.error(err); return; }
                          //console.log(record.get('Name'));
                      });
                }
                );
            }

            
            function airTable(name, used_data, used_length, delay, timestamp){       
                base('sequencer').create({
                  "Name": name,
                  "Duration (in minuts)": parseInt(delay),
                  "Timestamp (start)": timestamp,
                  }, function(err, record) {
                    if (err) { console.error(err); return; }
                    context.set("rowIdsequencer",""+record.getId());
                    for(var i = 0; i<used_length; i++ ){
                        if((used_data[i].es).toString()===(false).toString()) eState = "low state" ;
                        else eState = "high state";
                        if((used_data[i].stc).toString()===(false).toString()) start = "low state" ;
                        else start = "high state";
                        if((used_data[i].sws).toString()===(false).toString()) stop = "low state" ;
                        else stop = "high state";
                        base('rules').create({
                          "key_rules": "rule["+i+"]",
                          "Name": used_data[i].nm,
                          "Enable" : used_data[i].en_c,
                          "Establishment time (in minuts)": parseInt(used_data[i].et),
                          "Establishment state": eState,
                          "Time (high state) (in minuts)": parseInt(used_data[i].ths),
                          "Time (low state) (in minuts)": parseInt(used_data[i].tls),
                          "State (start)": start,
                          "State (stop)": stop,
                          "sequencer": [record.getId()]
                        },function(err, record) {
                            if (err) { console.error(err); return; }  
                        });
                    }
                });
            }                    
        });
    }
    RED.nodes.registerType("sequencer",sequencerNode);
}
