
    var ws;
    var wsUri = "ws:";
    var loc = window.location;
    ///var data = "" ;    
    var order = 'getRessources' ;
    var nbOfSettingsChannels = -1;
    var nbOfMdaConfiguration = -1;
    var ressources =  [];
    var settingschannels = [];
    var listConfigChannel = [];
    var configChannel = [];
    var nodeParameters = '';
    var openBox = false ;
    //WEBSOCKET


  */  var CLIPBOARD = null;
    
    $(function(){
      $("#tree").fancytree({
    /*    activate: function(event, data){
            var node = data.node;
            alert(node);
        },*/
        checkbox: false, //function(event, data) {
        // Hide checkboxes for folders
          //return data.node.isFolder() ? false : true;
        //},
        tooltip: function(event, data) {
          // Create dynamic tooltips
          //return data.node.title + " (" + data.node.key + ")";
          var node = data.node;
          if( node.type === "PROT" )   return "Protocole";
          if( node.type === "LOOP" )   return "Sequence";
          if( node.type === "XYZ" )   return "XYZ position";
          if(node.type === "LIGHT")   return "Lighting";
          if(node.type === "CAMERA")  return "Camera";
          if(node.type === "AF")      return "Autofocus";
          if(node.type === "ZS")      return "Z-Stack";
          //node.title = "toto";
        },
        icon: function(event, data) {
          var node = data.node;
          if( node.type === "XYZ" )   return "fancytree-master/demo/skin-custom/yxz-512.png";
          if(node.type === "LIGHT")   return "fancytree-master/demo/skin-custom/color_wheel.png";
          if(node.type === "CAMERA")  return "fancytree-master/demo/skin-custom/camera.png";
          if(node.type === "AF")      return "fancytree-master/demo/skin-custom/autofocus.png";
          if(node.type === "ZS")      return "fancytree-master/demo/skin-custom/zstack.png";
          if( node.type === "LOOP" )  return "fancytree-master/demo/skin-custom/arrow_rotate_clockwise.png";
          if( node.type === "PROT" )  return "fancytree-master/demo/skin-custom/protocol.png";
          },
        titlesTabbable: true,
        quicksearch: true,
        source: { url: "fancytree-master/demo/test.json"},
        extensions: ["edit", "dnd5", "table", "gridnav","multi"],
        unselectable: function(event, data) {
          return data.node.isFolder();
        },
        multi: {
          mode: "sameParent",
        },
        activate: function(event, data) {
          $("#lblActive").text("" + data.node+" "+ data.node.type);
        },
        dnd5: {
          preventVoidMoves: true,
          preventRecursiveMoves: true,
          autoExpandMS: 400,
          dragStart: function(node, data) {
            return true;
            },
          dragEnd: function(node, data) {
            },

          dragEnter: function(node, data) {
              // node.debug("dragEnter", data);
              data.dataTransfer.dropEffect = "move";
              // data.dataTransfer.effectAllowed = "copy";
              return true;
            },
            dragOver: function(node, data) {
            data.dataTransfer.dropEffect = "move";
          // data.dataTransfer.effectAllowed = "copy";
                },
            dragLeave: function(node, data) {
                },
          dragDrop: function(node, data) {
                /* This function MUST be defined to enable dropping of items on
               * the tree.
               */
              var transfer = data.dataTransfer;
    
              node.debug("drop", data);
    
/*               alert("Drop on " + node + ":\n"
                 + "source:" + JSON.stringify(data.otherNodeData) + "\n"
                 + "hitMode:" + data.hitMode
                 + ", dropEffect:" + transfer.dropEffect
                 + ", effectAllowed:" + transfer.effectAllowed);
  */  
              if( data.otherNode ) {
                // Drop another Fancytree node from same frame
                // (maybe from another tree however)
                var sameTree = (data.otherNode.tree === data.tree);
    
                data.otherNode.moveTo(node, data.hitMode);
              } else if( data.otherNodeData ) {
                // Drop Fancytree node from different frame or window, so we only have
                // JSON representation available
                node.addChild(data.otherNodeData, data.hitMode);
              } else {
                // Drop a non-node
                var typeOfNode = '';
                if(transfer.getData("text")=='Simple picture') typeOfNode = 'CAMERA' ;
                else if(transfer.getData("text")=='Autofocus') typeOfNode = 'AF' ;
                else if(transfer.getData("text")=='Z-stack') typeOfNode = 'ZS' ;
                else if(transfer.getData("text")=='Sequence') typeOfNode = 'LOOP' ;
                else if(transfer.getData("text")=='XYZ Position') typeOfNode = 'XYZ' ;
                else {typeOfNode = "LIGHT";}
                
                if(typeOfNode==="CAMERA"){
                  node.addNode({
                    title: transfer.getData("text"),
                    time : 100,
                    skip : 0,
                    number : 1,
                    zoffset : 0,
                    type : typeOfNode
                    }, data.hitMode);  
                }
                if(typeOfNode==="AF"){
                  node.addNode({
                    title: transfer.getData("text"),
                    "lower" : 30,
                    "upper": 30,
                    "aftbl" : "LCPlanFl 40x",
                    type : typeOfNode
                    }, data.hitMode);  
                }
                if(typeOfNode==="ZS"){
                  node.addNode({
                    title: transfer.getData("text"),
                    "skip" : 0,
                    "zstart": -5,
                    "zend" : 5,
                    "zstep" : 1,
                    "shutter" : true,
                    type : typeOfNode
                    }, data.hitMode);
                }
                if(typeOfNode==="LIGHT"){
                  node.addNode({
                      title: transfer.getData("text"),
                      time : 10,
                      skip : 0,
                      wheel : 0,
                      color : "#22EE33",
                      type : typeOfNode
                        }, data.hitMode);  
                }
                if(typeOfNode==="LOOP"){
                  node.addNode({
                    title: transfer.getData("text"),
                    time: 6,
                    repeat: 10,
                    type : typeOfNode
                    }, data.hitMode);  
                }
                if(typeOfNode==="XYZ"){
                  node.addNode({
                    title: transfer.getData("text"),
                    xPosition : 0,
                    yPosition : 0,
                    zPosition : 0,
                    res1: 1,
                    res2 : 10,
                    type : typeOfNode
                    }, data.hitMode);  
                }
                
              }
              node.setExpanded();
          }
        },
        edit: {
          triggerStart: ["dblclick", "f2", "mac+enter", "shift+click"],
          //node.icon = "accept.png",
          //node.renderTitle(),
          close: function(event, data) {
            if( data.save && data.isNew ){
              // Quick-enter: add new nodes until we hit [enter] on an empty title
              $("#tree").trigger("nodeCommand", {cmd: "addSibling"});
            }
          }
        },
        table: {
          indentation: 20,
          nodeColumnIdx: 2,
          checkboxColumnIdx: 0
        },
        gridnav: {
          autofocusInput: false,
          handleCursorKeys: true
        },
    
    /*    lazyLoad: function(event, data) {
          data.result = {url: "../demo/ajax-sub2.json"};
        },*/
        createNode: function(event, data) {
          var node = data.node,
            $tdList = $(node.tr).find(">td");
    
          // Span the remaining columns if it's a folder.
          // We can do this in createNode instead of renderColumns, because
          // the `isFolder` status is unlikely to change later
          /*if( node.isFolder() ) {
            $tdList.eq(2)
              .prop("colspan", 7)
              .nextAll().remove();
          }*/
        },
        renderColumns: function(event, data) {
          var node = data.node,
            $tdList = $(node.tr).find(">td");
    
          // (Index #0 is rendered by fancytree by adding the checkbox)
          // Set column #1 info from node data:
          //$tdList.eq(1).text(node.getIndexHier());
          // (Index #2 is rendered by fancytree)
          // Set column #3 info from node data:
          $tdList.eq(2).find("input").val(node.key);
          //$tdList.eq(4).find("input").val(node.data.foo);
        //alert(node.type);
          // Static markup (more efficiently defined as html row template):
          if( (node.type == 'LIGHT') ||(node.type == 'LOOP') || (node.type == 'CAMERA') || (node.type == 'AF') || (node.type == 'ZS') || (node.type == 'XYZ') ) 
            $tdList.eq(3).html('<button onClick="editTree();"><img src="icons/wrench.png"></button>');
          // ...
        }
      }).on("nodeCommand", function(event, data){
        // Custom event handler that is triggered by keydown-handler and
        // context menu:
        var refNode, moveMode,
          tree = $(this).fancytree("getTree"),
          node = tree.getActiveNode();
    
        switch( data.cmd ) {
        case "moveUp":
          refNode = node.getPrevSibling();
          if( refNode ) {
            node.moveTo(refNode, "before");
            node.setActive();
          }
          break;
        case "moveDown":
          refNode = node.getNextSibling();
          if( refNode ) {
            node.moveTo(refNode, "after");
            node.setActive();
          }
          break;
        case "indent":
          refNode = node.getPrevSibling();
          if( refNode ) {
            node.moveTo(refNode, "child");
            refNode.setExpanded();
            node.setActive();
          }
          break;
        case "outdent":
          if( !node.isTopLevel() ) {
              if(node.getParent().type != 'PROT'){
                node.moveTo(node.getParent(), "after");
                node.setActive();
              }
          }
          break;
        case "rename":
          node.editStart();
          break;
        case "remove":
          refNode = node.getNextSibling() || node.getPrevSibling() || node.getParent();
          node.remove();
          if( refNode ) {
            refNode.setActive();
          }
          break;
        case "addChild":
          node.editCreateNode("child", "");
          break;
        case "addSibling":
          node.editCreateNode("after", "");
          break;
        case "cut":
          CLIPBOARD = {mode: data.cmd, data: node};
          break;
        case "copy":
          CLIPBOARD = {
            mode: data.cmd,
            data: node.toDict(function(n){
              delete n.key;
            })
          };
          break;
        case "clear":
          CLIPBOARD = null;
          break;
        case "paste":
          if( CLIPBOARD.mode === "cut" ) {
            // refNode = node.getPrevSibling();
            CLIPBOARD.data.moveTo(node, "child");
            CLIPBOARD.data.setActive();
          } else if( CLIPBOARD.mode === "copy" ) {
            node.addChildren(CLIPBOARD.data).setActive();
          }
          break;
        default:
          alert("Unhandled command: " + data.cmd);
          return;
        }
    
       }).on("click", function(e){
         //alert("youpi");//
         console.log( e, $.ui.fancytree.eventToString(e) );
    
      }).on("keydown", function(e){
        var cmd = null;
    
        // console.log(e.type, $.ui.fancytree.eventToString(e));
        switch( $.ui.fancytree.eventToString(e) ) {
        case "ctrl+shift+b":
          cmd = "addChild";
          break;
        case "ctrl+b":
          cmd = "addSibling";
          break;
        case "meta+shift+n": // mac: cmd+shift+n
          cmd = "addChild";
          break;
        case "ctrl+c":
        case "meta+c": // mac
          cmd = "copy";
          break;
        case "ctrl+v":
        case "meta+v": // mac
          cmd = "paste";
          break;
        case "ctrl+x":
        case "meta+x": // mac
          cmd = "cut";
          break;
        case "ctrl+n":
        case "meta+n": // mac
          cmd = "addSibling";
          break;
        case "del":
        case "meta+backspace": // mac
          cmd = "remove";
          break;
        // case "f2":  // already triggered by ext-edit pluging
        //   cmd = "rename";
        //   break;
        case "ctrl+up":
          cmd = "moveUp";
          break;
        case "ctrl+down":
          cmd = "moveDown";
          break;
        case "ctrl+right":
        case "ctrl+shift+right": // mac
          cmd = "indent";
          break;
        case "ctrl+left":
        case "ctrl+shift+left": // mac
          cmd = "outdent";
        }
        if( cmd ){
          $(this).trigger("nodeCommand", {cmd: cmd});
          // e.preventDefault();
          // e.stopPropagation();
          return false;
        }
      });
    
      /*
       * Tooltips
       */
      // $("#tree").tooltip({
      //   content: function () {
      //     return $(this).attr("title");
      //   }
      // });
    
      /*
       * Context menu (https://github.com/mar10/jquery-ui-contextmenu)
       */
      $("#tree").contextmenu({
        delegate: "span.fancytree-node",
        menu: [
          {title: "Edit <kbd>[F2]</kbd>", cmd: "rename", uiIcon: "ui-icon-pencil" },
          {title: "Delete <kbd>[Del]</kbd>", cmd: "remove", uiIcon: "ui-icon-trash" },
          {title: "----"},
          {title: "New sibling <kbd>[Ctrl+B]</kbd>", cmd: "addSibling", uiIcon: "ui-icon-plus" },
          {title: "New child <kbd>[Ctrl+Shift+B]</kbd>", cmd: "addChild", uiIcon: "ui-icon-arrowreturn-1-e" },
          {title: "----"},
          {title: "Cut <kbd>Ctrl+X</kbd>", cmd: "cut", uiIcon: "ui-icon-scissors"},
          {title: "Copy <kbd>Ctrl-C</kbd>", cmd: "copy", uiIcon: "ui-icon-copy"},
          {title: "Paste as child<kbd>Ctrl+V</kbd>", cmd: "paste", uiIcon: "ui-icon-clipboard", disabled: true }
          ],
        beforeOpen: function(event, ui) {
          var node = $.ui.fancytree.getNode(ui.target);
          $("#tree").contextmenu("enableEntry", "paste", !!CLIPBOARD);
          node.setActive();
        },
        select: function(event, ui) {
          var that = this;
          // delay the event, so the menu can close and the click event does
          // not interfere with the edit control
          setTimeout(function(){
            $(that).trigger("nodeCommand", {cmd: ui.cmd});
          }, 100);
        }
      });
    });


    if (loc.protocol === "https:") { wsUri = "wss:"; }
        wsUri += "//" + loc.host + loc.pathname.replace("missmarple","ws/missmarple");

    function wsConnect() {
        ws = new WebSocket(wsUri);
        ws.onmessage = function(msg) {
            var  data = msg.data;
            data = JSON.parse(data);            
            if(order === 'getRessources') {ressources = data ; order = 'listConfigChannel'; requestWS(order); }
            else if(order === 'listConfigChannel') {
                listConfigChannel = data ;
                if(listConfigChannel.length !==0) {$("#available_configChannels").empty();$("#available_configChannels").append('<span>Available configuration channels</span>&nbsp;');}
                for(var i=0; i<listConfigChannel.length;i++)
                    $("#available_configChannels").append('<span name="'+listConfigChannel[i]+'" id="setting_button_load_channel_'+i+'" class="drag-source" draggable="true" ondragstart="event.dataTransfer.setData(\'text/plain\', \''+listConfigChannel[i]+'\');"><img src="icons/wrench.png">&nbsp;'+listConfigChannel[i]+'</span>&nbsp;&nbsp;&nbsp;');

                }
            else if( (order === 'getSettingChannels') || (order === 'LoadSettingChannelsConfiguration')) {settingschannels = data ; SettingChannels('load');}
            else if( (order === 'updateSettingChannels') ) {settingschannels = data ; makeSpanChannels();}
            else if(order === "getMDA-mdazs_zstart_set") {$("#mdazs_zstart").val(data);}
            else if(order=== 'getSettingChannels-MDA' ){settingschannels = data ; make();}
            else if(order=='getValueXYZ'){
                if(openBox === false){
                    openBox = true ;
                    $.confirm({
                        title: "Settings: "+nodeParameters.title,
                        theme: "modern",
                        content: 'url:form/xyz.html',
                        columnClass: 'col-md-8',
                        onContentReady: function () {
                            var self = this;
                            if(nodeParameters.data.xPosition === 0) self.$content.find('.xPosition').val(data['xPosition']);
                            else self.$content.find('.xPosition').val(nodeParameters.data.xPosition);
                            if(nodeParameters.data.yPosition === 0) self.$content.find('.yPosition').val(data['yPosition']);
                            else self.$content.find('.yPosition').val(nodeParameters.data.yPosition);
                            if(nodeParameters.data.zPosition === 0) self.$content.find('.zPosition').val(data['zPosition']);
                            else self.$content.find('.zPosition').val(nodeParameters.data.zPosition);
                            self.$content.find('.res1').val(nodeParameters.data.res1);
                            self.$content.find('.res2').val(nodeParameters.data.res2);
                        },
                        buttons: {
                            markorreplace: {
                                text: 'Mark | Replace position', // text for button
                                btnClass: 'btn-green', // class for the button
                                isHidden: false, // initially not hidden
                                isDisabled: false, // initially not disabled
                                action: function(markorreplace){
                                    order = 'getValueXYZ';
                                    requestWS('getValueXYZ');
                                    return false;
                                }
                            },
                            gotoposition: {
                                text: 'Go to position', // text for button
                                btnClass: 'btn-green', // class for the button
                                isHidden: false, // initially not hidden
                                isDisabled: false, // initially not disabled
                                action: function(gotoposition){
                                    //order = 'getValueXYZ';
                                    requestWS('goToPosition,x='+this.$content.find(".xPosition").val()+',y='+this.$content.find(".yPosition").val()+',z='+this.$content.find(".zPosition").val());
                                    return false;
                                }
                            },
                            valid: {
                                btnClass: 'btn-blue',
                                action: function(){
                                    //, // class for the button
                                    var xPosition = this.$content.find('.xPosition').val();
                                    var yPosition = this.$content.find('.yPosition').val();
                                    var zPosition = this.$content.find('.zPosition').val();
                                    var res1 = this.$content.find('.res1').val();
                                    var res2 = this.$content.find('.res2').val();
                                    if(!xPosition){$.alert('provide a valid xPosition');return false;
                                    } else nodeParameters.data.xPosition = xPosition ;
                                    if(!yPosition){$.alert('provide a valid yPosition');return false;
                                    } else nodeParameters.data.yPosition= yPosition ;
                                    if(!zPosition){$.alert('provide a valid zPosition');return false;
                                    } else nodeParameters.data.zPosition = zPosition ;
                                    if(!res1){$.alert('provide a valid res1');return false;
                                    } else nodeParameters.data.res1 = res1 ;
                                    if(!res2){$.alert('provide a valid res2');return false;
                                    } else nodeParameters.data.res2 = res2 ;
                                    $.alert('Your paramaters are saving');
                                    openBox = false ;
                                }
                            },
                            cancel:{
                                btnClass: 'btn-danger', // class for the button
                                action : function(){
                                    openBox = false ;
                                }
                            }
                        }
                    });
                }
                else for(var key in data) $('.'+key).val(data[key]);
            }
            else if(order === 'tryAutoFocus'){
                $.alert(data['autoFocus']);
            }
        };
        ws.onopen = function() {
            document.getElementById('status').innerHTML = "Connected to server";
            setting();
            setTimeout(function(){
                requestWS('getRessources');
            },500);
        };
        ws.onclose = function() {
            wait();
            order = 'getRessources' ;
            nbOfSettingsChannels = -1 ;
            //nbOfSettingsChannels = -1;
            //nbOfMdaConfiguration = -1;
            //ressources =  [];
            //settingschannels = [];
            //nodeParameters = '';
            //openBox = false ;
            document.getElementById('status').innerHTML = "Not connected - retry in 3 seconds ...";
            setTimeout(wsConnect,1000);
        };        
    }
    function requestWS(m) {
        if (ws) { ws.send(m);}
    }
    
    function live_mode(){
        $("#main").show();$("#live_mode").show();$("#settings").hide();$("#mda").hide();$("#wait").hide();$(".nav li").removeClass("active");$('#livemodeli').addClass('active');
        $.get( "http://127.0.0.1:5000/liveOn", function( data ) {
          $( ".result" ).html( data );
        });
    }
    
    function setting(){
        $("#main").show();$("#live_mode").hide();$("#settings").show();$("#mda").hide();$("#wait").hide();$(".nav li").removeClass("active");$('#settingschannelsli').addClass('active');
    }

    function mda(){
        $("#main").show();$("#live_mode").hide();$("#settings").hide();$("#mda").show();$("#wait").hide();$(".nav li").removeClass("active");$('#mdali').addClass('active');$('#mdatpli').addClass('active');$('#mdatpdiv').show();$('#mdampdiv').hide();$('#mdazsdiv').hide();$('#mdaafdiv').hide();$('#mdacdiv').hide();$('#mdaaodiv').hide();$('#mdasidiv').hide();$('#mdaacdiv').hide();
        $.get( "http://127.0.0.1:5000/quit", function( data ) {
          $( ".result" ).html( data );
          alert( "Load was performed." );
        });
    }
    
    function wait(){
        $("#main").hide();
        $("#wait").show();
    }

    function SettingChannels(method){
        var data = settingschannels ;
        //alert(data[0]['name']);
        if(method == 'load'){
            $("#setting_table_channel").empty();
            for(var scan=1; scan<data.length;scan++){
                if(data[scan]['type'] == 'ligth-source'){
                    if(nbOfSettingsChannels  === -1) nbOfSettingsChannels  = 0 ;
                    nbOfSettingsChannels = nbOfSettingsChannels + 1 ;
                    $("#setting_table_channel").append('<table id="channel'+scan+'" class="table table-striped"></table>');
                    $("#channel"+scan).append("<thead><tr><th></th><th>Name Channel</th><th>Light Source</th><th style='width:500px;'></th><th></th><th></th><th></th><th></th></tr></thead>");
                    $("#channel"+scan).append("<tbody><tr><td id='chk"+scan+"'></td><td id='"+scan+"_name'></td><td id='option"+scan+"'></td><td id='config"+scan+"'></td><td id='delete"+scan+"'></td></tr></tbody>");
                    $("#"+scan+"_name").append("<input required name='"+scan+"_channel' id='"+scan+"_channel 'type='text' value='"+data[scan]['name']+"' placeholder='channel " + scan + "'/>");
                    $("#option"+scan).append("<select class='settings_select_device' name='"+scan+"_devices' id='"+scan+"_devices'></select>");
                    for(var i=0; i<ressources.length;i++) {
                        if(ressources[i]['type'] == 'ligth-source') $('#'+scan+'_devices').append("<option value=" + i + ">" + ressources[i]['device']  + "</option>");
                        if(ressources[i]['device'] === data[scan]['device']) $("#"+scan+"_devices option[value='"+i+"']").prop('selected', true);            
                    }
                //var inc = 0 ;
                for(var key in data[scan]["config"]) {
                    for(var element=0; element<data[scan]['config'][key].length;element++){
                        $("#config"+scan).append(data[scan]['config'][key][element].replace(/%/gi, scan+"_")+"&nbsp;");
                        if(data[scan]['config'][key][element].indexOf('select') !==-1){
                            $('#'+scan+"_"+key+element+" option[value='"+data[scan]['update'][key][element]+"']").prop('selected', true);}
                        if(data[scan]['config'][key][element].indexOf('number') !==-1){
                            $('#'+scan+"_"+key+element).val(data[scan]['update'][key][element]);
                            
                        }
                        }
                    $("#config"+scan).append("<br>");      
                }
                $("#delete"+scan).append("<button class='setting_button' name='settingchannels_del"+scan+"' id='settingchannels_del"+scan+"'><img src='icons/cross.png'></button>");
                }
            }
            order = '';
            if(nbOfSettingsChannels === -1) {$("#setting_button_save_channel").prop('disabled',true);}
            else { $("#setting_button_save_channel").prop('disabled',false); makeSpanChannels();}
            
        }
    }

  
    $(document).ready(function(){
        
        $(document).on('click', 'button', function () {
            if(this.id === 'mdazs_zstart_set') {order ="getMDA-mdazs_zstart_set" ; requestWS(order);} //
            if(this.id === 'xPosUP2') {requestWS('moveX,UP'+$(".res2").val());} //
            if(this.id === 'zPosUP2') {requestWS('moveZ,UP,'+$(".res2").val());} //
            if(this.id === 'xPosUP1') {requestWS('moveX,UP,'+$(".res1").val());} //
            if(this.id === 'zPosUP1') {requestWS('moveZ,F,'+$(".res1").val());} //
            if(this.id === 'xPosDW2') {requestWS('moveX,DW,'+$(".res2").val());} //
            if(this.id === 'zPosDW2') {requestWS('moveZ,DW,'+$(".res2").val());} //
            if(this.id === 'xPosDW1') {requestWS('moveX,DW,'+$(".res1").val());} //
            if(this.id === 'zPosDW1') {requestWS('moveZ,N,'+$(".res1").val());} //
            if(this.id === 'yPosLF2') {requestWS('moveY,LF,'+$(".res2").val());} //
            if(this.id === 'yPosLF1') {requestWS('moveY,LF,'+$(".res1").val());} //
            if(this.id === 'yPosRG2') {requestWS('moveY,RG,'+$(".res2").val());} //
            if(this.id === 'yPosRG1') {requestWS('moveY,RG,'+$(".res1").val());} //
            //alert("click");
        });

        $(document).on('click', 'li', function () {
            $(".nav li").removeClass("active");//this will remove the active class from  
            $('#'+this.id).addClass('active');
            $('#mdali').addClass('active');
            var div = this.id.replace(/li/gi,'div');
            $('#mdatpdiv').hide();$('#mdampdiv').hide();$('#mdazsdiv').hide();$('#mdaafdiv').hide();$('#mdacdiv').hide();$('#mdaaodiv').hide();$('#mdasidiv').hide();$('#mdaacdiv').hide();$('#'+div).show();
        });

        $("textarea").change(function(){
            if(this.id === 'mdaac_comment') requestWS("setMDAAcquisitioncommentComment="+$('#mdaac_comment').val());
        });

        $("input").change(function(){    
            if(this.id === 'mdatp_number') requestWS("setMDATimepointNumber="+$('#mdatp_number').val());
            if(this.id === 'mdatp_interval') requestWS("setMDATimepointInterval="+$('#mdatp_interval').val());
            if(this.id === 'mdazs_zstart') requestWS("setMDAZstacksZstart="+$('#mdazs_zstart').val());
            if(this.id === 'mdazs_zend') requestWS("setMDAZstacksZend="+$('#mdazs_zend').val());
            if(this.id === 'mdazs_zstep') requestWS("setMDAZstacksZstep="+$('#mdazs_zstep').val());
            if(this.id === 'mdaaf_skip') requestWS("setMDAAutofocusSkip="+$('#mdaaf_skip').val());
            if(this.id === 'mdasi_directory') requestWS("setMDASaveimagesDirectory="+$('#mdasi_directory').val());
            if(this.id === 'mdasi_prefix') requestWS("setMDASaveimagesPrefix="+$('#mdasi_prefix').val());
        });

        $("select").change(function(){
            if(this.id === 'mdatp_unity') requestWS("setMDATimepointUnity="+$('#mdatp_unity').val());
            if(this.id === 'mdazs_type') requestWS("setMDAZstacksType="+$('#mdazs_type').val());
            if(this.id === 'mdasi_format') requestWS("setMDASaveimagesFormat="+$('#mdasi_format').val());
        });

        $("input").click(function () {
            if(this.id === 'mdatp_use'){
                if($("#mdatp_use").is(":checked")){ $("#mdatp_param").show(); requestWS("setMDATimepointUse=1");}
                else { $("#mdatp_param").hide();requestWS("setMDATimepointUse=0");}
            }
            if(this.id === 'mdamp_use'){
                if($("#mdamp_use").is(":checked")){ $("#mdamp_param").show(); requestWS("setMDAMultiplespositionsUse=1");}
                else { $("#mdamp_param").hide();requestWS("setMDAMultiplespositionsUse=0");}
            }
            if(this.id === 'mdazs_use'){
                if($("#mdazs_use").is(":checked")){ $("#mdazs_param").show(); requestWS("setMDAZstacksUse=1");}
                else {$("#mdazs_param").hide();requestWS("setMDAZstacksUse=0");}
            }
            if(this.id === 'mdazs_shutter'){
                if($("#mdazs_shutter").is(":checked")){requestWS("setMDAZstacksShutter=1");}
                else {requestWS("setMDAZstacksShutter=0");}
            }
            if(this.id === 'mdaaf_use'){
                if($("#mdaaf_use").is(":checked")){$("#mdaaf_param").show(); requestWS("setMDAAutofocusUse=1");}
                else {$("#mdaaf_param").hide(); requestWS("setMDAAutofocusUse=0");}
            }
            if(this.id === 'mdac_use'){
                if($("#mdac_use").is(":checked")){ $("#mdac_param").show(); requestWS("setMDAChannelsUse=1");}
                else { $("#mdac_param").hide();requestWS("setMDAChannelsUse=0");}
            }
            
//            alert(this.id);
            
            if(this.id === 'mdasi_use'){
                if($("#mdasi_use").is(":checked")){$("#mdasi_param").show(); requestWS("setMDASaveimagesUse=1");}
                else {$("#mdasi_param").hide(); requestWS("setMDASaveimagesUse=0");}
            }
        });

        $("form[ajax=true]").submit(function(e) {        
            var id = $("form[ajax=true]").attr('id');
            e.preventDefault();       
            var form_data = $(this).serialize();
            if(id==='setting_channel_form') form_data = "topicpost=setting_channel_form&" + form_data ;
            var form_url = $(this).attr("action");
            var form_method = $(this).attr("method").toUpperCase();
            $.ajax({
                url: form_url, 
                type: form_method,      
                data: form_data,     
                cache: false,
                success: function(returnhtml){                          
                    alertmessage("<strong>Well done ! </strong>"+returnhtml,'#alert-success');
                    //alert();
                    order = 'LoadSettingChannelsConfiguration';
                    requestWS(order+","+ref);
                    //makeSpanChannels();
                /*
                &nbsp;<span class="drag-source" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', 'Channel 2');"><img src='icons/color_wheel.png'>&nbsp;Channel 2</span>
                &nbsp;<span class="drag-source" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', 'Channel 3');"><img src='icons/color_wheel.png'>&nbsp;Channel 3</span>
                &nbsp;<span class="drag-source" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', 'Channel 4');"><img src='icons/color_wheel.png'>&nbsp;Channel 4</span>
                  */          
                }           
            });    
        });    

    $(document).on('click', '.mda_channel_add', function () {
      order = 'getSettingChannels-MDA' ;
      requestWS(order);
    });



    });

    function makeSpanChannels(){
        var data  = settingschannels;
        $("#available_channels_mda").empty();
        $("#available_channels_mda").append('<span>Available channels</span><br>');
        //alert(data[1]['name']);
        for(var i=1; i<data.length; i++)
            $("#available_channels_mda").append('<span class="drag-source" draggable="true" ondragstart="event.dataTransfer.setData(\'text/plain\', \''+data[i]['name']+'\');"><img src="icons/color_wheel.png">&nbsp;'+data[i]['name']+'</span>&nbsp;&nbsp;&nbsp;');
//            $("#available_channels_mda").append('<span onCLick="showInfo();" class="drag-source" draggable="true" ondragstart="event.dataTransfer.setData("text/plain", "ee");"><img src="icons/color_wheel.png">&nbsp;'+data[i]['name']+'</span>&nbsp;&nbsp;&nbsp;');
            
    }
