var treeName = 'empty.json';

var CLIPBOARD = null;

var id_node = 0;

var userToken = localStorage.getItem("access_token");

if (!userToken) {
    window.location.href = "/views/welcome";
}

$(function () {
  $("#tree").fancytree({
    checkbox: false,
    tooltip: function (event, data) {
      var node = data.node;
      if (node.type === "PROT") return "Protocole";
      if (node.type === "LOOP") return "Sequence";
      if (node.type === "XYZ") return "XYZ position";
      if (node.type === "ZS+SC") return "ZS+SC";
      if (node.type === "ZS+SC+M") return "ZS+SC+M";
      if (node.type === "SP+SC") return "SP+SC";
      if (node.type === "SP+SC+M") return "SP+SC+M";
      if (node.type === "GROUP") return "Group position";
      if (node.type === "AF") return "Autofocus";
      if (node.type === "DELAY") return "Delay";
      if (node.type === "FUNC") return "Function";
      if (node.type === "MFV") return "MicroFluidics Valves";
      if (node.type === "Slack") return "Slack message";
      if (node.type === "BREAK") return "Break";
      if (node.type === "GOTO") return "Goto";
      if (node.type === "IMAGING") return "Imaging";
      if (node.type === "ANALYSIS") return "Analysis";
      if (node.type === "IF") return "If";
      if (node.type === "MFLUIDIQUE") return "Micro-fluidique";
      if (node.type === "STOP") return "Stop";

    },
    icon: function (event, data) {
      var node = data.node;
      if (node.type === "PROT") {
        newSourceOptionId = node.data.config;
        return "../icons/protocol.png";
      }
      if (node.type === "LOOP") return "../icons/arrow_rotate_clockwise.png";
      if (node.type === "XYZ") return "../icons/yxz-512.png";
      if (node.type === "ZS+SC") return "../icons/flag_blue.png";
      if (node.type === "ZS+SC+M") return "../icons/flag_green.png";
      if (node.type === "SP+SC") return "../icons/flag_red.png";
      if (node.type === "SP+SC+M") return "../icons/flag_purple.png";
      if (node.type === "GROUP") return "../icons/text_list_numbers.png";
      if (node.type === "DELAY") return "../icons/clock.png";
      if (node.type === "AF") return "../icons/autofocus.png";
      if (node.type === "FUNC") return "../icons/lightning.png";
      if (node.type === "MFV") return "../icons/controller.png";
      if (node.type === "Slack") return "../icons/controller.png";
      if (node.type === "BREAK") return "../icons/controller.png";
      if (node.type === "GOTO") return "../icons/controller.png";
      if (node.type === "IMAGING") return "../icons/controller.png";
      if (node.type === "ANALYSIS") return "../icons/controller.png";
      if (node.type === "IF") return "../icons/controller.png";
      if (node.type === "MFLUIDIQUE") return "../icons/controller.png";
      if (node.type === "STOP") return "../icons/controller.png";
    },
    titlesTabbable: true,
    quicksearch: true,
    source: {
      url: "../protocol.json"
    },
    extensions: ["edit", "dnd5", "table", "gridnav", "multi"],
    unselectable: function (event, data) {
      return data.node.isFolder();
    },
    multi: {
      mode: "sameParent",
    },

    activate: function (event, data) {
        $("#Form").empty();
        $("#Form").append("<div id='FormName'></div>");
        $("#FormName").append("Edit function:  " + data.node.title);
        nodeParameters = data.node;
        console.log(nodeParameters);
        //console.log("lol", data.node.type);
        //$('#wPaint').wPaint('clear');
        if (data.node.type == 'IMAGING') {
          //console.log("lol");
          $('#FormEsttimatedTime').empty();
          value = data.node.title;

          var nameType = '';
          nameType = nameType + value;
          $("#Form").append("<hr><label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='ImagingTitle' onChange='updateImaging()'></input>");
          checked = '';
          if (data.node.data.autofocus) {
            //nameType = nameType + '| AF';
            checked = 'checked';
          }
          $("#Form").append("<hr><label style='width:200px'>AutoFocus</label><input " + checked + " type = 'checkbox' id='ImagingAutofocus' onClick='updateImaging()'></input><div id='ImagingAutofocusDiv'></div>");
          $("#ImagingAutofocusDiv").empty();
          data.node.data.AFLowerLimit ? checked = 'checked' : checked = '';
          $("#ImagingAutofocusDiv").append("<input " + checked + " type = 'checkbox' id='AFLowerLimit' onClick='updateImaging()'></input><small><label style='width:200px'>Lower limit [µm]</label><input value='" + nodeParameters.data.ImagingAutofocusLower + "' type = 'number' id='ImagingAutofocusLower' onClick='updateImaging()'></input><br></small>");
          data.node.data.AFUpperLimit ? checked = 'checked' : checked = '';
          $("#ImagingAutofocusDiv").append("<input " + checked + " type = 'checkbox' id='AFUpperLimit' onClick='updateImaging()'></input><small><label style='width:200px'>Upper limit [µm]</label><input value='" + nodeParameters.data.ImagingAutofocusUpper + "' type = 'number' id='ImagingAutofocusUpper' onClick='updateImaging()'></input><br></small>");
          $("#ImagingAutofocusDiv").append("<small><label style='width:200px'>Objective</label><input value='" + nodeParameters.data.aftbl + "' type = 'text' id='ImagingAutofocusObjective' onClick='updateImaging()'></input><br></small>");
          //$("#ImagingAutofocusDiv").append("<small><label style='width:200px'>Offset [µm]</label><input value='" + nodeParameters.data.offset + "' type = 'number' id='ImagingAutofocusOffset'></input><button title='update autofocus parameters'><img src='icons/autofocus.png'></img></button><br></small>");
          //$("#ImagingAutofocusDiv").append("<small><label style='width:200px'>Refocus</label><input  type = 'text' id='ImagingAutofocusStatus'></input><button title='refocus'><img src='icons/shape_align_top.png'></img></button><br></small>");
          //$("#ImagingAutofocusDiv").append("<br><small><label style='width:200px'>Z position [µm]</label><input value='" + data.node.data.zPosition / 100 + "' type = 'number' id='ImagingAutofocusZPosition' onClick='updateImaging()'></input><button title='update z position'><img src='icons/yxz-512.png'></img></button><br></small>");
          $("#ImagingAutofocusDiv").hide();
        
          if ($('#ImagingAutofocus').is(":checked")) {
            $("#ImagingAutofocusDiv").show();
          } else $("#ImagingAutofocusDiv").hide();
        

          checked = '';
          if (data.node.data.picture) {
            //nameType = nameType + '| img';
            checked = 'checked';
          }
          $("#Form").append("<hr><label style='width:200px'>Simple picture</label><input name='imgType' " + checked + " type = 'radio' id='ImagingPicture' onClick='updateImaging()'></input><small><label style='width:200px'>How ?</label><input value='" + nodeParameters.data.ImagingPictureNumber + "' type = 'number' id='ImagingPictureNumber' onClick='updateImaging()'></input><br></small>");
          checked = '';
          if (data.node.data.zstack) {
            //nameType = nameType + '| zs';
            checked = 'checked';
          }
          $("#Form").append("<hr><label style='width:200px'>Z-stack</label><input name='imgType' " + checked + " type = 'radio' id='ImagingZstack' onClick='updateImaging()'></input><div id='ImagingZstackDiv'></div>");
          //                    $("#ImagingZstackDiv").empty();
          data.node.data.zstackUpper ? checked = 'checked' : checked = '';
          $("#ImagingZstackDiv").append("<input " + checked + " type = 'checkbox' id='zstackUpper' onClick='updateImaging()'></input><small><label style='width:200px'>Z Start [µm]</label><input value='" + data.node.data.zUpperLimit + "' type = 'number' id='ImagingZstackUpper' onClick='updateImaging()'></input><br></small>");
          data.node.data.zstackLower ? checked = 'checked' : checked = '';
          $("#ImagingZstackDiv").append("<input " + checked + " type = 'checkbox' id='zstackLower' onClick='updateImaging()'></input><small><label style='width:200px'>Z Stop [µm]</label><input value='" + data.node.data.zLowerLimit + "' type = 'number' id='ImagingZstackLower' onClick='updateImaging()'></input><br></small>");
          data.node.data.zstackStep ? checked = 'checked' : checked = '';
          $("#ImagingZstackDiv").append("<input " + checked + " type = 'checkbox' id='zstackStep' onClick='updateImaging()'></input><small><label style='width:200px'>Step [µm]</label><input value='" + data.node.data.zstep + "' type = 'number' id='ImagingZstackstep' onClick='updateImaging()'></input><br></small>");
          data.node.data.zstackShutter ? checked = 'checked' : checked = '';
          $("#ImagingZstackDiv").append("<input " + checked + " type = 'checkbox' id='zstackShutter' onClick='updateImaging()'></input><small><label style='width:200px'>Shutter Open</label></small>");
          $("#ImagingZstackDiv").hide();
          
          if ($('#ImagingZstack').is(":checked")) {
            $("#ImagingZstackDiv").show();
          } else $("#ImagingZstackDiv").hide();
          //nameType = nameType + '[' + nodeParameters.data.settingchannels + ':';
          //nameType = nameType + nodeParameters.data.timeexposure + 'ms]';

          checked = '';
          if (data.node.data.mosaic) {
            checked = 'checked';
            //nameType = nameType + '| M';
          }
          $("#Form").append("<hr><label style='width:200px'>Mosaic</label><input " + checked + " type = 'checkbox' id='ImagingMosaic' onClick='updateImaging()'></input><div id='ImagingMosaicDiv'>");
          //$("#ImagingMosaicDiv").append("<small><label style='width:200px'>Exposing the mask (60s)</label><button onClick='updateImaging()'><img src='icons/color_swatch.png'></button></small><br>");
          //$("#ImagingMosaicDiv").append("<small><label style='width:200px'>Stop exposing</label><button onClick='updateImaging()'><img src='icons/cancel.png'></button></small><br>");
          //data.node.data.zstackUpper ? checked = 'checked' : checked = '';
          $("#ImagingMosaicDiv").append("<input " + ( data.node.data.MaskType ? 'checked' : '') + " type = 'checkbox' id='MaskType' onClick='updateImaging()'></input><small><label style='width:200px'>Mask posotif ou négatif lequel: <select id='MaskTypeID' onChange='updateImaging()'></select></small><br>");
          $("#ImagingMosaicDiv").append("<input name='maskType' " + ( data.node.data.ImagingStrategieMask == 'all' ? 'checked' : '') + " type = 'radio' id='ImagingAllMask' onClick='updateImaging()'></input><small><label style='width:200px'>Tout le mask</label><br></small>");
          $("#ImagingMosaicDiv").append("<input name='maskType' " + ( data.node.data.ImagingStrategieMask == 'roi' ? 'checked' : '') + " type = 'radio' id='ImagingRoiMask' onClick='updateImaging()'></input><small><label style='width:200px'>Stratégie Roi</label><br></small>");
          $("#ImagingMosaicDiv").append("<input name='maskType' " + ( data.node.data.ImagingStrategieMask == 'dyn' ? 'checked' : '') + " type = 'radio' id='ImagingDynamicMask' onClick='updateImaging()'></input><small><label style='width:200px'>Dynamic mask</label><br></small>");


          if (checked == 'checked') {
            //$("#ImagingMosaicDiv").show();
            //$('#wPaint').wPaint('image', data.node.data.mask);
          } else {
            //if (data.node.data.mask == '') $('#wPaint').wPaint('clear');
            //else $('#wPaint').wPaint('image', data.node.data.mask);
            //$("#ImagingMosaicDiv").hide();
          }

          value = data.node.data.timeexposure;
          
          $("#Form").append("<hr><label style='width:200px'>Time exposure:</label><input min='0' step='1' value=" + value + " type = 'number' id='ImagingTimeexposure' onChange='updateImaging()'></input>");
          var radio = data.node.data.unitTime;
          $("#Form").append("<label for='ImagingSeconde'>Sec</label> <input type='radio' id='ImagingSeconde' name='unitTime' value='s' onChange='updateImaging()'" + (radio == "s" ? "checked" : "") + ">   </input>")
          $("#Form").append("<label for='ImagingMinute'>Min</label> <input type='radio' id='ImagingMinute' name='unitTime' value='min' onChange='updateImaging()' " + (radio == "min" ? "checked" : "") + "></input>")

          value = data.node.data.settingchannels;
          $("#Form").append("<hr><label style='width:200px'>Setting channel:</label>");
          $("#Form").append("<select id='ImagingSettingChannels' onChange='updateImaging()'></select>");

          getSettingsChannels(data.node.data.ImagingSettingChannel);
          getMosaicMask(data.node.data.MaskTypeID);
          nodeParameters.setTitle(nameType);
          $("#FormName").empty();
          $("#FormName").append("Edit function:  " + nameType);
        }
        if (data.node.type === 'PROT') {
          $('#FormEsttimatedTime').empty();
          value = data.node.title;
          try {
            value = value.split('|');
            value = value[0]
          } catch {
            value = value;
          }
          var nameType = '';
          nameType = nameType + value;
          $("#Form").append("<hr><label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='ProtTitle' onChange='updateProt()'></input>");
          value = data.node.data.comment;
          $("#Form").append("<hr><label style='width:200px'>Comment:</label><textarea rows='4' cols='50' id='ProtComment' onkeyup='updateProt()'>" + value + "</textarea>");
          value = data.node.data.folder;
          nameType = nameType + '| folder[' + value + ']';
          $("#Form").append("<hr><label style='width:200px'>Folder (target):</label><input  type = 'text' placeholder='agardpad' id='ProtFolder' onChange='updateProt()' value=" + value + "></input>");
          value = data.node.data.author;
          $("#Form").append("<hr><label style='width:200px'>Author:</label><select id='ProtAuthor' onChange='updateProt()'><option name=WilliamsB value=0>WilliamsB</option><option name=KalinaH value=1>KalinaH</option><option name=MatthiasL value=2>MatthiasL</option><option name=CélineC value=4>CélineC</option></select>");
          $("#ProtAuthor option[value='" + value + "']").prop('selected', true);
          nameType = nameType + ' | author[' + $('#ProtAuthor').find('option:selected').attr("name") + ']';
          nodeParameters.setTitle(nameType);
        }
        if (data.node.type === 'LIST') {
          $('#FormEsttimatedTime').empty();
          value = data.node.title;
          try {
            value = value.split('|');
            value = value[0]
          } catch {
            value = value;
          }
          var nameType = '';
          nameType = nameType + value;
          $("#Form").append("<hr><label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='ListTitle' onChange='updateList()'></input>");
          if (data.node.children == null) {
            value = 0;
            $("#Form").append("<hr><label style='width:200px'>Number of position:</label><input readonly value=0 type = 'text' id='ListnPos'></input>");
          } else {
            value = data.node.children.length;
            $("#Form").append("<hr><label style='width:200px'>Number of position:</label><input readonly value=" + value + " type = 'text' id='ListnPos'></input>");
          }

          nodeParameters.setTitle(nameType + '| positions[' + value + ']');
          $("#FormName").empty();
          $("#FormName").append("Edit function:  " + nameType + '| positions[' + value + ']');

        }
        if (data.node.type === 'DELAY') {
          $('#FormEsttimatedTime').empty();
          value = data.node.title;
          $("#Form").append("<hr><label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='DelayTitle' onChange='updateDelay()'></input>");
          var nameType = '';
          nameType = nameType + value;
          value = data.node.data.time;
          //$("#Form").append("<hr><label style='width:200px'>Time(in seconds):</label><input min='1' step='1' value=" + value + " type = 'number' id='DelayTime' onChange='updateDelay()'></input>");
          //nameType = nameType + '| time[' + value + 'sec]';

          $("#Form").append("<hr><label style='width:200px'>Time:</label><input min='0' step='1' value=" + value + " type = 'number' id='DelayTime' onChange='updateDelay()'></input>");
          //nameType = nameType + data.node.data.time + 'min]';
          var radio = data.node.data.unitTime;
          $("#Form").append("<label for='DelaySeconde'>Sec</label> <input type='radio' id='DelaySeconde' name='unitTime' value='s' onChange='updateDelay()'" + (radio == "s" ? "checked" : "") + ">   </input>")
          $("#Form").append("<label for='DelayMinute'>Min</label> <input type='radio' id='DelayMinute' name='unitTime' value='min' onChange='updateDelay()' " + (radio == "min" ? "checked" : "") + "></input>")

          //nodeParameters.setTitle(nameType);
        }
        if (data.node.type === 'IF') {
          $('#FormEsttimatedTime').empty();
          console.log(data.node);
          value = data.node.title;
          //try {
          //  value = value.split('|');
          //  value = value[0]
          //} catch {
          //  value = value;
          //}
          $("#Form").append("<hr><label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='IfTitle' onChange='updateIf()'></input>");
          var nameType = '';
          nameType = nameType + value;
          var checked = '';
          //if (data.node.data.time) {
          //  nameType = nameType + '| extent[Yes]';
          //  checked = 'checked';
          //} else {
          //  nameType = nameType + '| extent[No]';
          //}
          //$("#Form").append("<hr><label style='width:200px'>Extent time:</label><input " + checked + " type = 'checkbox' id='IfTime' onChange='updateIf()'></input>");
          value = data.node.data.condition;
          $("#Form").append("<hr><label style='width:200px'>Condition:</label><textarea rows='5' cols='50' id='IfCondition' onkeyup='updateIf()'>" + value + "</textarea>");
          //value = data.node.data.formatedCondition;
          //$("#Form").append("<hr><label style='width:200px'>Formated condition:</label><p id='IfFormatedCondition'>" + value + "</p>");
          nodeParameters.setTitle(nameType);
        }
        if (data.node.type === 'ANALYSIS') {
          $('#FormEsttimatedTime').empty();
          value = data.node.title;
          //try {
          //  value = value.split('|');
          //  value = value[0]
          //} catch {
          //  value = value;
          //}
          var nameType = '';
          nameType = nameType + value;
          $("#Form").append("<hr><label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='AnalysisTitle' onChange='updateAnalysis()'></input>");

          checked = '';
//          if (data.node.data.definedAlgo) checked = 'checked';
          $("#Form").append("<hr><label style='width:200px'>Script python:</label>");
          $("#Form").append("<select id='ImagingSettingChannels' onChange='updateAnalysis()'></select>");

          //$("#Form").append("<hr><label style='width:200px'>Defined algorithm</label><input name='algoType' " + checked + " type = 'radio' id='AnalysisDefinedAlgo' onClick='updateAnalysis()'></input><div id='AnalysisDefinedAlgoDiv'></div>");
          //$("#AnalysisDefinedAlgoDiv").append("<small><label style='width:200px'>Name:</label><select id='AnalysisDefinedAlgos' onChange='updateAnalysis()'><option name=SpotDetection.py value=0>SpotDetection.py</option><option name=UNET.py value=1>UNET.py</option></select><br></small>");
          //$('#AnalysisDefinedAlgos option[value="' + nodeParameters.data.definedAlgoName + '"]').prop('selected', true);
          //value = nodeParameters.data.definedAlgoComment[nodeParameters.data.definedAlgoName];
          //$("#AnalysisDefinedAlgoDiv").append("<small><label style='width:200px'>Comment:</label><textarea readonly rows='4' cols='50' id='AnanysisDefinedAlgoComment' >" + value + "</textarea></small>");

          //if (checked == 'checked') {
            //$("#AnalysisDefinedAlgoDiv").show();
            //nameType = nameType + '| algorithm[' + $('#AnalysisDefinedAlgos').find('option:selected').attr("name") + ']';
          //} else $("#AnalysisDefinedAlgoDiv").hide();

          //checked = '';
          //if (data.node.data.ownAlgo) checked = 'checked';
          //$("#Form").append("<hr><label style='width:200px'>Own algorithm</label><input name='algoType' " + checked + " type = 'radio' id='AnalysisOwnAlgo' onClick='updateAnalysis()'></input><div id='AnalysisOwnAlgoDiv0'></div><div id='AnalysisOwnAlgoDiv'></div>");
          $("#Form").append("<hr><small><label style='width:200px'>Image:</label><select id='AnalysisOwnAlgos' onChange='updateAnalysis()'></select><br></small>");
          //$('#AnalysisOwnAlgos option[value="' + nodeParameters.data.ownAlgoName + '"]').prop('selected', true);
          //value = nodeParameters.data.ownAlgoComment[nodeParameters.data.ownAlgoName];
          //$("#AnalysisOwnAlgoDiv").append("<small><label style='width:200px'>Comment:</label><textarea rows='4' cols='50'  id='AnalysisOwnAlgoComment' >" + value + "</textarea></small>");
          //$("#AnalysisOwnAlgoDiv0").hide();
          //if (nodeParameters.data.ownAlgoComment.length !== 0) $("#AnalysisOwnAlgoDiv0").show();
          //$("#AnalysisOwnAlgoDiv").append("<br><small><label style='width:20px'>Upload:</label><input type='file' id='AnalysisOwnAlgoFile'/></small>");
          //$("#AnalysisOwnAlgoDiv").append("<br><small><label style='width:200px'>Submit</label><button onClick='updateAnalysis()' id='AnalysisOwnAlgoSubmit'>Submit the script</button></small>");
//
          //if (checked == 'checked') {
          //  $("#AnalysisOwnAlgoDiv").show();
          //  //nameType = nameType + '| algorithm[' + $('#AnalysisOwnAlgos').find('option:selected').attr("name") + ']';
          //} else $("#AnalysisOwnAlgoDiv").hide();





          nodeParameters.setTitle(nameType);

        }

        if (data.node.type === 'Slack') {
          $('#FormEsttimatedTime').empty();
          value = data.node.title;
          //try {
          //  value = value.split('|');
          //  value = value[0]
          //} catch {
          //  value = value;
          //}
          $("#Form").append("<hr><label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='SlackTitle' onChange='updateSlack()'></input>");
          var nameType = '';
          nameType = nameType + value;
          value = data.node.data.typeMsg;
          $("#Form").append("<hr><label style='width:200px'>Type:</label><select id='SlackType' onChange='updateSlack()'><option name=Simple value=0>Simple message</option><option name=Alert value=1>Alert message</option><option name=Warning value=2>Warning message</option></select>");
          $("#SlackType option[value='" + value + "']").prop('selected', true);
          //nameType = nameType + ' | type[' + $('#SlackType').find('option:selected').attr("name") + ']';
          value = data.node.data.msg;
          $("#Form").append("<hr><label style='width:200px'>Message:</label><textarea rows='4' cols='50' id='SlackMessage' onkeyup='updateSlack()'>" + value + "</textarea>");
          nodeParameters.setTitle(nameType);
        }

        if (data.node.type === 'XYZ') {
          $('#FormEsttimatedTime').empty();
          value = data.node.title;
          try {
            value = value.split('|');
            value = value[0]
          } catch {
            value = value;
          }
          $("#Form").append("<hr><label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='XYZTitle' onChange='updateXYZ()'></input>");
          var nameType = '';
          nameType = nameType + value;
          value = data.node.data.xPosition;
          $("#Form").append("<hr><label style='width:200px'>Position X:</label><input readonly min='1' step='1' value=" + value + " type = 'number' id='XYZxPosition' onChange='updateXYZ()'></input>");
          nameType = nameType + '| x[' + value / 50 + 'µm]';
          value = data.node.data.yPosition;
          $("#Form").append("<hr><label style='width:200px'>Position Y:</label><input readonly min='1' step='1' value=" + value + " type = 'number' id='XYZyPosition' onChange='updateXYZ()'></input>");
          nameType = nameType + '| y[' + value / 50 + 'µm]';
          value = data.node.data.zPosition;
          $("#Form").append("<hr><label style='width:200px'>Position Z:</label><input readonly min='1' step='1' value=" + value + " type = 'number' id='XYZzPosition' onChange='updateXYZ()'></input>");
          nameType = nameType + '| z[' + value / 100 + 'µm]';
          value = data.node.data.skip;
          $("#Form").append("<div id='skip'><hr><label style='width:200px'>Skip:</label><input min='0' step='1' value=" + value + " type = 'number' id='XYZSkip' onChange='updateXYZ()'></input></div>");
          $("#skip").hide();
          if (nodeParameters.getParent().type === 'LOOP') {
            //ici juste l'activer ou non
            $("#skip").show();
            nameType = nameType + ' | skip[' + value + ']';
          }
          try {
            if (nodeParameters.getParent().type === 'LIST') {
              if (nodeParameters.getParent().getParent().type === 'GROUP') {
                if (nodeParameters.getParent().getParent().getParent().type === 'LOOP') {
                  //ici juste l'activer ou non
                  $("#skip").show();
                  nameType = nameType + ' | skip[' + value + ']';
                }
              }
            }
          } catch {
            var z = 0;
          }
          $("#Form").append("<hr><label style='width:200px'>Mark and replace position:</label><button><img src='icons/yxz-512.png'></img></button>");
          $("#Form").append("<hr><label style='width:200px'>Go to position:</label><button><img src='icons/arrow_right.png'></img></button>");
          nodeParameters.setTitle(nameType);
          //console.log(nodeParameters.key);
        }
        if (data.node.type === 'µFluidic') {
          $('#FormEsttimatedTime').empty();
          value = data.node.title;
          try {
            value = value.split('|');
            value = value[0]
          } catch {
            value = value;
          }
          $("#Form").append("<hr><label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='UFTitle' onChange='updateUF()'></input>");
          var nameType = '';
          nameType = nameType + value;
          $("#Form").append("<hr><label style='width:200px'>Valve1:</label><select id='UFValve1' onChange='updateUF()'><option name=OFF value=0>OFF</option><option name=ON value=1>ON</option></select>");
          $("#Form").append("<hr><label style='width:200px'>Valve2:</label><select id='UFValve2' onChange='updateUF()'><option name=OFF value=0>OFF</option><option name=ON value=1>ON</option></select>");
          $("#Form").append("<hr><label style='width:200px'>Valve3:</label><select id='UFValve3' onChange='updateUF()'><option name=OFF value=0>OFF</option><option name=ON value=1>ON</option></select>");
          $("#Form").append("<hr><label style='width:200px'>Valve4:</label><select id='UFValve4' onChange='updateUF()'><option name=OFF value=0>OFF</option><option name=ON value=1>ON</option></select>");
          $("#Form").append("<hr><label style='width:200px'>Valve5:</label><select id='UFValve5' onChange='updateUF()'><option name=OFF value=0>OFF</option><option name=ON value=1>ON</option></select>");
          value = data.node.data.v1;
          $("#UFValve1 option[value='" + value + "']").prop('selected', true);
          value = data.node.data.v2;
          $("#UFValve2 option[value='" + value + "']").prop('selected', true);
          value = data.node.data.v3;
          $("#UFValve3 option[value='" + value + "']").prop('selected', true);
          value = data.node.data.v4;
          $("#UFValve4 option[value='" + value + "']").prop('selected', true);
          value = data.node.data.v5;
          $("#UFValve5 option[value='" + value + "']").prop('selected', true);

          nameType = nameType + '| state[' + $('#UFValve1').find('option:selected').attr("name") + '-' + $('#UFValve2').find('option:selected').attr("name") + '-' + $('#UFValve3').find('option:selected').attr("name") + '-' + $('#UFValve4').find('option:selected').attr("name") + '-' + $('#UFValve5').find('option:selected').attr("name") + ']';

          nodeParameters.setTitle(nameType);
        }


        if (data.node.type === 'GROUP') {
          $('#FormEsttimatedTime').empty();
          value = data.node.title;
          //try {
          //  value = value.split('|');
          //  value = value[0]
          //} catch {
          //  value = value;
          //}
          var nameType = '';
          nameType = nameType + value;
          var skipMethode = data.node.data.skipMethode
          $("#Form").append("<hr><label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='GroupTitle' onChange='updateGroup()'></input>");
          value = data.node.data.skip;
          $("#Form").append("<hr><input type='radio' id='GroupMethodeSkip' name='skipMethode' value='skip' onChange='updateGroup()'" + (skipMethode == "skip" ? "checked" : "") + "> </input> <label style='width:200px'>Skip:</label><input min='0' step='1' value=" + value + " type = 'number' id='GroupSkip' onChange='updateGroup()'></input>");
          //nameType = nameType + ' | skip[' + nodeParameters.data.skip + ']';
          value = data.node.data.list;
          $("#Form").append("<hr><input type='radio' id='GroupMethodeList' name='skipMethode' value='list' onChange='updateGroup()' "+ (skipMethode == "list" ? "checked" : "") + "></input> <label style='width:200px'>List:</label><input value=" + value + " type = 'text' id='GroupList' onChange='updateGroup()'></input>");
          skipMethode = data.node.data.casualMethode;
          value = data.node.data.casual;
          $("#Form").append("<hr><input type='checkbox' id='GroupMethodeCasual' name='skipMethode' onChange='updateGroup()'" + (skipMethode ? "checked" : "") + "> </input> <label style='width:200px'>Casual MicroFluidic n°:</label><input min='2' step='1' value=" + value + " type = 'number' id='GroupCausual' onChange='updateGroup()'></input>");


          $("#skip").hide();
          if (nodeParameters.getParent().type === 'LOOP') {
            $("#skip").show();
            nameType = nameType + ' | skip[' + nodeParameters.data.skip + ']';
          }

          $("#Form").append("<hr><label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='GroupTitle' onChange='updateGroup()'></input>");


          nodeParameters.setTitle(nameType);
        }
        if (data.node.type === 'STOP') {
          $('#FormEsttimatedTime').empty();
        }
        if (data.node.type === 'BREAK') {
          $('#FormEsttimatedTime').empty();

          value = data.node.title;
          var nameType = '';
          nameType = nameType + value;
          $("#Form").append("<hr><label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='BreakTitle' onChange='updateBreak()'></input>");

          var optionDisplay = getOptionBreak(nodeParameters);
          //console.log(optionDisplay)
          value = data.node.who;
          $("#Form").append("<hr><label style='width:200px'>Type:</label><select id='BreakType' onChange='updateBreak()'>" + optionDisplay + "</select>");
          $("#SlackType option[value='" + value + "']").prop('selected', true);


          nodeParameters.setTitle(nameType);
        }
        if (data.node.type === 'GOTO') {
          $('#FormEsttimatedTime').empty();

          value = data.node.title;
          var nameType = '';
          nameType = nameType + value;
          $("#Form").append("<hr><label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='GotoTitle' onChange='updateGoto()'></input>");

          var optionDisplay = getOptionGoto();
          //console.log(optionDisplay)
          value = data.node.who;
          $("#Form").append("<hr><label style='width:200px'>Type:</label><select id='GotoType' onChange='updateGoto()'>" + optionDisplay + "</select>");
          $("#SlackType option[value='" + value + "']").prop('selected', true);


          nodeParameters.setTitle(nameType);
        }
        if (data.node.type === 'LOOP') {
          $('#FormEsttimatedTime').empty();
          value = data.node.title;
          //try {
          //  value = value.split('|');
          //  value = value[0]
          //} catch {
          //  value = value;
          //}
          $("#Form").append("<hr><label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='LoopTitle' onChange='updateLoop()'></input>");
          checked = '';
          if (data.node.data.extend) {
            checked = 'checked';
            nameType = nameType + ' | extend[Yes]';
          } else {
            nameType = nameType + ' | extend[No]';
          }
          $("#Form").append("<hr><label style='width:200px'>Extend the loop time</label><input " + checked + " type = 'checkbox' id='LoopExtend' onClick='updateLoop()'></input>");
          var nameType = '';
          nameType = nameType + value;
          value = data.node.data.nb_repetition;
          estimatedTime = value;
          $("#Form").append("<hr><label style='width:200px'>Number of repeat:</label><input min='0' step='1' value=" + value + " type = 'number' id='LoopRepeat' onChange='updateLoop()'></input>");
          if (data.node.data.waiting) {
            checked = 'checked';
          } else {
            checked = '';
          }
          $("#Form").append("<hr><label style='width:200px'>Waiting</label><input " + checked + " type = 'checkbox' id='LoopWaiting' onClick='updateLoop()'></input>");
          nameType = nameType + '| ' + data.node.data.repeat + 'x[';
          value = data.node.data.time_per_repetition;
          estimatedTime = estimatedTime * value;
          $("#Form").append("<hr><label style='width:200px'>Repeat time (min):</label><input min='0' step='1' value=" + value + " type = 'number' id='LoopTime' onChange='updateLoop()'></input>");
          nameType = nameType + data.node.data.time + 'min]';
          var radio = data.node.data.unitTime;
          $("#Form").append("<label for='LoopSeconde'>Sec</label> <input type='radio' id='LoopSeconde' name='unitTime' value='s' onChange='updateLoop()'" + (radio == "s" ? "checked" : "") + ">   </input>")
          $("#Form").append("<label for='LoopMinute'>Min</label> <input type='radio' id='LoopMinute' name='unitTime' value='min' onChange='updateLoop()' " + (radio == "min" ? "checked" : "") + "></input>")

          var skipMethode = data.node.data.skipMethode;
          value = data.node.data.skip;
          $("#Form").append("<hr><input type='radio' id='LoopMethodeSkip' name='skipMethode' value='skip' onChange='updateLoop()'" + (skipMethode == "skip" ? "checked" : "") + "> </input> <label style='width:200px'>Skip:</label><input min='0' step='1' value=" + value + " type = 'number' id='LoopSkip' onChange='updateLoop()'></input>");
          nameType = nameType + ' | skip[' + nodeParameters.data.skip + ']';          
          value = data.node.data.list;
          $("#Form").append("<hr><input type='radio' id='LoopMethodeList' name='skipMethode' value='list' onChange='updateLoop()' "+ (skipMethode == "list" ? "checked" : "") + "></input> <label style='width:200px'>List:</label><input value=" + value + " type = 'text' id='LoopList' onChange='updateLoop()'></input>");

          estimatedTimeD1 = parseInt(estimatedTime / 1440);
          estimatedTimeD2 = (estimatedTime % 1440);
          estimatedTimeH1 = parseInt(estimatedTimeD2 / 60);
          estimatedTimeH2 = (estimatedTimeD2 % 60);
          estimatedTimeM1 = parseInt(estimatedTimeH2);
          estimatedTimeS1 = parseInt(estimatedTimeM1 / 60);
          $("#FormEsttimatedTime").append("<hr><label style='width:200px'>Estimated total time:</label><label>" + estimatedTimeD1 + ' day - ' + estimatedTimeH1 + ' hours - ' + estimatedTimeM1 + ' min. - ' + estimatedTimeS1 + " sec.</label>");
          //nodeParameters.setTitle(nameType);
        }
      }
      //activate: function(event, data) {
      //  $("#lblActive").text("" + data.node+" "+ data.node.type);
      //}
      ,
    dnd5: {
      preventVoidMoves: true,
      preventRecursiveMoves: true,
      autoExpandMS: 400,
      dragStart: function (node, data) {
        return true;
      },
      dragEnd: function (node, data) {},
      dragEnter: function (node, data) {
        data.dataTransfer.dropEffect = "move";
        return true;
      },
      dragOver: function (node, data) {
        data.dataTransfer.dropEffect = "move";
      },
      dragLeave: function (node, data) {},
      dragDrop: function (node, data) {
        var transfer = data.dataTransfer;
        node.debug("drop", data);
        if (data.otherNode) {
          var sameTree = (data.otherNode.tree === data.tree);
          data.otherNode.moveTo(node, data.hitMode);
        } else if (data.otherNodeData) {
          node.addChild(data.otherNodeData, data.hitMode);
        } else {
          var typeOfNode = '';
          console.log(transfer.getData("text"));
          if (transfer.getData("text") == 'Autofocus') typeOfNode = 'AF';
          else if (transfer.getData("text") == 'Z-Stack + Setting channel') typeOfNode = 'ZS+SC';
          else if (transfer.getData("text") == 'Z-Stack + Setting channel + Mosaic') typeOfNode = 'ZS+SC+M';
          else if (transfer.getData("text") == 'Simple Picture + Setting channel') typeOfNode = 'SP+SC';
          else if (transfer.getData("text") == 'Simple Picture + Setting channel + Mosaic') typeOfNode = 'SP+SC+M';
          else if (transfer.getData("text") == 'Delay') typeOfNode = 'DELAY';
          else if (transfer.getData("text") == 'XYZ-position') typeOfNode = 'XYZ';
          else if (transfer.getData("text") == 'Group Position') typeOfNode = 'GROUP';
          else if (transfer.getData("text") == 'Sequence') typeOfNode = 'LOOP';
          else if (transfer.getData("text") == 'Function') typeOfNode = 'FUNC';
          else if (transfer.getData("text") == 'MicroFluidics Valves') typeOfNode = 'MFV';
          else if (transfer.getData("text") == 'Slack message') typeOfNode = 'Slack';
          else if (transfer.getData("text") == 'Break') typeOfNode = 'BREAK';
          else if (transfer.getData("text") == 'Goto') typeOfNode = 'GOTO';
          else if (transfer.getData("text") == 'Imaging') typeOfNode = 'IMAGING';
          else if (transfer.getData("text") == 'Analysis') typeOfNode = 'ANALYSIS';
          else if (transfer.getData("text") == 'If') typeOfNode = 'IF';
          else if (transfer.getData("text") == 'Micro-fluidique') typeOfNode = 'MFLUIDIQUE';
          else if (transfer.getData("text") == 'Stop') typeOfNode = 'STOP';
          else {
            typeOfNode = "LIGHT";
          }

          if (typeOfNode === "AF") {
            node.addNode({
              title: transfer.getData("text"),
              objectif: "undefined",
              range: 0,
              zoffset: 0,
              type: typeOfNode
            }, data.hitMode);
          }
          if (typeOfNode === "LOOP") {
            node.addNode({
              title: transfer.getData("text"),
              nb_repetition: 0,
              time_per_repetition: 0,
              type: typeOfNode
            }, data.hitMode);
          }
          if (typeOfNode === "XYZ") {
            node.addNode({
              title: transfer.getData("text"),
              xPosition: 0,
              yPosition: 0,
              zPosition: 0,
              type: typeOfNode
            }, data.hitMode);
          }
          if (typeOfNode === "ZS+SC") {
            node.addNode({
              title: transfer.getData("text"),
              z_position: 0,
              far_limit: 0,
              near_limit: 0,
              step: 0,
              keep_shutter_on_wzs: true,
              setting_channel_name: "undefined",
              exposure_time: 0,
              type: typeOfNode
            }, data.hitMode);
          }
          if (typeOfNode === "ZS+SC+M") {
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
              type: typeOfNode
            }, data.hitMode);
          }
          if (typeOfNode === "SP+SC") {
            node.addNode({
              title: transfer.getData("text"),
              setting_channel_name: "undefined",
              exposure_time: 0,
              type: typeOfNode
            }, data.hitMode);
          }
          if (typeOfNode === "SP+SC+M") {
            node.addNode({
              title: transfer.getData("text"),
              setting_channel_name: "undefined",
              mosaic_mask_name: "undefined",
              exposure_time: 0,
              type: typeOfNode
            }, data.hitMode);
          }
          if (typeOfNode === "DELAY") {
            node.addNode({
              title: transfer.getData("text"),
              time: 0,
              type: typeOfNode
            }, data.hitMode);
          }
          if (typeOfNode === "GROUP") {
            node.addNode({
              title: transfer.getData("text"),

              type: typeOfNode
            }, data.hitMode);
          }
          if (typeOfNode === "FUNC") {
            node.addNode({
              title: transfer.getData("text"),
              function_name: "undefined",
              type: typeOfNode
            }, data.hitMode);
          }
          if (typeOfNode === "Slack") {
            node.addNode({
              title: transfer.getData("text"),
              typeMsg: 0,
              typeDescrition: "Simple message",
              msg:"",
              type: typeOfNode
            }, data.hitMode);
          }
          if (typeOfNode === "BREAK") {
            node.addNode({
              title: transfer.getData("text"),
              who: undefined,
              type: typeOfNode
            }, data.hitMode);
          }
          if (typeOfNode === "GOTO") {
            node.addNode({
              title: transfer.getData("text"),
              who: undefined,
              type: typeOfNode
            }, data.hitMode);
          }
          if (typeOfNode === "IMAGING") {
            node.addNode({
              title: transfer.getData("text"),
              autofocus : false,
              AFLowerLimit : false,
              ImagingAutofocusLower : 0,
              AFUpperLimit : false,
              ImagingAutofocusUpper : 0,
              aftbl : 0,
              picture : false,
              ImagingPictureNumber : 0,
              zstack : false,
              zstackUpper : false,
              ImagingZstackzstart : 0,
              zstackLower : false,
              ImagingZstackzstop : 0,
              zstackStep : false,
              ImagingZstackstep : 0,
              zstackShutter : false,
              ImagingSettingChannel: null,
              timeexposure: 0,
              unitTime: null,
              mosaic: false,
              MaskType: false,
              MaskTypeID: undefined,
              ImagingStrategieMask: undefined,
              type: typeOfNode
            }, data.hitMode);
          }
          if (typeOfNode === "ANALYSIS") {
            node.addNode({
              title: transfer.getData("text"),
              script: undefined,
              image: undefined,
              type: typeOfNode
            }, data.hitMode);
          }
          if (typeOfNode === "IF") {
            node.addNode({
              title: transfer.getData("text"),
              condition: undefined,
              type: typeOfNode
            }, data.hitMode);
          }
          if (typeOfNode === "MFLUIDIQUE") {
            node.addNode({
              title: transfer.getData("text"),
              control: undefined,
              type: typeOfNode
            }, data.hitMode);
          }
          if (typeOfNode === "STOP") {
            node.addNode({
              title: transfer.getData("text"),
              type: typeOfNode
            }, data.hitMode);
          }
          if (typeOfNode === "MFV") {
            node.addNode({
              title: transfer.getData("text"),
              valve_1: "Close",
              valve_2: "Close",
              valve_3: "Close",
              valve_4: "Close",
              valve_5: "Close",
              type: typeOfNode
            }, data.hitMode);
          }
        }
        node.setExpanded();
      }
    },
    edit: {
      triggerStart: ["dblclick", "f2", "mac+enter", "shift+click"],
      close: function (event, data) {
        if (data.save && data.isNew) {
          $("#tree").trigger("nodeCommand", {
            cmd: "addSibling"
          });
        }
      }
    },
    table: {
      indentation: 20,
      nodeColumnIdx: 1
    },
    gridnav: {
      autofocusInput: false,
      handleCursorKeys: true
    },
    createNode: function (event, data) {
      var node = data.node,
        $tdList = $(node.tr).find(">td");
    },
    renderColumns: function (event, data) {
      var node = data.node,
        $tdList = $(node.tr).find(">td");
      console.log(node.key);
      $tdList.eq(0).find("input").val("node.key");
      if (false) {
        $tdList.eq(1).html('<button onClick="editTree();"><img src="../icons/wrench.png"></button>');
      } else if (node.type == 'PROT') {
        $tdList.eq(1).html('<button onClick="editTree();"><img src="../icons/wrench.png"></button>');
      } else if (node.type == 'AF') {
        var timestamp = new Date().getTime().toString();
        node.key = id_node++; //timestamp;
        $tdList.eq(0).html('<div> <p>' + node.key + '</p> </div>');
        $tdList.eq(3).html('<div id="' + node.key + "-info" + '">Objectif: ' + node.data.objectif + ' Z-Offset: ' + node.data.zoffset + '</div>');
        if (node.data.objectif == "undefined" && node.data.zoffset == 0) {
          console.log("OKOKOK");
          updateAutoFocus(node.key + "-info", node.key)
        }
      } else if (node.type == 'LOOP') {
        var timestamp = new Date().getTime().toString();
        node.key = id_node++; //timestamp;
        $tdList.eq(0).html('<div> <p>' + node.key + '</p> </div>');
        //$tdList.eq(4).html('<button onClick="editTree();"><img src="../icons/wrench.png"></button>');
        $tdList.eq(3).html('<div id="' + node.key + "-info" + '">Nb rep: ' + node.data.nb_repetition + ' Time per rep: ' + node.data.time_per_repetition + node.data.unitTime + (node.data.skipMethode == "skip" ? " Skip every " + node.data.skip +" times" : " Skip at these times : " + node.data.list)+ ' ' + (node.data.extend ? "Extend ": "") + (node.data.waiting ? "Wainting ": "") + '</div>');

      } else if (node.type == 'XYZ') {

        var timestamp = new Date().getTime().toString();
        node.key = id_node++; //timestamp;
        $tdList.eq(0).html('<div> <p>' + node.key + '</p> </div>');

        //$tdList.eq(4).html('<button onClick="updateNodePosition(\'' + node.key + "-info" + "\',\'" + node.key + '\')" title="Update position"><img src="../icons/map_edit.png"></button>');
        //$tdList.eq(3).html('<button onClick="goToNodePosition(\'' + node.key + "-info" + '\')" title="Go to position"><img src="../icons/map_go.png"></button>');
        $tdList.eq(3).html('<div id="' + node.key + "-info" + '">X:Y:Z => ' + node.data.xPosition + ':' + node.data.yPosition + ':' + node.data.zPosition + '</div>');
        if (node.data.xPosition == 0 && node.data.yPosition == 0 && node.data.zPosition == 0) {
          updateNodePosition(node.key + "-info", node.key);
        }

        //POST X Y Z
        // eq(4) >> Info = X=....;Y=....;Z=....
      } else if (node.type == 'ZS+SC') {

        var timestamp = new Date().getTime().toString();
        node.key = id_node++; //timestamp;
        if (node.data.far_limit == 0 && node.data.near_limit == 0 && node.data.step == 0 && node.data.setting_channel_name == "undefined" && node.data.exposure_time == 0) {
          node.data.exposure_time = parseInt($("#exposure-time").val());
          if ($("#position-z").text() == "Loading...") {
            node.data.position_z = "Error";
          } else {
            node.data.position_z = $("#position-z").text();
          }
          if ($("#setting-channel-to-apply :selected").text() != "Select a setting channel...") {
            node.data.setting_channel_name = $("#setting-channel-to-apply :selected").text();
          }
        }
        $tdList.eq(0).html('<div> <p>' + node.key + '</p> </div>');
        //            $tdList.eq(1).html('<button onClick="editTree();"><img src="../icons/wrench.png"></button>');
        $tdList.eq(3).html('<div id="' + node.key + "-info" + '">Z-Position: ' + node.data.position_z + ' far/near limit: ' + node.data.far_limit + 'um/' + node.data.near_limit + 'um Step: ' + node.data.step + 'um SC: ' + node.data.setting_channel_name + ' ET: ' + node.data.exposure_time + 'ms</div>');

      } else if (node.type == 'ZS+SC+M') {
        var timestamp = new Date().getTime().toString();
        node.key = id_node++; //timestamp;
        if (node.data.far_limit == 0 && node.data.near_limit == 0 && node.data.step == 0 && node.data.setting_channel_name == "undefined" && node.data.mosaic_mask_name == "undefined" && node.data.exposure_time == 0) {
          node.data.exposure_time = parseInt($("#exposure-time").val());
          if ($("#position-z").text() == "Loading...") {
            node.data.postion_z = "Error";
          } else {
            node.data.position_z = $("#position-z").text();
          }
          if ($("#setting-channel-to-apply :selected").text() != "Select a setting channel...") {
            node.data.setting_channel_name = $("#setting-channel-to-apply :selected").text();
          }
          if ($("#mosaic-mask-to-apply :selected").text() != "Select a mosaic mask...") {
            node.data.mosaic_mask_name = $("#mosaic-mask-to-apply :selected").text();
          }
        }
        $tdList.eq(0).html('<div> <p>' + node.key + '</p> </div>');

        //            $tdList.eq(1).html('<button onClick="editTree();"><img src="../icons/wrench.png"></button>');
        $tdList.eq(3).html('<div id="' + node.key + "-info" + '">Z-Position: ' + node.data.position_z + ' far/near limit: ' + node.data.far_limit + 'um/' + node.data.near_limit + 'um Step: ' + node.data.step + 'um SC: ' + node.data.setting_channel_name + ' MM: ' + node.data.mosaic_mask_name + ' ET: ' + node.data.exposure_time + 'ms</div>');

      } else if (node.type == 'SP+SC') {
        var timestamp = new Date().getTime().toString();
        node.key = id_node++; //timestamp;
        if (node.data.setting_channel_name == "undefined" && node.data.exposure_time == 0) {
          if ($("#setting-channel-to-apply :selected").text() != "Select a setting channel...") {
            node.data.setting_channel_name = $("#setting-channel-to-apply :selected").text();
          }
          node.data.exposure_time = parseInt($("#exposure-time").val());
        }
        $tdList.eq(0).html('<div> <p>' + node.key + '</p> </div>');
        //            $tdList.eq(1).html('<button onClick="editTree();"><img src="../icons/wrench.png"></button>');
        $tdList.eq(3).html('<div id="' + node.key + "-info" + '">SC: ' + node.data.setting_channel_name + ' ET: ' + node.data.exposure_time + 'ms</div>');

      } else if (node.type == 'SP+SC+M') {
        var timestamp = new Date().getTime().toString();
        node.key = id_node++; //timestamp;
        if (node.data.setting_channel_name == "undefined" && node.data.mosaic_mask_name == "undefined" && node.data.exposure_time == 0) {
          if ($("#setting-channel-to-apply :selected").text() != "Select a setting channel...") {
            node.data.setting_channel_name = $("#setting-channel-to-apply :selected").text();
          }
          if ($("#mosaic-mask-to-apply :selected").text() != "Select a mosaic mask...") {
            node.data.mosaic_mask_name = $("#mosaic-mask-to-apply :selected").text();
          }
          node.data.exposure_time = parseInt($("#exposure-time").val());
        }
        $tdList.eq(0).html('<div> <p>' + node.key + '</p> </div>');

        //            $tdList.eq(1).html('<button onClick="editTree();"><img src="../icons/wrench.png"></button>');
        $tdList.eq(3).html('<div id="' + node.key + "-info" + '">SC: ' + node.data.setting_channel_name + ' MM: ' + node.data.mosaic_mask_name + ' ET: ' + node.data.exposure_time + 'ms</div>');

      } else if (node.type == 'DELAY') {
        var timestamp = new Date().getTime().toString();
        node.key = id_node++; //timestamp;
        $tdList.eq(0).html('<div> <p>' + node.key + '</p> </div>');

        //            $tdList.eq(1).html('<button onClick="editTree();"><img src="../icons/wrench.png"></button>');
        $tdList.eq(3).html('<div id="' + node.key + "-info" + '">Delay: ' + node.data.time + (node.data.unitTime == " s" ? ' secondes' : 'minutes') + '</div>');

      } else if (node.type == 'GROUP') {
        var timestamp = new Date().getTime().toString();
        node.key = id_node++; //timestamp;
        $tdList.eq(0).html('<div> <p>' + node.key +"lol" + '</p> </div>');
        $tdList.eq(3).html('<div id="' + node.key + "-info" + '">' + (node.data.skipMethode == "skip" ? " Skip every " + node.data.skip +" times" : " Skip at these times : " + node.data.list)+ ' ' +(node.data.casualMethode ? ('Casual microFluid n°: ' +node.data.casual) : '') + '</div>');



      } else if (node.type == 'FUNC') {
        var timestamp = new Date().getTime().toString();
        node.key = id_node++; //timestamp;
        $tdList.eq(0).html('<div> <p>' + node.key + '</p> </div>');


      } else if (node.type == 'Slack') {
        var timestamp = new Date().getTime().toString();
        node.key = id_node++; //timestamp;
        $tdList.eq(0).html('<div> <p>' + node.key + '</p> </div>');
        $tdList.eq(3).html('<div id="' + node.key + "-info" + '">' + "Type:" + node.data.typeDescrition + " message:" + node.data.msg + '</div>');


      } else if (node.type == 'BREAK') {
        var timestamp = new Date().getTime().toString();
        node.key = id_node++; //timestamp;
        $tdList.eq(0).html('<div> <p>' + node.key + '</p> </div>');
        $tdList.eq(3).html('<div id="' + node.key + "-info" + '">' + "who:" + node.data.who + '</div>');


      } else if (node.type == 'GOTO') {
        var timestamp = new Date().getTime().toString();
        node.key = id_node++; //timestamp;
        $tdList.eq(0).html('<div> <p>' + node.key + '</p> </div>');
        $tdList.eq(3).html('<div id="' + node.key + "-info" + '">' + "who:" + node.data.who + '</div>');


      }else if (node.type == 'IMAGING') {
        var timestamp = new Date().getTime().toString();
        node.key = id_node++; //timestamp;
        $tdList.eq(0).html('<div> <p>' + node.key + '</p> </div>');
        $tdList.eq(3).html('<div id="' + node.key + "-info" + '">' + "who:" + node.data + '</div>');


      }else if (node.type == 'ANALYSIS') {
        var timestamp = new Date().getTime().toString();
        node.key = id_node++; //timestamp;
        $tdList.eq(0).html('<div> <p>' + node.key + '</p> </div>');
        $tdList.eq(3).html('<div id="' + node.key + "-info" + '">' + "who:" + node.data + '</div>');


      }else if (node.type == 'IF') {
        var timestamp = new Date().getTime().toString();
        node.key = id_node++; //timestamp;
        $tdList.eq(0).html('<div> <p>' + node.key + '</p> </div>');
        $tdList.eq(3).html('<div id="' + node.key + "-info" + '">' + "Condition:" + node.data.condition + '</div>');


      }else if (node.type == 'MFLUIDIQUE') {
        var timestamp = new Date().getTime().toString();
        node.key = id_node++; //timestamp;
        $tdList.eq(0).html('<div> <p>' + node.key + '</p> </div>');
        $tdList.eq(3).html('<div id="' + node.key + "-info" + '">' + "who:" + node.data + '</div>');


      }else if (node.type == 'STOP') {
        var timestamp = new Date().getTime().toString();
        node.key = id_node++; //timestamp;
        $tdList.eq(0).html('<div> <p>' + node.key + '</p> </div>');
        $tdList.eq(3).html('<div id="' + node.key + "-info" + '">' + "who:" + node.data + '</div>');


      } else if (node.type == 'MFV') {
        var timestamp = new Date().getTime().toString();
        node.key = id_node++; //timestamp;
        $tdList.eq(0).html('<div> <p>' + node.key + '</p> </div>');
        //            $tdList.eq(1).html('<button onClick="editTree();"><img src="../icons/wrench.png"></button>');
        $tdList.eq(3).html('<div id="' + node.key + "-info" + '">V1: ' + node.data.valve_1 + ' V2: ' + node.data.valve_2 + ' V3: ' + node.data.valve_3 + ' V4: ' + node.data.valve_4 + ' V5: ' + node.data.valve_5 + '</div>');

      }

    }
  }).on("nodeCommand", function (event, data) {
    var refNode, moveMode,
      tree = $(this).fancytree("getTree"),
      node = tree.getActiveNode();

    switch (data.cmd) {
      case "moveUp":
        refNode = node.getPrevSibling();
        if (refNode) {
          node.moveTo(refNode, "before");
          node.setActive();
        }
        break;
      case "moveDown":
        refNode = node.getNextSibling();
        if (refNode) {
          node.moveTo(refNode, "after");
          node.setActive();
        }
        break;
      case "indent":
        refNode = node.getPrevSibling();
        if (refNode) {
          node.moveTo(refNode, "child");
          refNode.setExpanded();
          node.setActive();
        }
        break;
      case "outdent":
        if (!node.isTopLevel()) {
          if (node.getParent().type != 'PROT') {
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
        if (refNode) {
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
        CLIPBOARD = {
          mode: data.cmd,
          data: node
        };
        break;
      case "copy":
        CLIPBOARD = {
          mode: data.cmd,
          data: node.toDict(function (n) {
            delete n.key;
          })
        };
        break;
      case "clear":
        CLIPBOARD = null;
        break;
      case "paste":
        if (CLIPBOARD.mode === "cut") {
          // refNode = node.getPrevSibling();
          CLIPBOARD.data.moveTo(node, "child");
          CLIPBOARD.data.setActive();
        } else if (CLIPBOARD.mode === "copy") {
          node.addChildren(CLIPBOARD.data).setActive();
        }
        break;
      default:
        alert("Unhandled command: " + data.cmd);
        return;
    }

  }).on("click", function (e, data) {
    //alert("youpi");//
    var test = $('#tree').fancytree('getTree').getSelectedNodes();
    //console.log(test[0]);
    //         console.log(test[0].title);
    //         console.log(test[0].type);
    //         console.log(test[0].data);
    //console.log( e, $.ui.fancytree.eventToString(e) ); //MORE FANCY TREE LOG HERE

  }).on("keydown", function (e) {
    var cmd = null;

    // console.log(e.type, $.ui.fancytree.eventToString(e));
    switch ($.ui.fancytree.eventToString(e)) {
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
    if (cmd) {
      $(this).trigger("nodeCommand", {
        cmd: cmd
      });
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
    menu: [{
        title: "Edit <kbd>[F2]</kbd>",
        cmd: "rename",
        uiIcon: "ui-icon-pencil"
      },
      {
        title: "Delete <kbd>[Del]</kbd>",
        cmd: "remove",
        uiIcon: "ui-icon-trash"
      },
      {
        title: "----"
      },
      {
        title: "New sibling <kbd>[Ctrl+B]</kbd>",
        cmd: "addSibling",
        uiIcon: "ui-icon-plus"
      },
      {
        title: "New child <kbd>[Ctrl+Shift+B]</kbd>",
        cmd: "addChild",
        uiIcon: "ui-icon-arrowreturn-1-e"
      },
      {
        title: "----"
      },
      {
        title: "Cut <kbd>Ctrl+X</kbd>",
        cmd: "cut",
        uiIcon: "ui-icon-scissors"
      },
      {
        title: "Copy <kbd>Ctrl-C</kbd>",
        cmd: "copy",
        uiIcon: "ui-icon-copy"
      },
      {
        title: "Paste as child<kbd>Ctrl+V</kbd>",
        cmd: "paste",
        uiIcon: "ui-icon-clipboard",
        disabled: true
      }
    ],
    beforeOpen: function (event, ui) {
      var node = $.ui.fancytree.getNode(ui.target);
      $("#tree").contextmenu("enableEntry", "paste", !!CLIPBOARD);
      node.setActive();
    },
    select: function (event, ui) {
      var that = this;
      // delay the event, so the menu can close and the click event does
      // not interfere with the edit control
      setTimeout(function () {
        $(that).trigger("nodeCommand", {
          cmd: ui.cmd
        });
      }, 100);
    }
  });

});

setTimeout(function () {
  $("#tree").fancytree("getTree").findFirst("protocol").setActive();
  $("#tree").fancytree("getTree").findFirst("protocol").setFocus(true);
}, 300);


/*var tree = $("#tree").fancytree("getTree");
var d = tree.toDict(true);
d['type'] = 'mda';
(JSON.stringify(d));*/
//EVENT TRIGGER QUAND CLICK SUR CONFIG DE LA LIGNE
function editTree() {


  var node = $("#tree").fancytree("getActiveNode");
  //MODIF 1
  if (node.type === 'PROT') {

  } //MODIF1
  if (node.type === 'LOOP') {
    $.ajax({
      type: 'POST',
      url: '/mda-modals/show-sequence-modal',
      crossDomain: true,
      data: '{ "access_token": "' + userToken + '" }',
      contentType: 'application/json; charset=utf-8',
      //dataType: 'json',
      success: function (data) { // data is already parsed !!
        document.getElementById("myModalSequenceContent").innerHTML = data;
        $('#nb-repetition-modal').val(node.data.nb_repetition);
        $('#time-per-repetition-modal').val(node.data.time_per_repetition);
        $('#myModalSequence').modal('toggle');
      },
      error: function (jqXHR, textstatus, errorThrown) {
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
  if (node.type === 'XYZ') {

  }
  //MODIF 1
  if (node.type === 'AF') {

  }
  //MODIF 1
  if (node.type === 'DELAY') {
    $.ajax({
      type: 'POST',
      url: '/mda-modals/show-delay-modal',
      crossDomain: true,
      data: '{ "access_token": "' + userToken + '" }',
      contentType: 'application/json; charset=utf-8',
      //dataType: 'json',
      success: function (data) { // data is already parsed !!
        document.getElementById("myModalDelayContent").innerHTML = data;
        $('#delay-modal').val(node.data.time);
        $('#myModalDelay').modal('toggle');
      },
      error: function (jqXHR, textstatus, errorThrown) {
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
  if (node.type === 'ZS+SC') {
    $.ajax({
      type: 'POST',
      url: '/mda-modals/show-zs-sc-modal',
      crossDomain: true,
      data: '{ "access_token": "' + userToken + '" }',
      contentType: 'application/json; charset=utf-8',
      //dataType: 'json',
      success: function (data) { // data is already parsed !!
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
      error: function (jqXHR, textstatus, errorThrown) {
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
  if (node.type === 'ZS+SC+M') {
    $.ajax({
      type: 'POST',
      url: '/mda-modals/show-zs-sc-mm-modal',
      crossDomain: true,
      data: '{ "access_token": "' + userToken + '" }',
      contentType: 'application/json; charset=utf-8',
      //dataType: 'json',
      success: function (data) { // data is already parsed !!
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
      error: function (jqXHR, textstatus, errorThrown) {
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
  if (node.type === 'SP+SC') {
    $.ajax({
      type: 'POST',
      url: '/mda-modals/show-sp-sc-modal',
      crossDomain: true,
      data: '{ "access_token": "' + userToken + '" }',
      contentType: 'application/json; charset=utf-8',
      //dataType: 'json',
      success: function (data) { // data is already parsed !!
        document.getElementById("myModalSPPSCContent").innerHTML = data;
        if (node.data.setting_channel_name != "undefined") {
          $('#setting-channel-sp-sc-modal option:first').text(node.data.setting_channel_name);
        }
        $('#exposure-time-sp-sc-modal').val(node.data.exposure_time);
        $('#myModalSPPSC').modal('toggle');
      },
      error: function (jqXHR, textstatus, errorThrown) {
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
  if (node.type === 'SP+SC+M') {
    $.ajax({
      type: 'POST',
      url: '/mda-modals/show-sp-sc-mm-modal',
      crossDomain: true,
      data: '{ "access_token": "' + userToken + '" }',
      contentType: 'application/json; charset=utf-8',
      //dataType: 'json',
      success: function (data) { // data is already parsed !!
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
      error: function (jqXHR, textstatus, errorThrown) {
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
  if (node.type === 'GROUP') {

  }
  if (node.type === 'FUNC') {

  }
  if (node.type === "MFV") {
    $.ajax({
      type: 'POST',
      url: '/mda-modals/show-mfv-modal',
      crossDomain: true,
      data: '{ "access_token": "' + userToken + '" }',
      contentType: 'application/json; charset=utf-8',
      //dataType: 'json',
      success: function (data) { // data is already parsed !!
        document.getElementById("myModalMFVContent").innerHTML = data;
        if (node.data.valve_1 == "Open") {
          $('#valve-1-modal').val(1);
        } else {
          $('#valve-1-modal').val(2);
        }
        if (node.data.valve_2 == "Open") {
          $('#valve-2-modal').val(1);
        } else {
          $('#valve-2-modal').val(2);
        }
        if (node.data.valve_3 == "Open") {
          $('#valve-3-modal').val(1);
        } else {
          $('#valve-3-modal').val(2);
        }
        if (node.data.valve_4 == "Open") {
          $('#valve-4-modal').val(1);
        } else {
          $('#valve-4-modal').val(2);
        }
        if (node.data.valve_5 == "Open") {
          $('#valve-5-modal').val(1);
        } else {
          $('#valve-5-modal').val(2);
        }
        $('#myModalMFV').modal('toggle');
      },
      error: function (jqXHR, textstatus, errorThrown) {
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

function updateDelay(){
  nodeParameters.title =  $('#DelayTitle').val().replace(/ /gi, '_');
  nodeParameters.data.time =  $('#DelayTime').val();
  if($('#DelaySeconde').is(":checked")){nodeParameters.data.unitTime = "s";}
  if($('#DelayMinute').is(":checked")){nodeParameters.data.unitTime = "min";}

  
  nodeParameters.setTitle(nodeParameters.title);
  $("#FormName").empty();
  $("#FormName").append("Edit function:  " + nodeParameters.title);
}

function updateSlack() {
  nodeParameters.title =  $('#SlackTitle').val().replace(/ /gi, '_');

  var valueOption = $('#SlackType').val();

  if (valueOption == 0) {
    nodeParameters.data.typeDescrition = "Simple message";
  } else if (valueOption == 1) {
    nodeParameters.data.typeDescrition = "Alert message";
  } else if (valueOption == 2) {
    nodeParameters.data.typeDescrition = "Warning message";
  }

  nodeParameters.data.typeMsg = $('#SlackType').val();
  nodeParameters.data.msg = $('#SlackMessage').val();
  nodeParameters.setTitle(nodeParameters.title);
  $("#FormName").empty();
  $("#FormName").append("Edit function:  " + nodeParameters.title);

}

function updateGroup() {
  nodeParameters.title =  $('#GroupTitle').val().replace(/ /gi, '_');
  $('#GroupTitle').val(nodeParameters.title);
  nodeParameters.data.skip =  $('#GroupSkip').val();
  nodeParameters.data.list =  $('#GroupList').val();
  nodeParameters.data.casual =  $('#GroupCausual').val();

  if($('#GroupMethodeSkip').is(":checked")){nodeParameters.data.skipMethode = "skip";}
  if($('#GroupMethodeList').is(":checked")){nodeParameters.data.skipMethode = "list";}
  if($('#GroupMethodeCasual').is(":checked")){nodeParameters.data.casualMethode = true;}

  nodeParameters.setTitle(nodeParameters.title);
  $("#FormName").empty();
  $("#FormName").append("Edit function:  " + nodeParameters.title);
}

function getSettingsChannels(id_option) {
  $.ajax({
    type: 'GET',
    url: '/settings-channels/get-settings-channels',
    crossDomain: true,
    headers: { 
      "access_token": userToken,
      "select_option": id_option
    },
    contentType:'application/json; charset=utf-8',
    success: function(data) {
      console.log(data);
      document.getElementById("ImagingSettingChannels").innerHTML = data;
    },
    error: function (params) {
      console.log(params);
      document.getElementById("ImagingSettingChannels").innerHTML = params;
    }
  })
}

function getMosaicMask(id_mask) {
  $.ajax({
    type: 'GET',
    url: '/mosaic-masks/get-user-mosaic-masks',
    crossDomain: true,
    headers: { 
      "access_token": userToken,
      "select_option": id_mask
    },
    contentType:'application/json; charset=utf-8',
    success: function(data) {
      console.log(data);
      document.getElementById("MaskTypeID").innerHTML = data;
    },
    error: function (params) {
      console.log(params);
      document.getElementById("MaskTypeID").innerHTML = params;
    }
  })
}

function updateImaging() {
  nodeParameters.title =  $('#ImagingTitle').val().replace(/ /gi, '_');

  //getSettingsChannels();

  //console.log(nodeParameters);
  ($('#ImagingAutofocus').is(":checked")) ? nodeParameters.data.autofocus = true : nodeParameters.data.autofocus = false;
  ($('#AFLowerLimit').is(":checked")) ? nodeParameters.data.AFLowerLimit = true : nodeParameters.data.AFLowerLimit = false;
  nodeParameters.data.ImagingAutofocusLower = $('#ImagingAutofocusLower').val();
  ($('#AFUpperLimit').is(":checked")) ? nodeParameters.data.AFUpperLimit = true : nodeParameters.data.AFUpperLimit = false;
  nodeParameters.data.ImagingAutofocusUpper = $('#ImagingAutofocusUpper').val();

  ($('#ImagingPicture').is(":checked")) ? nodeParameters.data.picture = true : nodeParameters.data.picture = false;
  nodeParameters.data.ImagingPictureNumber = $('#ImagingPictureNumber').val();

  ($('#ImagingZstack').is(":checked")) ? nodeParameters.data.zstack = true : nodeParameters.data.zstack = false;

  ($('#zstackUpper').is(":checked")) ? nodeParameters.data.zstackUpper = true : nodeParameters.data.zstackUpper = false;
  nodeParameters.data.zUpperLimit = $('#ImagingZstackUpper').val();

  ($('#zstackLower').is(":checked")) ? nodeParameters.data.zstackLower = true : nodeParameters.data.zstackLower = false;
  nodeParameters.data.zLowerLimit = $('#ImagingZstackLower').val();
  ($('#zstackStep').is(":checked")) ? nodeParameters.data.zstackStep = true : nodeParameters.data.zstackStep = false;
  nodeParameters.data.zstep = $('#ImagingZstackstep').val();

  ($('#zstackShutter').is(":checked")) ? nodeParameters.data.zstackShutter = true : nodeParameters.data.zstackShutter = false;


  nodeParameters.data.ImagingSettingChannel = $('#ImagingSettingChannels').val();

  if ($('#ImagingZstack').is(":checked")) {
    $("#ImagingZstackDiv").show();
  } else $("#ImagingZstackDiv").hide();

  if ($('#ImagingAutofocus').is(":checked")) {
    $("#ImagingAutofocusDiv").show();
  } else $("#ImagingAutofocusDiv").hide();
  
  nodeParameters.data.timeexposure = $('#ImagingMosaic').val();
  //console.log("var ", nodeParameters.data.ImagingSettingChannel, $('#ImagingSettingChannels').val());
  //nodeParameters.data.time_per_repetition =  $('#LoopTime').val();
  if($('#ImagingSeconde').is(":checked")){nodeParameters.data.unitTime = "s";}
  if($('#ImagingMinute').is(":checked")){nodeParameters.data.unitTime = "min";}

  //nodeParameters.data.mosaic = $('#ImagingSettingChannels').val();
  if($('#ImagingMosaic').is(":checked"))
  {
    nodeParameters.data.mosaic = true;
  } else {
    nodeParameters.data.mosaic = false;
  }
  if($('#MaskType').is(":checked"))
  {
    nodeParameters.data.MaskType = true;
  } else {
    nodeParameters.data.MaskType = false;
  }


  if($('#ImagingAllMask').is(":checked")){nodeParameters.data.ImagingStrategieMask = "all";}
  if($('#ImagingRoiMask').is(":checked")){nodeParameters.data.ImagingStrategieMask = "roi";}
  if($('#ImagingDynamicMask').is(":checked")){nodeParameters.data.ImagingStrategieMask = "dyn";}


  
  nodeParameters.setTitle(nodeParameters.title);
  $("#FormName").empty();
  $("#FormName").append("Edit function:  " + nodeParameters.title);
}

function getOptionGoto() {
  var gotoChildren = nodeParameters.children;
  var optionDisplay = "";

  if (gotoChildren == null) {
    return optionDisplay;
  }

  gotoChildren.forEach(element => {
    optionDisplay += '<option name='+ element.title  +' value=' + element.key + '>' + element.title + '</option>'
  })
  
  return optionDisplay;
}

function updateGoto () {
  nodeParameters.title =  $('#GotoTitle').val().replace(/ /gi, '_');

  //console.log(nodeParameters);
  $('#GroupTitle').val(nodeParameters.title);

  nodeParameters.data.who = $('#GotoType').val();

  nodeParameters.setTitle(nodeParameters.title);
  $("#FormName").empty();
  $("#FormName").append("Edit function:  " + nodeParameters.title);
}

function getOptionBreak(initNode, option = "") {
  var buffer = option;

  //console.log(initNode);
  if (initNode == null) {
    console.log(buffer);
    return buffer;
  }

  if (initNode.type == "LOOP") {
    buffer += '<option name='+ initNode.title  +' value=' + initNode.key + '>' + initNode.title + '</option>'
  }

  return getOptionBreak(initNode.parent, buffer)
}

function updateBreak() {
  nodeParameters.title =  $('#BreakTitle').val().replace(/ /gi, '_');

  //console.log(nodeParameters);
  $('#GroupTitle').val(nodeParameters.title);

  nodeParameters.data.who = $('#BreakType').val();

  nodeParameters.setTitle(nodeParameters.title);
  $("#FormName").empty();
  $("#FormName").append("Edit function:  " + nodeParameters.title);
}

function updateIf() {
  nodeParameters.title =  $('#IfTitle').val().replace(/ /gi, '_');

  //console.log(nodeParameters);
  $('#IfTitle').val(nodeParameters.title);

  nodeParameters.data.condition = $('#IfCondition').val();

  nodeParameters.setTitle(nodeParameters.title);
  $("#FormName").empty();
  $("#FormName").append("Edit function:  " + nodeParameters.title);
}

function updateLoop(){
  var nameType = '';
  nodeParameters.title =  $('#LoopTitle').val().replace(/ /gi, '_');
  $('#LoopTitle').val(nodeParameters.title);
  nodeParameters.data.nb_repetition =  $('#LoopRepeat').val();
  nameType = nameType + '| '+nodeParameters.data.repeat+'x [' ;
  nodeParameters.data.time_per_repetition =  $('#LoopTime').val();
  nameType = nameType + nodeParameters.data.time+'min]' ;
  nodeParameters.data.skip =  $('#LoopSkip').val();
  nameType = nameType + ' | skip['+nodeParameters.data.skip+']' ;
  $("#FormEsttimatedTime").empty();
  estimatedTime = parseInt($('#LoopTime').val()) * parseInt($('#LoopRepeat').val());
  console.log(estimatedTime);
  estimatedTimeD1 = parseInt(estimatedTime / 1440) ;
  estimatedTimeD2 = (estimatedTime % 1440) ;
  estimatedTimeH1 = parseInt(estimatedTimeD2 / 60) ;
  estimatedTimeH2 = (estimatedTimeD2 % 60) ;
  estimatedTimeM1 = parseInt(estimatedTimeH2) ;
  estimatedTimeS1 = parseInt(estimatedTimeM1 / 60) ;
  $("#lblActiveEsttimatedTime").append("<hr><label style='width:200px'>Estimated time of the loop:</label><label>"+estimatedTimeD1+' day - '+estimatedTimeH1+' hours - '+estimatedTimeM1+' min. - '+estimatedTimeS1+" sec.</label>");                      

  if($('#LoopExtend').is(":checked")){nameType = nameType + ' | extend[Yes]'; nodeParameters.data.extend = true;}
  else {nameType = nameType + ' | extend[No]'; nodeParameters.data.extend = false;}
  if($('#LoopWaiting').is(":checked")){nodeParameters.data.waiting = true;}
  else {nodeParameters.data.waiting = false;}
  if($('#LoopSeconde').is(":checked")){nodeParameters.data.unitTime = "s";}
  if($('#LoopMinute').is(":checked")){nodeParameters.data.unitTime = "min";}
  if($('#LoopMethodeSkip').is(":checked")){nodeParameters.data.skipMethode = "skip";}
  if($('#LoopMethodeList').is(":checked")){nodeParameters.data.skipMethode = "list";}
  nodeParameters.data.list = $("#LoopList").val();

  nodeParameters.setTitle(nodeParameters.title); //.split('|')[0]+nameType);
  $('#LoopTitle').val(nodeParameters.title.split('|')[0]);
  $("#FormName").empty();
  $("#FormName").append("Edit function:  " + nodeParameters.title);
}