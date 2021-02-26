
    var treeName = 'empty.json';
    
    var CLIPBOARD = null;
    
  $(function(){
      $("#tree").fancytree({
        checkbox: false,
        tooltip: function(event, data) {
          var node = data.node;
          if( node.type === "PROT" )   return "Protocole";
          if( node.type === "LOOP" )   return "Sequence";
          if( node.type === "XYZ" )   return "XYZ position";
          if(node.type === "ZS+SC")   return "ZS+SC";
          if(node.type === "ZS+SC+M")   return "ZS+SC+M";
          if(node.type === "SP+SC")   return "SP+SC";
          if(node.type === "SP+SC+M")   return "SP+SC+M";
          if(node.type === "GROUP")   return "Group position";
          if(node.type === "AF")   return "Autofocus";
          if(node.type === "DELAY")   return "Delay";
          if(node.type === "FUNC") return "Function";
          if(node.type === "MFV") return "MicroFluidics Valves";

        },
        icon: function(event, data) {
          var node = data.node;
          if( node.type === "PROT" )  { newSourceOptionId = node.data.config; return "../icons/protocol.png";}
          if( node.type === "LOOP" )   return "../icons/arrow_rotate_clockwise.png";
          if(node.type === "XYZ")   return "../icons/yxz-512.png";
          if(node.type === "ZS+SC")  return "../icons/flag_blue.png";
          if(node.type === "ZS+SC+M")      return "../icons/flag_green.png";
          if(node.type === "SP+SC")      return "../icons/flag_red.png";
          if(node.type === "SP+SC+M")   return "../icons/flag_purple.png";
          if( node.type === "GROUP" )  return "../icons/text_list_numbers.png";
          if( node.type === "DELAY" )  return "../icons/clock.png";
          if(node.type === "AF") return "../icons/autofocus.png";
          if(node.type === "FUNC") return "../icons/lightning.png";
          if(node.type === "MFV") return "../icons/controller.png";
        },
        titlesTabbable: true,
        quicksearch: true,
        source: { url: "../protocol.json" },
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
            data.dataTransfer.dropEffect = "move";
            return true;
          },
          dragOver: function(node, data) {
          data.dataTransfer.dropEffect = "move";
          },
          dragLeave: function(node, data) {
          },
          dragDrop: function(node, data) {
            var transfer = data.dataTransfer;
            node.debug("drop", data);
              if( data.otherNode ) {
                var sameTree = (data.otherNode.tree === data.tree);
                data.otherNode.moveTo(node, data.hitMode);
              }
              else if( data.otherNodeData ) {
                node.addChild(data.otherNodeData, data.hitMode);
              }
              else {
                var typeOfNode = '';
                if(transfer.getData("text")=='Autofocus') typeOfNode = 'AF' ;
                else if(transfer.getData("text")=='Z-Stack + Setting channel') typeOfNode = 'ZS+SC' ;
                else if(transfer.getData("text")=='Z-Stack + Setting channel + Mosaic') typeOfNode = 'ZS+SC+M' ;
                else if(transfer.getData("text")=='Simple Picture + Setting channel') typeOfNode = 'SP+SC' ;
                else if(transfer.getData("text")=='Simple Picture + Setting channel + Mosaic') typeOfNode = 'SP+SC+M' ;
                else if(transfer.getData("text")=='Delay') typeOfNode = 'DELAY' ;
                else if(transfer.getData("text")=='XYZ-position') typeOfNode = 'XYZ' ;
                else if(transfer.getData("text")=='Group Position') typeOfNode = 'GROUP' ;
                else if(transfer.getData("text")=='Sequence') typeOfNode = 'LOOP' ;
                else if(transfer.getData("text")=='Function') typeOfNode = 'FUNC' ;
                else if(transfer.getData("text")=='MicroFluidics Valves') typeOfNode = 'MFV' ;
                else {typeOfNode = "LIGHT";}
                
                if(typeOfNode==="AF"){
                  node.addNode({
                    title: transfer.getData("text"),
                    objectif: "undefined",
                    range: 0,
                    zoffset: 0,
                    type : typeOfNode
                    }, data.hitMode);  
                }
                if(typeOfNode==="LOOP"){
                  node.addNode({
                    title: transfer.getData("text"),
                    nb_repetition: 0,
                    time_per_repetition: 0,
                    type : typeOfNode
                    }, data.hitMode);  
                }
                if(typeOfNode==="XYZ"){
                  node.addNode({
                    title: transfer.getData("text"),
                    xPosition : 0,
                    yPosition : 0,
                    zPosition : 0,
                    type : typeOfNode
                    }, data.hitMode);  
                }
                if(typeOfNode==="ZS+SC"){
                  node.addNode({
                    title: transfer.getData("text"),
                    z_position: 0,
                    far_limit: 0,
                    near_limit: 0,
                    step: 0,
                    keep_shutter_on_wzs: true,
                    setting_channel_name: "undefined",
                    exposure_time: 0,
                    type : typeOfNode
                    }, data.hitMode);
                }
                if(typeOfNode==="ZS+SC+M"){
                    node.addNode({
                        title: transfer.getData("text"),
                        z_position: 0,
                        far_limit: 0,
                        near_limit: 0,
                        step: 0,
                        keep_shutter_on_wzs: true,
                        setting_channel_name: "undefined",
                        mosaic_mask_name: "undefined",
                        exposure_time: 0,
                        type : typeOfNode
                          }, data.hitMode);  
                  }
                  if(typeOfNode==="SP+SC"){
                    node.addNode({
                        title: transfer.getData("text"),
                        setting_channel_name: "undefined",
                        exposure_time: 0,
                        type : typeOfNode
                          }, data.hitMode);  
                  }
                    if(typeOfNode==="SP+SC+M"){
                  node.addNode({
                    title: transfer.getData("text"),
                    setting_channel_name: "undefined",
                        mosaic_mask_name: "undefined",
                        exposure_time: 0,
                    type : typeOfNode
                    }, data.hitMode);  
                }
                if(typeOfNode==="DELAY"){
                  node.addNode({
                    title: transfer.getData("text"),
                    time: 0,
                    type : typeOfNode
                    }, data.hitMode);  
                }
                if(typeOfNode==="GROUP"){
                  node.addNode({
                    title: transfer.getData("text"),
                    
                    type : typeOfNode
                    }, data.hitMode);  
                }
                if(typeOfNode==="FUNC") {
                  node.addNode({
                    title: transfer.getData("text"),
                    function_name: "undefined",
                    type : typeOfNode
                    }, data.hitMode);  
                }
                if(typeOfNode==="MFV") {
                  node.addNode({
                    title: transfer.getData("text"),
                    valve_1: "Close",
                    valve_2: "Close",
                    valve_3: "Close",
                    valve_4: "Close",
                    valve_5: "Close",
                    type : typeOfNode
                    }, data.hitMode);  
                }
              }
              node.setExpanded();
          }
        },
        edit: {
          triggerStart: ["dblclick", "f2", "mac+enter", "shift+click"],
          close: function(event, data) {
            if( data.save && data.isNew ){
              $("#tree").trigger("nodeCommand", {cmd: "addSibling"});
            }
          }
        },
        table: {
          indentation: 20,
          nodeColumnIdx: 0
        },
        gridnav: {
          autofocusInput: false,
          handleCursorKeys: true
        },
        createNode: function(event, data) {
          var node = data.node,
          $tdList = $(node.tr).find(">td");
        },
        renderColumns: function(event, data) {
          var node = data.node,
          $tdList = $(node.tr).find(">td");
          //console.log(node.key);
          $tdList.eq(0).find("input").val("node.key");
          if(false) {
            $tdList.eq(1).html('<button onClick="editTree();"><img src="../icons/wrench.png"></button>');
          }
          else if (node.type == 'PROT') {
            $tdList.eq(1).html('<button onClick="editTree();"><img src="../icons/wrench.png"></button>');
          }
          else if (node.type == 'AF') {
            var timestamp = new Date().getTime().toString();
            node.key = timestamp;
            $tdList.eq(2).html('<button onClick="updateAutoFocus(\'' + node.key + "-info" + "\',\'" + node.key + '\')" title="Update autofocus"><img src="../icons/map_edit.png"></button>');
            $tdList.eq(4).html('<div id="' + node.key + "-info" + '">Objectif: '+node.data.objectif+' Z-Offset: ' + node.data.zoffset + '</div>');
            if (node.data.objectif == "undefined" && node.data.zoffset == 0) {
              console.log("OKOKOK");
              updateAutoFocus(node.key + "-info", node.key)
            }
          }
          else if (node.type == 'LOOP') {
            var timestamp = new Date().getTime().toString();
            node.key = timestamp;
            $tdList.eq(1).html('<button onClick="editTree();"><img src="../icons/wrench.png"></button>');
            $tdList.eq(4).html('<div id="' + node.key + "-info" + '">Nb rep: '+node.data.nb_repetition+' Time per rep: ' + node.data.time_per_repetition + 'min</div>');

          }
          else if (node.type == 'XYZ') {
            
            var timestamp = new Date().getTime().toString();
               node.key = timestamp;
               $tdList.eq(2).html('<button onClick="updateNodePosition(\'' + node.key + "-info" + "\',\'" + node.key + '\')" title="Update position"><img src="../icons/map_edit.png"></button>');
               $tdList.eq(3).html('<button onClick="goToNodePosition(\'' + node.key + "-info" + '\')" title="Go to position"><img src="../icons/map_go.png"></button>');
               $tdList.eq(4).html('<div id="' + node.key + "-info" + '">X:Y:Z => ' + node.data.xPosition +':'+node.data.yPosition+':'+node.data.zPosition+'</div>');
             if (node.data.xPosition == 0 && node.data.yPosition == 0 && node.data.zPosition == 0) {
              updateNodePosition(node.key + "-info", node.key);
             }

           //POST X Y Z
           // eq(4) >> Info = X=....;Y=....;Z=....
          }
          else if (node.type == 'ZS+SC') {

            var timestamp = new Date().getTime().toString();
            node.key = timestamp;
            if (node.data.far_limit == 0 && node.data.near_limit == 0 && node.data.step == 0 && node.data.setting_channel_name == "undefined" && node.data.exposure_time == 0) {
              node.data.exposure_time = parseInt($("#exposure-time").val());
              if ($("#position-z").text() == "Loading...") {
                node.data.position_z = "Error";
              }
              else {
                node.data.position_z = $("#position-z").text();
              }
              if ($("#setting-channel-to-apply :selected").text() != "Select a setting channel...") {
                node.data.setting_channel_name = $("#setting-channel-to-apply :selected").text();
              } 
            }
            $tdList.eq(1).html('<button onClick="editTree();"><img src="../icons/wrench.png"></button>');
            $tdList.eq(4).html('<div id="' + node.key + "-info" + '">Z-Position: '+node.data.position_z+' far/near limit: ' +node.data.far_limit+'um/'+node.data.near_limit+'um Step: '+node.data.step+'um SC: '+node.data.setting_channel_name+' ET: '+node.data.exposure_time+'ms</div>');

          }
          else if (node.type == 'ZS+SC+M') {
            var timestamp = new Date().getTime().toString();
            node.key = timestamp;
            if (node.data.far_limit == 0 && node.data.near_limit == 0 && node.data.step == 0 && node.data.setting_channel_name == "undefined" && node.data.mosaic_mask_name == "undefined" && node.data.exposure_time == 0) {
              node.data.exposure_time = parseInt($("#exposure-time").val());
              if ($("#position-z").text() == "Loading...") {
                node.data.postion_z = "Error";
              }
              else {
                node.data.position_z = $("#position-z").text();
              }
              if ($("#setting-channel-to-apply :selected").text() != "Select a setting channel...") {
                node.data.setting_channel_name = $("#setting-channel-to-apply :selected").text();
              }
              if ($("#mosaic-mask-to-apply :selected").text() != "Select a mosaic mask...") {
                node.data.mosaic_mask_name = $("#mosaic-mask-to-apply :selected").text();
              } 
            }
            $tdList.eq(1).html('<button onClick="editTree();"><img src="../icons/wrench.png"></button>');
            $tdList.eq(4).html('<div id="' + node.key + "-info" + '">Z-Position: '+node.data.position_z+' far/near limit: ' +node.data.far_limit+'um/'+node.data.near_limit+'um Step: '+node.data.step+'um SC: '+node.data.setting_channel_name+' MM: '+node.data.mosaic_mask_name+' ET: '+node.data.exposure_time+'ms</div>');

          }
          else if (node.type == 'SP+SC') {
            var timestamp = new Date().getTime().toString();
            node.key = timestamp;
            if (node.data.setting_channel_name == "undefined" && node.data.exposure_time == 0) {
              if ($("#setting-channel-to-apply :selected").text() != "Select a setting channel...") {
                node.data.setting_channel_name = $("#setting-channel-to-apply :selected").text();
              }
              node.data.exposure_time = parseInt($("#exposure-time").val());
            }
            $tdList.eq(1).html('<button onClick="editTree();"><img src="../icons/wrench.png"></button>');
            $tdList.eq(4).html('<div id="' + node.key + "-info" + '">SC: '+node.data.setting_channel_name+' ET: '+node.data.exposure_time+'ms</div>');

          }
          else if (node.type == 'SP+SC+M') {
            var timestamp = new Date().getTime().toString();
            node.key = timestamp;
            if (node.data.setting_channel_name == "undefined" && node.data.mosaic_mask_name == "undefined" && node.data.exposure_time == 0) {
              if ($("#setting-channel-to-apply :selected").text() != "Select a setting channel...") {
                node.data.setting_channel_name = $("#setting-channel-to-apply :selected").text();
              }
              if ($("#mosaic-mask-to-apply :selected").text() != "Select a mosaic mask...") {
                node.data.mosaic_mask_name = $("#mosaic-mask-to-apply :selected").text();
              } 
              node.data.exposure_time = parseInt($("#exposure-time").val());
            }
            $tdList.eq(1).html('<button onClick="editTree();"><img src="../icons/wrench.png"></button>');
            $tdList.eq(4).html('<div id="' + node.key + "-info" + '">SC: '+node.data.setting_channel_name+' MM: '+node.data.mosaic_mask_name+' ET: '+node.data.exposure_time+'ms</div>');

          }
          else if (node.type == 'DELAY') {
            var timestamp = new Date().getTime().toString();
            node.key = timestamp;
            $tdList.eq(1).html('<button onClick="editTree();"><img src="../icons/wrench.png"></button>');
            $tdList.eq(4).html('<div id="' + node.key + "-info" + '">Delay (ms): '+node.data.time+'</div>');

          }
          else if (node.type == 'GROUP') {
            var timestamp = new Date().getTime().toString();
            node.key = timestamp;

          }
          else if (node.type == 'FUNC') {
            var timestamp = new Date().getTime().toString();
            node.key = timestamp;

          }
          else if (node.type == 'MFV') {
            var timestamp = new Date().getTime().toString();
            node.key = timestamp;
            $tdList.eq(1).html('<button onClick="editTree();"><img src="../icons/wrench.png"></button>');
            $tdList.eq(4).html('<div id="' + node.key + "-info" + '">V1: '+node.data.valve_1+' V2: '+node.data.valve_2+' V3: '+node.data.valve_3+' V4: '+node.data.valve_4+' V5: '+node.data.valve_5+'</div>');

          }

        }
      }).on("nodeCommand", function(event, data){
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
         //console.log( e, $.ui.fancytree.eventToString(e) ); //MORE FANCY TREE LOG HERE
    
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
    
    setTimeout(function(){
      $("#tree").fancytree("getTree").findFirst("protocol").setActive();
      $("#tree").fancytree("getTree").findFirst("protocol").setFocus(true);
    }, 300);


    /*var tree = $("#tree").fancytree("getTree");
    var d = tree.toDict(true);
    d['type'] = 'mda';
    (JSON.stringify(d));*/
//EVENT TRIGGER QUAND CLICK SUR CONFIG DE LA LIGNE
    function editTree(){

                                
        var node = $("#tree").fancytree("getActiveNode");
        //MODIF 1
        if(node.type === 'PROT'){
            
        }//MODIF1
        if(node.type === 'LOOP'){
          $.ajax({
            type: 'POST',
            url : '/mda-modals/show-sequence-modal',
            crossDomain: true,
            data: '{ "access_token": "' + userToken + '" }',
            contentType:'application/json; charset=utf-8',
            //dataType: 'json',
            success: function(data) { // data is already parsed !!
              document.getElementById("myModalSequenceContent").innerHTML = data;
              $('#nb-repetition-modal').val(node.data.nb_repetition);
              $('#time-per-repetition-modal').val(node.data.time_per_repetition);
              $('#myModalSequence').modal('toggle');
            },
            error: function(jqXHR, textstatus, errorThrown) {
              $.toast({
                heading: 'Error',
                text: 'Cant get your data, try again!',
                icon: 'error',
                loader: true,
                loaderBg: '#fff',
                showHideTransition: 'plain',
                hideAfter: 3000,
                position: {
                  left: 100,
                  top: 30
                }
              })
            }
          })
        }
        //MODIF 1
        if(node.type === 'XYZ'){
           
        }
        //MODIF 1
        if(node.type === 'AF'){
            
        }
        //MODIF 1
        if(node.type === 'DELAY'){
          $.ajax({
            type: 'POST',
            url : '/mda-modals/show-delay-modal',
            crossDomain: true,
            data: '{ "access_token": "' + userToken + '" }',
            contentType:'application/json; charset=utf-8',
            //dataType: 'json',
            success: function(data) { // data is already parsed !!
              document.getElementById("myModalDelayContent").innerHTML = data;
              $('#delay-modal').val(node.data.time);
              $('#myModalDelay').modal('toggle');
            },
            error: function(jqXHR, textstatus, errorThrown) {
              $.toast({
                heading: 'Error',
                text: 'Cant get your data, try again!',
                icon: 'error',
                loader: true,
                loaderBg: '#fff',
                showHideTransition: 'plain',
                hideAfter: 3000,
                position: {
                  left: 100,
                  top: 30
                }
              })
            }
          })
            
        }
        if(node.type === 'ZS+SC'){
          $.ajax({
            type: 'POST',
            url : '/mda-modals/show-zs-sc-modal',
            crossDomain: true,
            data: '{ "access_token": "' + userToken + '" }',
            contentType:'application/json; charset=utf-8',
            //dataType: 'json',
            success: function(data) { // data is already parsed !!
              document.getElementById("myModalZSPSCContent").innerHTML = data;
              if (node.data.setting_channel_name != "undefined") {
                $('#setting-channel-zs-sc-modal option:first').text(node.data.setting_channel_name);
              }
              $('#near-limit-zs-sc-modal').val(node.data.near_limit);
              $('#far-limit-zs-sc-modal').val(node.data.far_limit);
              $('#step-zs-sc-modal').val(node.data.step);
              $('#exposure-time-zs-sc-modal').val(node.data.exposure_time);
              $('#keep-shutter-on-zs-sc-modal').prop("checked", node.data.keep_shutter_on_wzs);
              $('#myModalZSPSC').modal('toggle');
            },
            error: function(jqXHR, textstatus, errorThrown) {
              $.toast({
                heading: 'Error',
                text: 'Cant get your data, try again!',
                icon: 'error',
                loader: true,
                loaderBg: '#fff',
                showHideTransition: 'plain',
                hideAfter: 3000,
                position: {
                  left: 100,
                  top: 30
                }
              })
            }
          })
        }
        //MODIF 1
        if(node.type === 'ZS+SC+M'){
          $.ajax({
            type: 'POST',
            url : '/mda-modals/show-zs-sc-mm-modal',
            crossDomain: true,
            data: '{ "access_token": "' + userToken + '" }',
            contentType:'application/json; charset=utf-8',
            //dataType: 'json',
            success: function(data) { // data is already parsed !!
              document.getElementById("myModalZSPSCPMMContent").innerHTML = data;
              if (node.data.setting_channel_name != "undefined") {
                $('#setting-channel-zs-sc-mm-modal option:first').text(node.data.setting_channel_name);
              }
              if (node.data.mosaic_mask_name != "undefined") {
                $('#mosaic-mask-zs-sc-mm-modal option:first').text(node.data.mosaic_mask_name);
              }
              $('#near-limit-zs-sc-mm-modal').val(node.data.near_limit);
              $('#far-limit-zs-sc-mm-modal').val(node.data.far_limit);
              $('#step-zs-sc-mm-modal').val(node.data.step);
              $('#exposure-time-zs-sc-mm-modal').val(node.data.exposure_time);
              $('#keep-shutter-on-zs-sc-mm-modal').prop("checked", node.data.keep_shutter_on_wzs);
              $('#myModalZSPSCPMM').modal('toggle');
            },
            error: function(jqXHR, textstatus, errorThrown) {
              $.toast({
                heading: 'Error',
                text: 'Cant get your data, try again!',
                icon: 'error',
                loader: true,
                loaderBg: '#fff',
                showHideTransition: 'plain',
                hideAfter: 3000,
                position: {
                  left: 100,
                  top: 30
                }
              })
            }
          })
        }
        if(node.type === 'SP+SC'){
          $.ajax({
            type: 'POST',
            url : '/mda-modals/show-sp-sc-modal',
            crossDomain: true,
            data: '{ "access_token": "' + userToken + '" }',
            contentType:'application/json; charset=utf-8',
            //dataType: 'json',
            success: function(data) { // data is already parsed !!
              document.getElementById("myModalSPPSCContent").innerHTML = data;
              if (node.data.setting_channel_name != "undefined") {
                $('#setting-channel-sp-sc-modal option:first').text(node.data.setting_channel_name);
              }
             $('#exposure-time-sp-sc-modal').val(node.data.exposure_time);
             $('#myModalSPPSC').modal('toggle');
            },
            error: function(jqXHR, textstatus, errorThrown) {
              $.toast({
                heading: 'Error',
                text: 'Cant get your data, try again!',
                icon: 'error',
                loader: true,
                loaderBg: '#fff',
                showHideTransition: 'plain',
                hideAfter: 3000,
                position: {
                  left: 100,
                  top: 30
                }
              })
            }
          })
            
        }
        if(node.type === 'SP+SC+M'){
          $.ajax({
            type: 'POST',
            url : '/mda-modals/show-sp-sc-mm-modal',
            crossDomain: true,
            data: '{ "access_token": "' + userToken + '" }',
            contentType:'application/json; charset=utf-8',
            //dataType: 'json',
            success: function(data) { // data is already parsed !!
              document.getElementById("myModalSPPSCPMMContent").innerHTML = data;
              if (node.data.setting_channel_name != "undefined") {
                $('#setting-channel-sp-sc-mm-modal option:first').text(node.data.setting_channel_name);
              }
              if (node.data.mosaic_mask_name != "undefined") {
                $('#mosaic-mask-sp-sc-mm-modal option:first').text(node.data.mosaic_mask_name);
              }
               $('#exposure-time-sp-sc-mm-modal').val(node.data.exposure_time);
              $('#myModalSPPSCPMM').modal('toggle');
            },
            error: function(jqXHR, textstatus, errorThrown) {
              $.toast({
                heading: 'Error',
                text: 'Cant get your data, try again!',
                icon: 'error',
                loader: true,
                loaderBg: '#fff',
                showHideTransition: 'plain',
                hideAfter: 3000,
                position: {
                  left: 100,
                  top: 30
                }
              })
            }
          })
            
        }
        if(node.type === 'GROUP'){
            
        }
        if(node.type === 'FUNC'){
            
        }
        if(node.type === "MFV") {
          $.ajax({
            type: 'POST',
            url : '/mda-modals/show-mfv-modal',
            crossDomain: true,
            data: '{ "access_token": "' + userToken + '" }',
            contentType:'application/json; charset=utf-8',
            //dataType: 'json',
            success: function(data) { // data is already parsed !!
              document.getElementById("myModalMFVContent").innerHTML = data;
              if (node.data.valve_1 == "Open") {
                $('#valve-1-modal').val(1);
              }
              else {
                $('#valve-1-modal').val(2);
              }
              if (node.data.valve_2 == "Open") {
                $('#valve-2-modal').val(1);
              }
              else {
                $('#valve-2-modal').val(2);
              }
              if (node.data.valve_3 == "Open") {
                $('#valve-3-modal').val(1);
              }
              else {
                $('#valve-3-modal').val(2);
              }
              if (node.data.valve_4 == "Open") {
                $('#valve-4-modal').val(1);
              }
              else {
                $('#valve-4-modal').val(2);
              }
              if (node.data.valve_5 == "Open") {
                $('#valve-5-modal').val(1);
              }
              else {
                $('#valve-5-modal').val(2);
              }
              $('#myModalMFV').modal('toggle');
            },
            error: function(jqXHR, textstatus, errorThrown) {
              $.toast({
                heading: 'Error',
                text: 'Cant get your data, try again!',
                icon: 'error',
                loader: true,
                loaderBg: '#fff',
                showHideTransition: 'plain',
                hideAfter: 3000,
                position: {
                  left: 100,
                  top: 30
                }
              })
            }
          })
        }
        
    }

    $("#tree").addClass("fancytree-connectors");
    

    function initFancyTreeFromJSON(my_json) {
      var newJson = JSON.parse(my_json);
      //console.log(newJson);
      var tree = $("#tree").fancytree('getTree');
      tree.reload(newJson);
      $("#tree").fancytree("getTree").findFirst("protocol").setActive();
      $("#tree").fancytree("getTree").findFirst("protocol").setFocus(true);
    }