/*    function showInfo(){
        alert("E"+settingsChannels);
 //       alert(settingsChannels);
        $.confirm({
          // theme: "material",
          title: "Settings :",
          //content: "<div id='tree'></div>",
          content: "<h1>INFO</h1>",
          escape: true,
          useBootstrap: true,
          boxWidth: 500,
        });
    }
*/
    //configuration channel MDA 
    var entete = false ;
    function make(){
        var data = settingschannels ;
        if(data.length===0) {alert("ATTENTION GO TO SETTING CHANNEL");}
        else {
            nbOfMdaConfiguration = nbOfMdaConfiguration + 1 ;
            var id = nbOfMdaConfiguration ;  
            if(entete === false) {
                $("#mdac_param").append("<table id='mdac_param_table' class='table table-striped'></table>"); entete = true ;
                $("#mdac_param_table").append("<thead><tr><th>&nbsp;Use this channel ?</th><th>Exposure time (ms)</th><th>Z-offset (um)</th><th>Configuration</th><th>Z-stack</th><th>Skip Frame</th><th>Action</th></tr></thead>");
            }
            $("#mdac_param_table").append("<tr id='tr"+id+"'><td>&nbsp;&nbsp;&nbsp;&nbsp;<input id='mdac_param_use"+id+"' type='checkbox'/></td><td><input id='mdac_param_exposure"+id+"' type='number' min='0' value='10'/></td><td><input id='mdac_param_zoffset"+id+"' type='number' min='0' value='10'/></td><td><select id='mdac_param_configuration"+id+"' ></select></td><td><input id='mdac_param_zstack"+id+"' type='checkbox'/></td><td><input id='mdac_param_skipframe"+id+"' type='number' min='0' value='10'/></td><td><button class='setting_button' id='mdac_param_delete"+id+"' ><img src='icons/cross.png'></button></td></tr>");
            for(var scan=0; scan<data.length;scan++) {
                if(scan ===0)requestWS("setMDAChannelsConfiguration=0,10,10,"+data[scan]['name']+"--"+data[scan]['device']+",0,10,"+id);
                $("#mdac_param_configuration"+id).append("<option value='"+data[scan]['id']+"'>"+data[scan]['name']+"--"+data[scan]['device']+"</option>");
            }
           
        }
    }
    $(document).on('click', 'input', function () {
        if(this.id.indexOf('mdac_param_use') !== -1){
            if($("#"+this.id).is(":checked")){ requestWS("setMDAChannelsConfigurationUse=1,"+this.id.replace('mdac_param_use',''));}
            else { requestWS("setMDAChannelsConfigurationUse=0,"+this.id.replace('mdac_param_use',''));}
        }
        if(this.id.indexOf('mdac_param_zstack') !== -1){
            if($("#"+this.id).is(":checked")){ requestWS("setMDAChannelsConfigurationZstack=1,"+this.id.replace('mdac_param_zstack',''));}
            else { requestWS("setMDAChannelsConfigurationZstack=0,"+this.id.replace('mdac_param_zstack',''));}
        }
    });
    $(document).on('click', 'span', function () {
        if(this.id.indexOf('setting_button_load_channel') !== -1){
            order = 'LoadSettingChannelsConfiguration';
            requestWS("LoadSettingChannelsConfiguration,"+this.id.substr(28,this.id.length));
            ref = this.id.substr(28,this.id.length);
            $("#name_configChannels").empty();
            $("#name_configChannels").append('<span>Configuration loaded: '+listConfigChannel[parseInt(this.id.substr(28,this.id.length))]+'</span>');
            //alert('LOAD');
            }
        if(this.id.indexOf('live_olympusix81') !== -1){
                    $.confirm({
                        title: "OLYMPUS-IX-81",
                        theme: "modern",
                        content: 'url:form/olympusix81.html',
                        columnClass: 'col-md-8',
                        onContentReady: function () {
                            var self = this;
                            /*if(nodeParameters.data.xPosition === 0) self.$content.find('.xPosition').val(data['xPosition']);
                            else self.$content.find('.xPosition').val(nodeParameters.data.xPosition);
                            if(nodeParameters.data.yPosition === 0) self.$content.find('.yPosition').val(data['yPosition']);
                            else self.$content.find('.yPosition').val(nodeParameters.data.yPosition);
                            if(nodeParameters.data.zPosition === 0) self.$content.find('.zPosition').val(data['zPosition']);
                            else self.$content.find('.zPosition').val(nodeParameters.data.zPosition);
                            self.$content.find('.res1').val(nodeParameters.data.res1);
                            self.$content.find('.res2').val(nodeParameters.data.res2);*/
                        },
                        buttons: {
                            update: {
                                text: 'Update', // text for button
                                btnClass: 'btn-green', // class for the button
                                isHidden: false, // initially not hidden
                                isDisabled: false, // initially not disabled
                                action: function(markorreplace){
                                    
                                    return false;
                                }
                            },
                            gotoposition: {
                                text: 'Go to position', // text for button
                                btnClass: 'btn-green', // class for the button
                                isHidden: false, // initially not hidden
                                isDisabled: false, // initially not disabled
                                action: function(gotoposition){
                                    
                                    return false;
                                }
                            },
                            quit: {
                                btnClass: 'btn-red',
                                action: function(){
                                    //, // class for the button
                                /*    var xPosition = this.$content.find('.xPosition').val();
                                    var yPosition = this.$content.find('.yPosition').val();
                                    var zPosition = this.$content.find('.zPosition').val();
                                    var res1 = this.$content.find('.res1').val();
                                    var res2 = this.$content.find('.res2').val();
                                    if(!xPosition){$.alert('provide a valid xPosition');return false;
                                    } else nodeParameters.data.xPosition = xPosition ;
                                    if(!yPosition){$.alert('provide a valid yPosition');return false;
                                    } else nodeParameters.data.yPosition= yPosition ;
                                    if(!zPosition){$.alert('provide a valid zPosition');return false;
                                    } else nodeParameters.data.zPosition = zPosition ;
                                    if(!res1){$.alert('provide a valid res1');return false;
                                    } else nodeParameters.data.res1 = res1 ;
                                    if(!res2){$.alert('provide a valid res2');return false;
                                    } else nodeParameters.data.res2 = res2 ;
                                    $.alert('Your paramaters are saving');
                                    openBox = false ;*/
                                    return true ;
                                }
                            }
                        }
                    });










        }    
            
            
    });
    var ref ;
    $(document).on('change', "input", function () {
        if(this.id.indexOf('mdac_param_exposure') !== -1){
            requestWS("setMDAChannelsConfigurationExposure="+$("#"+this.id).val()+","+this.id.replace('mdac_param_exposure',''));
        }
        if(this.id.indexOf('mdac_param_zoffset') !== -1){
            requestWS("setMDAChannelsConfigurationZoffset="+$("#"+this.id).val()+","+this.id.replace('mdac_param_zoffset',''));
        }
        if(this.id.indexOf('mdac_param_skipframe') !== -1){
            requestWS("setMDAChannelsConfigurationSkipframe="+$("#"+this.id).val()+","+this.id.replace('mdac_param_skipframe',''));
        }
    });
    $(document).on('change', "select", function () {
        if(this.id.indexOf('mdac_param_configuration') !== -1){
            requestWS("setMDAChannelsConfigurationChannel="+$("#"+this.id).find(":selected").text()+","+this.id.replace('mdac_param_configuration',''));
        }
    });
  


////////////

  $(document).on('click', '.setting_button', function () {
        var id = this.id; //setting_button_add_channel
        if(id=='setting_button_new_configChannel'){
            $.confirm({
                title: "Settings name",
                theme: "modern",
                columnClass: 'col-md-4',
                closeIcon : true,
                content: '' +'<form action="">' +'<input type="text" placeholder="configuration 1" class="name" required /><br>' +'</form>',
                buttons: {
                    formSubmit: {
                        text: 'valid',
                        btnClass: 'btn-blue',
                        action: function () {
                            var name = this.$content.find('.name').val();
                            if(!name){$.alert('provide a valid name');return false;}
                            else {
                                    requestWS("configChannels,"+name);
                                    $("#name_configChannels").empty();
                                    ref = listConfigChannel.length ;
/*                                    $("#name_configChannels").append('<span>Configuration: '+name+';json</span>');
                                    
                                    $("#available_configChannels").append('<span name="'+name+'" id="setting_button_load_channel_'+listConfigChannel.length+'" class="drag-source" draggable="true" ondragstart="event.dataTransfer.setData(\'text/plain\', \''+name+'\');"><img src="icons/wrench.png">&nbsp;'+name+'</span>&nbsp;&nbsp;&nbsp;');
 */
                                    order = 'listConfigChannel';
                                    requestWS(order);
                                    $("#setting_table_channel").empty();
                                    $("#available_channels_mda").empty();
                                    $("#name_configChannels").append('<span>Configuration: '+name+'.json</span>');
                                    nbOfSettingsChannels = -1;
                                    settingschannels = [];
                                }
                            $.alert('You can add a different channels !');
                        }
                    }
                },
                onContentReady: function () {
                    var jc = this;
                    this.$content.find('form').on('submit', function (e) {
                        e.preventDefault();
                        jc.$$formSubmit.trigger('click'); // reference the button and click it
                    });
                }
            });
        }
              
        if(id=='setting_button_add_channel'){
            if(nbOfSettingsChannels  === -1) nbOfSettingsChannels  = 0 ;
            nbOfSettingsChannels = nbOfSettingsChannels + 1 ;
            //$("#label_config").show();
            //$("#name_config").show();
//
            $("setting_button_save_channel").hide();
            $("#setting_table_channel").append('<table id="channel'+nbOfSettingsChannels+'" class="table table-striped"></table>');
            $("#channel"+nbOfSettingsChannels).append("<thead><tr><th></th><th>Name Channel</th><th>Light Source</th><th style='width:500px;'></th><th></th><th></th><th></th><th></th></tr></thead>");
            $("#channel"+nbOfSettingsChannels).append("<tbody><tr><td id='chk"+nbOfSettingsChannels+"'></td><td id='"+nbOfSettingsChannels+"_name'></td><td id='option"+nbOfSettingsChannels+"'></td><td id='config"+nbOfSettingsChannels+"'></td><<td id='delete"+nbOfSettingsChannels+"'></td></tr></tbody>");
            $("#"+nbOfSettingsChannels+"_name").append("<input required name='"+nbOfSettingsChannels+"_channel' id='"+nbOfSettingsChannels+"_channel 'type='text' placeholder='channel " + nbOfSettingsChannels + "'/>");
            $("#option"+nbOfSettingsChannels).append("<select class='settings_select_device' name='"+nbOfSettingsChannels+"_devices' id='"+nbOfSettingsChannels+"_devices'></select>");
            var saveId = -1;
            for(var i=0; i<ressources.length;i++){
                if(ressources[i]['type'] == 'ligth-source'){if(saveId === -1) saveId = i ;$('#'+nbOfSettingsChannels+'_devices').append("<option value=" + i + ">" + ressources[i]['device']  + "</option>");}
            }
            //alert('#config '+nbOfSettingsChannels);
            buidFormSettingsChannels('#config',saveId,nbOfSettingsChannels);
            $("#delete"+nbOfSettingsChannels).append("<button class='setting_button' name='settingchannels_del"+nbOfSettingsChannels+"' id='settingchannels_del"+nbOfSettingsChannels+"'><img src='icons/cross.png'></button>");
        if(nbOfSettingsChannels === -1) {$("#setting_button_save_channel").prop('disabled',true);}
        else { $("#setting_button_save_channel").prop('disabled',false);}
        }
        if(id=='setting_button_load_channel'){
            order = 'LoadSettingChannelsConfiguration';
            requestWS("LoadSettingChannelsConfiguration");
        }
      
        if(id.indexOf('settingchannels_del') !== -1){
            if (confirm("Delete this channel ?")) {
              $("#channel"+id.replace('settingchannels_del','')).remove();
            }
        }
        if(id.indexOf('mdac_param_delete') !== -1){
            if (confirm("Delete this configuration ?")) {
              $("#tr"+id.replace('mdac_param_delete','')).remove();
              requestWS("MDAChannelsConfigurationRemove="+id.replace('mdac_param_delete',''));
            }
        }
  });
  
    $(document).on('change', '.settings_select_device', function () {
        var id = this.id; 
        var selection = id.replace("_devices","");
        $('#config'+selection).closest("td").empty();
        buidFormSettingsChannels('#config',$(this).val(),selection);
    });

    function buidFormSettingsChannels(where,target,selection){
        //alert(where+target+selection);
        //alert(ressources);
        //keep light-source
/*        for(var key in ressources[target]["config"]) {
        }*/
        for(var key in ressources[target]["config"]) {
            for(var element=0; element<ressources[target]['config'][key].length;element++){
                $("#config"+selection).append(ressources[target]['config'][key][element].replace(/%/gi, selection+"_")+"&nbsp;");
                if(ressources[target]['config'][key][element].indexOf('select') !==-1){
                    //alert('#'+selection+"_"+key+element+" option[value='"+ressources[target]['update'][key][element]+"']");
                    $('#'+selection+"_"+key+element+" option[value='"+ressources[target]['update'][key][element]+"']").prop('selected', true);
                }
                if(ressources[target]['config'][key][element].indexOf('number') !==-1) $('#'+selection+"_"+key+element).val(ressources[target]['update'][key][element]);
            }
            $("#config"+selection).append("<br>");      
        }
    }

    $(document).ready(function(){
        $("#alert-warning").hide();
        $("#alert-success").hide();
        wait();
    });
  
    function alertmessage(msg,classmsg){
      /*$(classmsg).append(msg);
      $(classmsg).show();
      setTimeout(function(){
          $(classmsg).hide();
          $(classmsg).empty();
          },2000);*/
        $.alert({
             title: "Saving parameters",
             theme: "modern",
             content : "SUCCESS !"
        });
  }
    
    function test(){
      var tree = $("#tree").fancytree("getTree");
      var d = tree.toDict(true);
      //d['type'] = 'mda';
      requestWS(JSON.stringify(d));
      //alert("cool raoul");
    }

    function editTree(){
        
        var node = $("#tree").fancytree("getActiveNode");
        if(node.type === 'CAMERA'){
            $.confirm({
                title: "Settings: "+node.title,
                theme: "modern",
                closeIcon : true,
                content: '' +'<form action="" class="formName">' +'<div class="form-group">' +'<label>Time exposure (ms)</label>' +'<input type="number" class="time form-control" required value="'+node.data.time+'"/>' +'<label>Number of picture</label>' +'<input type="number" class="number form-control" required value="'+node.data.number+'"/>' +'<label>Z offset</label>' +'<input type="number" class="zoffset form-control" required value="'+node.data.zoffset+'"/>' +'<label>Skip picture</label>' +'<input type="number" class="skip form-control" required value="'+node.data.skip+'"/>' +'</div>' +'</form>',
                buttons: {
                    formSubmit: {
                        text: 'valid',
                        btnClass: 'btn-blue',
                        action: function () {
                            var time = this.$content.find('.time').val();
                            var skip = this.$content.find('.skip').val();
                            var zoffset = this.$content.find('.zoffset').val();
                            var number = this.$content.find('.number').val();
                            if(!time){$.alert('provide a valid time');return false;
                            } else node.data.time = time ;
                            if(!skip){$.alert('provide a valid skip');return false;
                            } else node.data.skip = skip ;
                            if(!zoffset){$.alert('provide a valid zoffset');return false;
                            } else node.data.zoffset = zoffset ;
                            if(!number){$.alert('provide a valid number');return false;
                            } else node.data.number = number ;
                            $.alert('Your paramaters are saving');
                        }
                    }
                },
                onContentReady: function () {
                    var jc = this;
                    this.$content.find('form').on('submit', function (e) {
                        e.preventDefault();
                        jc.$$formSubmit.trigger('click'); // reference the button and click it
                    });
                }
            });
        }
        if(node.type === 'LOOP'){
            $.confirm({
                title: "Settings: "+node.title,
                theme: "modern",
                closeIcon : true,
                content: '' +'<form action="" class="formName">' +'<div class="form-group">' +'<label>Time (min)</label>' +'<input type="number" class="time form-control" required value="'+node.data.time+'"/>' +'<label>Repeat</label>' +'<input type="number" class="repeat form-control" required value="'+node.data.repeat+'"/>' +'</div>' +'</form>',
                buttons: {
                    formSubmit: {
                        text: 'valid',
                        btnClass: 'btn-blue',
                        action: function () {
                            var time = this.$content.find('.time').val();
                            var repeat = this.$content.find('.repeat').val();
                            if(!time){$.alert('provide a valid time');return false;
                            } else node.data.time = time ;
                            if(!repeat){$.alert('provide a valid repeat');return false;
                            } else node.data.repeat = repeat ;
                            $.alert('Your paramaters are saving');
                        }
                    }
                },
                onContentReady: function () {
                    // bind to events
                    var jc = this;
                    this.$content.find('form').on('submit', function (e) {
                        e.preventDefault();
                        jc.$$formSubmit.trigger('click');
                    });
                }
            });
        }
        if(node.type === 'LIGHT'){
            $.confirm({
                title: "Settings: "+node.title,
                theme: "modern",
                closeIcon : true,
                content: '' +'<form action="" class="formName">' +'<div class="form-group">' +'<label>Time exposure (ms)</label>' +'<input type="number" class="time form-control" required value="'+node.data.time+'"/>' +'<label>Wheel filter</label>' +'<input type="number" min="1" max="6" class="wheel form-control" required value="'+node.data.wheel+'"/>' +'<label>Skip channel</label>' +'<input type="number" class="skip form-control" required value="'+node.data.skip+'"/>' +'<label>Color</label>'+'<input type="color" class="color form-control" required   value="'+node.data.color+'"/>' +'</div>' +'</form>',
                buttons: {
                    formSubmit: {
                        text: 'valid',
                        closeIcon : true,
                        btnClass: 'btn-blue',
                        action: function () {
                            var time = this.$content.find('.time').val();
                            var color = this.$content.find('.color').val();
                            var wheel = this.$content.find('.wheel').val();
                            var skip  = this.$content.find('.skip').val();
                            if(!time){$.alert('provide a valid time');return false;
                            } else node.data.time = time ;
                            if(!color){$.alert('provide a valid color');return false;
                            } else node.data.color = color ;
                            if(!skip){$.alert('provide a valid skip');return false;
                            } else node.data.skip = skip ;
                            if(!wheel){$.alert('provide a valid wheel');return false;
                            } else node.data.wheel = wheel ;
                            $.alert('Your paramaters are saving');
                        }
                    }
                },
                onContentReady: function () {
                    var jc = this;
                    this.$content.find('form').on('submit', function (e) {
                        e.preventDefault();
                        jc.$$formSubmit.trigger('click'); // reference the button and click it
                    });
                }
            });
        }
        if(node.type === 'AF'){
            order = 'autoFocus' ;
            $.confirm({
                title: "Settings: "+node.title,
                theme: "modern",
                columnClass: 'col-md-8',
                closeIcon : true,
                content: '' +
                    '<form action="" >' +
                    '<label style="width:220px;">Lower limit [relative, um]</label>' +
                    '<input style="width:150px;" type="number" class="lower" required value="'+node.data.lower+'"/><br>' +
                    '<label style="width:220px;">Upper limit [relative, um]</label>' +
                    '<input style="width:150px;" type="number" class="upper" required value="'+node.data.upper+'"/><br>' +
                    '<label style="width:220px;">Objective Type</label>' +
                    '' +
                    '</form>',
                buttons: {
                    tryit: {
                        text: 'Try it !', // text for button
                        btnClass: 'btn-green', // class for the button
                        //keys: ['enter', 'a'], // keyboard event for button
                        isHidden: false, // initially not hidden
                        isDisabled: false, // initially not disabled
                        action: function(tryitButton){
                            order = 'tryAutoFocus';
                            requestWS('tryAutoFocus,lower='+this.$content.find(".lower").val()+',upper='+this.$content.find(".upper").val()+',aftbl='+this.$content.find(".aftbl").val());
                            return false;
                        }
                    },
                    formSubmit: {
                        text: 'valid',
                        closeIcon : true,
                        btnClass: 'btn-blue',
                        action: function () {
                            var upper = this.$content.find('.upper').val();
                            var lower = this.$content.find('.lower').val();
                            var aftbl = $('.aftbl').find(":selected").text(); //this.$content.find('.aftbl').val();
                            //alert();
                            if(!upper){$.alert('provide a valid upper');return false;
                            } else node.data.upper = upper ;
                            if(!lower){$.alert('provide a valid lower');return false;
                            } else node.data.lower = lower ;
                            node.data.aftbl = aftbl;
                            $.alert('Your paramaters are saving');
                        }
                    }
                },
                onContentReady: function () {
                    $(".aftbl option[name='"+node.data.aftbl+"']").prop('selected', true);
                    var jc = this;
                    this.$content.find('form').on('submit', function (e) {
                        e.preventDefault();
                        jc.$$formSubmit.trigger('click'); // reference the button and click it
                    });
                }
            });

        }
        if(node.type === 'XYZ'){
            order = 'getValueXYZ';
            nodeParameters = node;
            requestWS('getValueXYZ');
        }

        if(node.type === 'ZS'){
            if(node.data.shutter) var check = 'checked' ;
            $.confirm({
                title: "Settings: "+node.title,
                theme: "modern",
                columnClass: 'col-md-8',
                closeIcon : true,
                content: '' +'<form action="">' +'<label style="width:220px;">Skip z-stack</label>' +'<input style="width:220px;" type="number" class="skip" required value="'+node.data.skip+'"/><br>' +'<label style="width:220px;">Z-start, relative[um]</label>' +'<input style="width:220px;" type="number" max="0" class="zstart" required value="'+node.data.zstart+'"/><br>'+'<label style="width:220px;">Z-end, relative [um]</label>' +'<input style="width:220px;" type="number" min="0" class="zend" required value="'+node.data.zend+'"/><br>' +'<label style="width:220px;">Z-Step [um]</label>' +'<input style="width:220px;" type="number" class="zstep" required value="'+node.data.zstep+'"/><br>' +'<br>'+'<label style="width:220px;">Keep shutter open</label>' +'<input type="checkbox" class="shutter" required '+check+'/>' +'</form>',
                buttons: {
                    formSubmit: {
                        text: 'valid',
                        btnClass: 'btn-blue',
                        action: function () {
                            var skip = this.$content.find('.skip').val();
                            var zstart = this.$content.find('.zstart').val();
                            var zend = this.$content.find('.zend').val();
                            var zstep = this.$content.find('.zstep').val();
                            var shutter  = $(".shutter").is(":checked");
                            if(!skip){$.alert('provide a valid skip');return false;
                            } else node.data.skip = skip ;
                            if((zstart)===(zend)){$.alert('provide a valid zstart and zend');return false;}
                            if((!zstart)||(zstart>0)){$.alert('provide a valid zstart');return false;
                            } else node.data.zstart = zstart ;
                            if((!zend)||(zend<0)){$.alert('provide a valid zend');return false;
                            } else node.data.zend = zend ;
                            if((!zstep)||(zstep>1)){$.alert('provide a valid zstep');return false;
                            } else node.data.zstep = zstep ;
                            node.data.shutter = shutter ;
                            $.alert('Your paramaters are saving');
                        }
                    }
                },
                onContentReady: function () {
                    var jc = this;
                    this.$content.find('form').on('submit', function (e) {
                        e.preventDefault();
                        jc.$$formSubmit.trigger('click'); // reference the button and click it
                    });
                }
            });
        }
        
    }