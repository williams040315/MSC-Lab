/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\public\js\scriptDashboard.js
 * Created Date: Friday, April 5th 2019, 2:09:10 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: MDA STUFF
 * 
 * OpenSource
 */

var userToken = localStorage.getItem("access_token");

if (!userToken) {
    window.location.href = "/views/welcome";
}

function loadSettingsChannelsInModal() {
  
}


$("#dropdownMenuButton").mouseover(function() {
  $('.dropdown').dropdown('toggle')
});
$(".dropdown-menu").mouseleave(function() {
  $('.dropdown').dropdown('hide')
});


function switchLive()
{
    if ($("#button-switch").text() == "Live ON") {
        $("#button-switch").removeClass("btn-success");
        $("#button-switch").addClass("btn-danger");
        $("#button-switch").html('Live OFF');
        document.getElementById("live-here").innerHTML = '<img id="cam" class="img-fluid " src="http://172.27.0.183:5000/video_feed" style="position:relative; ">';
    }
    else {
        $("#button-switch").removeClass("btn-danger");
        $("#button-switch").addClass("btn-success");
        $("#button-switch").html('Live ON');
        document.getElementById("live-here").innerHTML = '<img id="cam" class="img-fluid " src="/images/no_camera_signal.webp" style="position:relative;width: 512px !important; ">';
    }


}

function requestAutoFocus(option)
{
  var action;
  var zoffset
  if (option == 0) {
    zoffset = "0";
  }
  else {
    zoffset = $("#z-offset-value").text();
  }
  var objectif = $("#select-af-objectif").val();
    $.ajax({
        type: 'POST',
        url : '/devices/update/autofocus',
        crossDomain: true,
        data: '{ "access_token": "' + userToken + '", "action": "autoFocus", "obj": "'+objectif+'", "afnlmtValue": "300", "afflmtValue": "-300", "offset": "'+zoffset+'" }',
        contentType:'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) { // data is already parsed !!
          if (option == 0) {
            $("#z-offset-value").text(data.z);
          }
          $("#focus-status").removeClass("badge-danger");
          $("#focus-status").addClass("badge-success");
          $("#focus-status").text("Success");
          $("#success").click(function(){
            
            $.toast({
              heading:'Success',
              text:'Autofocus done!',
              icon:'success',
              loader: true,
              loaderBg: '#fff',
              showHideTransition: 'fade',
              hideAfter: 3000,
              allowToastClose: false,
              position: {
                left:100,
                top:30
              }
            })
          })
        },
        error: function(jqXHR, textstatus, errorThrown) {
          $("#focus-status").removeClass("badge-success");
          $("#focus-status").addClass("badge-danger");
          $("#focus-status").text("Failure");
          if (option == 0) {
            $("#z-offset-value").text("Error");
          }
            $.toast({
            heading: 'Error',
            text: 'Try again dans le plan focal!',
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

function reloadSettingsChannelsList(selectVal) {
  $.ajax({
    type: 'POST',
    url : '/mda/reload-settings-channels-list',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '" }',
    contentType:'application/json; charset=utf-8',
    //dataType: 'json',
    success: function(data) { // data is already parsed !!
      document.getElementById("setting-channel-to-apply").innerHTML = data;
      $("#setting-channel-to-apply").val(selectVal);
      $.toast({
        heading:'Success',
        text:'Settings channels successfully reloaded',
        icon:'success',
        loader: true,
        loaderBg: '#fff',
        showHideTransition: 'fade',
        hideAfter: 3000,
        allowToastClose: false,
        position: {
          left:100,
          top:30
        }
      })
    },
    error: function(jqXHR, textstatus, errorThrown) {
      $.toast({
        heading: 'Error',
        text: 'Cant get your settings channels!',
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

function reloadSettingChannel() {
  var selectVal = $( "#setting-channel-to-apply" ).val();
  reloadSettingsChannelsList(selectVal);
    var settingChannel = $( "#setting-channel-to-apply option:selected" ).text();
    if (settingChannel == "Select a setting channel...") {
      return;
    }
    console.log("Reload and");
    applySettingChannel();
}

function opencloseLight() {
    if ($("#button-switch-light").text() == "Light ON") {
      $("#button-switch-light").removeClass("btn-success");
      $("#button-switch-light").addClass("btn-danger");
      $("#button-switch-light").html('Light OFF');
      applySettingChannel();
      applyMosaicMask();
  }
  else {
      $("#button-switch-light").removeClass("btn-danger");
      $("#button-switch-light").addClass("btn-success");
      $("#button-switch-light").html('Light ON');
      shutdownAllLight();
    }
}

function shutdownAllLight() {
  console.log("ALL LIGHT OFF");
}

function applySettingChannel() {
  var settingChannel = $( "#setting-channel-to-apply option:selected" ).text();
  if (settingChannel == "Select a setting channel...") {
    return;
  }
  if ($("#button-switch-light").text() == "Light ON") { 
    return;
  }
  console.log("Applying setting channel: " + settingChannel);
}

function applyMosaicMask() {
  var mosaicMask = $( "#mosaic-mask-to-apply option:selected" ).text();
  if (mosaicMask == "Select a mosaic mask...") {
    return;
  }
  if ($("#button-switch-light").text() == "Light ON") { 
    return;
  }
  console.log("Applying mosaic mask: " + mosaicMask);
}

function reloadMosaicMasksList(selectVal) {
  $.ajax({
    type: 'POST',
    url : '/mda/reload-mosaic-masks-list',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '" }',
    contentType:'application/json; charset=utf-8',
    //dataType: 'json',
    success: function(data) { // data is already parsed !!
      document.getElementById("mosaic-mask-to-apply").innerHTML = data;
      $("#mosaic-mask-to-apply").val(selectVal);
      $.toast({
        heading:'Success',
        text:'Mosaic masks successfully reloaded',
        icon:'success',
        loader: true,
        loaderBg: '#fff',
        showHideTransition: 'fade',
        hideAfter: 3000,
        allowToastClose: false,
        position: {
          left:100,
          top:30
        }
      })
    },
    error: function(jqXHR, textstatus, errorThrown) {
      $.toast({
        heading: 'Error',
        text: 'Cant get your mosaic masks!',
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

function reloadMosaicMask() {
  var selectVal = $( "#mosaic-mask-to-apply" ).val();
  reloadMosaicMasksList(selectVal);
    var mosaicMask = $( "#mosaic-mask-to-apply option:selected" ).text();
    if (mosaicMask == "Select a setting channel...") {
      return;
    }
    console.log("Reload and");
    applyMosaicMask();
}

function setPositionValues(x, y) {
  $.ajax({
    type: 'POST',
    url : '/devices/update/priormotionstage',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '", "action": "setGRValues",  "x": "' + x + '", "y": "' + y + '" }',
    contentType:'application/json; charset=utf-8',
    success: function(data) { // data is already parsed !!
    },
    error: function(jqXHR, textstatus, errorThrown) {
        if (jqXHR.responseText[0] == '{') {
            errorJSON = JSON.parse(jqXHR.responseText);
            error = errorJSON.error;
          }
          else {
            error = jqXHR.responseText;
          }
        }
  })
  showCurrentPosition(1);
}

function myMovePlatine(direction) {
  var distance = document.getElementById("moving-length-value").value;
  if (direction == "UP") {
    setPositionValues(0, -4000);
    console.log("Moving UP");
  }
  else if (direction == "DOWN") {
    setPositionValues(0, 4000);
    console.log("Moving DOWN");
  }
  else if (direction == "LEFT") {
    setPositionValues(-4000, 0);
    console.log("Moving LEFT");
  }
  else if (direction == "RIGHT") {
    setPositionValues(4000, 0);
    console.log("Moving RIGHT");
  }
  else if (direction == "diagNW") {
    setPositionValues(-4000, -4000);
    console.log("Moving North West");
  }
  else if (direction == "diagNE") {
    setPositionValues(4000, -4000);
    console.log("Moving North East");
  }
  else if (direction == "diagSW") {
    setPositionValues(-4000, 4000);
    console.log("Moving South West");
  }
  else if (direction == "diagSE") {
    setPositionValues(4000, 4000);
    console.log("Moving South East");
  }
  else {
    console.log("Unknown direction: " + direction);
  }
  showCurrentPosition(1);
  console.log("Distance: " + distance);

}


function showMidCol()
{
    $.ajax({
        type: 'POST',
        url : '/mda/show-mid-col',
        crossDomain: true,
        data: '{ "access_token": "' + userToken + '" }',
        contentType:'application/json; charset=utf-8',
        //dataType: 'json',
        success: function(data) { // data is already parsed !!
            document.getElementById("configmda").innerHTML = data;
            document.getElementById("exposure-time").value = 100;
        },
        error: function(jqXHR, textstatus, errorThrown) {
          if (jqXHR.responseText[0] == '{') {
            errorJSON = JSON.parse(jqXHR.responseText);
            error = errorJSON.error;
          }
          else {
            error = jqXHR.responseText;
          }
          //MAKE A NICE MESSAGE FOR THE USER
        }
      })
}

showMidCol();

var toMove = true;

var mapping = {
  37: '.left',
  38: '.up',
  39: '.right',
  40: '.down' };

/*
$(document.documentElement).keydown(function (event) {
  if (event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40) {
    var key = mapping[event.keyCode];
    if (key) $(key).addClass('pressed');
    if (toMove) {
      switch (event.keyCode) {
        case 37:
          myMovePlatine("LEFT");
          break;
        case 38:
          myMovePlatine("UP");
          break;
        case 39:
          myMovePlatine("RIGHT");
          break;
        case 40:
          myMovePlatine("DOWN");
          break;
      }
      toMove = false;
    }
  }
});*/
/*
$(document.documentElement).keyup(function (event) {
  if (event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40) {
    toMove = true;
    var key = mapping[event.keyCode]; 
    if (key) $(key).removeClass('pressed');
  }
});*/

function smallMovingValues() {
  $("#moving-length-value").val("10");
}

function mediumMovingValues() {
  $("#moving-length-value").val("50");
}
function largeMovingValues() {
  $("#moving-length-value").val("100");
}

smallMovingValues();

function clickStyleArrowsKeys(classname) {
  $(classname).addClass("pressed");
}

function unClickStyleArrowsKeys(classname) {
  $(classname).removeClass("pressed");
}
/*
function requestInitFocus() {
  $.toast({
    heading: 'Error',
    text: 'Route hasnt been defined yet!',
    icon: 'error',
    loader: true,
    loaderBg: '#fff',
    showHideTransition: 'plain',
    hideAfter: 3000,
    position: {
      left: 100,
      top: 30
    }
  });
}
*/
function showLeftCol()
{
    $.ajax({
        type: 'POST',
        url : '/mda/show-left-col',
        crossDomain: true,
        data: '{ "access_token": "' + userToken + '" }',
        contentType:'application/json; charset=utf-8',
        //dataType: 'json',
        success: function(data) { // data is already parsed !!
            document.getElementById("protocol-settings").innerHTML = data;
            $("#update-protocol-formulaire").hide();
        },
        error: function(jqXHR, textstatus, errorThrown) {
          if (jqXHR.responseText[0] == '{') {
            errorJSON = JSON.parse(jqXHR.responseText);
            error = errorJSON.error;
          }
          else {
            error = jqXHR.responseText;
          }
          //MAKE A NICE MESSAGE FOR THE USER
        }
      })
}

showLeftCol();

 // PROTOCOL HERE
function updateAffichageCurrentProtocol() {
  var protocolName = $("#protocol-to-run :selected").text();
  if (protocolName == "New protocol") {
    $("#btn-run-protocol").html('Select a protocol');
    $("#btn-run-protocol").addClass("disabled");
    $("#create-protocol-formulaire").show();
    $("#update-protocol-formulaire").hide();
    var tree = $("#tree").fancytree('getTree');
    tree.reload(JSON.parse('[{"title": "protocol","config": 0,"comment": "","prefix": "","expanded": true,"type": "PROT"}]'));
    //EMPTY LE FANCY TREE
    return;
  }

  $("#btn-run-protocol").html('Run protocol ' + protocolName);
  $("#btn-run-protocol").removeClass("disabled");
  $("#create-protocol-formulaire").hide();
  $("#update-protocol-formulaire").show();

  // SHOW PROTOCOL IN FANCY TREE
  $.ajax({
    type: 'POST',
    url : '/protocols/get-protocol',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '", "protocol_name": "' + protocolName + '" }',
    contentType:'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data) { // data is already parsed !!
        initFancyTreeFromJSON(data.protocol_data);
        

    },
    error: function(jqXHR, textstatus, errorThrown) {
      if (jqXHR.responseText[0] == '{') {
        errorJSON = JSON.parse(jqXHR.responseText);
        error = errorJSON.error;
      }
      else {
        error = jqXHR.responseText;
      }
      var azertyError = error;
      $.toast({
        heading: 'Error',
        text: azertyError,
        icon: 'error',
        loader: true,
        loaderBg: '#fff',
        showHideTransition: 'plain',
        hideAfter: 3000,
        position: {
          left: 100,
          top: 30
        }
      });
    }
  })

}

function createProtocol(option) {
  var tree = $("#tree").fancytree("getTree");
    var d = tree.toDict(true);
    var protocolData = JSON.stringify(d);

    var protocolName;

    if (option == 1) {
      protocolName = $("#protocol-name").val();
    }
    else if (option == 2) {
      protocolName = $("#duplicate-protocol-name").val();
    }
  if (!protocolName) {
    $.toast({
      heading: 'Error',
      text: "Invalid protocol name.",
      icon: 'error',
      loader: true,
      loaderBg: '#fff',
      showHideTransition: 'plain',
      hideAfter: 3000,
      position: {
        left: 100,
        top: 30
      }
    });
    return ;
  }

  $.ajax({
    type: 'POST',
    url : '/protocols/create-protocol',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '", "protocol_name": "' + protocolName + '", "protocol_data": ' + JSON.stringify(d) + ' }',
    contentType:'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data) { // data is already parsed !!
      showLeftCol();
      var my_text = "ERROR IN PARAMETERS OPTIONS";
      if (option == 1) {
        my_text = 'Protocol created!';
      }
      else if (option == 2) {
        my_text = 'Protocol duplicated!';
      }
      $.toast({
        heading:'Success',
        text:my_text,
        icon:'success',
        loader: true,
        loaderBg: '#fff',
        showHideTransition: 'fade',
        hideAfter: 3000,
        allowToastClose: false,
        position: {
          left:100,
          top:30
        }
      })
      var tree = $("#tree").fancytree('getTree');
      tree.reload(JSON.parse('[{"title": "protocol","config": 0,"comment": "","prefix": "","expanded": true,"type": "PROT"}]'));
    },
    error: function(jqXHR, textstatus, errorThrown) {
      if (jqXHR.responseText[0] == '{') {
        errorJSON = JSON.parse(jqXHR.responseText);
        error = errorJSON.error;
      }
      else {
        error = jqXHR.responseText;
      }
      var azertyError = error;
      $.toast({
        heading: 'Error',
        text: azertyError,
        icon: 'error',
        loader: true,
        loaderBg: '#fff',
        showHideTransition: 'plain',
        hideAfter: 3000,
        position: {
          left: 100,
          top: 30
        }
      });
    }
  })
}

function duplicateProtocol() {
  createProtocol(2);
}

function updateProtocol() {
  var tree = $("#tree").fancytree("getTree");
    var d = tree.toDict(true);
    var protocolData = JSON.stringify(d);

    var protocolName = $("#protocol-to-run :selected").text();

  $.ajax({
    type: 'POST',
    url : '/protocols/update-protocol',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '", "protocol_name": "' + protocolName + '", "protocol_data": ' + JSON.stringify(d) + ' }',
    contentType:'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data) { // data is already parsed !!

      $.toast({
        heading:'Success',
        text:'Protocol updated!',
        icon:'success',
        loader: true,
        loaderBg: '#fff',
        showHideTransition: 'fade',
        hideAfter: 3000,
        allowToastClose: false,
        position: {
          left:100,
          top:30
        }
      })
    },
    error: function(jqXHR, textstatus, errorThrown) {
      if (jqXHR.responseText[0] == '{') {
        errorJSON = JSON.parse(jqXHR.responseText);
        error = errorJSON.error;
      }
      else {
        error = jqXHR.responseText;
      }
      var azertyError = error;
      $.toast({
        heading: 'Error',
        text: azertyError,
        icon: 'error',
        loader: true,
        loaderBg: '#fff',
        showHideTransition: 'plain',
        hideAfter: 3000,
        position: {
          left: 100,
          top: 30
        }
      });
    }
  })
}

function deleteProtocol() {
  var tree = $("#tree").fancytree("getTree");
    var d = tree.toDict(true);
    var protocolData = JSON.stringify(d);

    var protocolName = $("#protocol-to-run :selected").text();

  $.ajax({
    type: 'POST',
    url : '/protocols/remove-protocol',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '", "protocol_name": "' + protocolName + '", "protocol_data": ' + JSON.stringify(d) + ' }',
    contentType:'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data) { // data is already parsed !!

      $.toast({
        heading:'Success',
        text:'Protocol deleted!',
        icon:'success',
        loader: true,
        loaderBg: '#fff',
        showHideTransition: 'fade',
        hideAfter: 3000,
        allowToastClose: false,
        position: {
          left:100,
          top:30
        }
      })
      showLeftCol();
      var tree = $("#tree").fancytree('getTree');
      tree.reload(JSON.parse('[{"title": "protocol","config": 0,"comment": "","prefix": "","expanded": true,"type": "PROT"}]'));

      $("#btn-run-protocol").html('Select a protocol');
    $("#btn-run-protocol").addClass("disabled");
    $("#create-protocol-formulaire").show();
    $("#update-protocol-formulaire").hide();

    },
    error: function(jqXHR, textstatus, errorThrown) {
      if (jqXHR.responseText[0] == '{') {
        errorJSON = JSON.parse(jqXHR.responseText);
        error = errorJSON.error;
      }
      else {
        error = jqXHR.responseText;
      }
      var azertyError = error;
      $.toast({
        heading: 'Error',
        text: azertyError,
        icon: 'error',
        loader: true,
        loaderBg: '#fff',
        showHideTransition: 'plain',
        hideAfter: 3000,
        position: {
          left: 100,
          top: 30
        }
      });
    }
  })

}


function runProtocol() {
  var protocolName = $("#protocol-to-run :selected").text();
  if ($("#protocol-to-run").val() == 0) {
    return ;
  }
  $.ajax({
    type: 'POST',
    url : '/mda/run-protocol',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '", "protocol_name": "' + protocolName + '" }',
    contentType:'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data) { // data is already parsed !!
      console.log("PROTOCOL CURRENTLY RUNNING");
    },
    error: function(jqXHR, textstatus, errorThrown) {
      $.toast({
        heading: 'Error',
        text: 'Error on running protocol!',
        icon: 'error',
        loader: true,
        loaderBg: '#fff',
        showHideTransition: 'plain',
        hideAfter: 3000,
        position: {
          left: 100,
          top: 30
        }
      });
    }
  })
  console.log("Running protocol " +  protocolName);
}

function updateExposureTime() {
  var exposureTime = $("#exposure-time").val();
  if (!exposureTime || parseInt(exposureTime) < 1) {
    document.getElementById("exposure-time").value = 100;
  }
  console.log("New exposure time: " + exposureTime);
}

function showCurrentPosition(option) {

  $.ajax({
    type: 'POST',
    url : '/devices/update/priormotionstage',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '", "action": "getXYValues" }',
    contentType:'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data) { // data is already parsed !!
      $("#position-x").text(data.X);
      $("#position-y").text(data.Y);
      
    },
    error: function(jqXHR, textstatus, errorThrown) {
      $("#position-x").text("Unknown");
      $("#position-y").text("Unknown");
      $.toast({
        heading: 'Error',
        text: 'Cant get XY positions!',
        icon: 'error',
        loader: true,
        loaderBg: '#fff',
        showHideTransition: 'plain',
        hideAfter: 3000,
        position: {
          left: 100,
          top: 30
        }
      });
    }
  })
  if (option == 1) {
    return;
  }
  $.ajax({
    type: 'POST',
    url : '/devices/update/olympusix81',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '", "action": "getZPosition", "shutter": "OFF", "intensity": "15", "lamp": "OFF", "wheel_filter": "1" }',
    contentType:'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data) { // data is already parsed !!
      $("#position-z").text(data.z);
    },
    error: function(jqXHR, textstatus, errorThrown) {
      $("#position-z").text("Unknown");
      $.toast({
        heading: 'Error',
        text: 'Cant get Z position!',
        icon: 'error',
        loader: true,
        loaderBg: '#fff',
        showHideTransition: 'plain',
        hideAfter: 3000,
        position: {
          left: 100,
          top: 30
        }
      });
    }
  })
}

showCurrentPosition(0);

function takeAPicture() {
  var exposureTime = $("#exposure-time").val();
  var settingChannel = $("#setting-channel-to-apply option:selected").text();
  var lightStatus = $("#button-switch-light").text();

  if (settingChannel == "Select a setting channel...") {
    return;
  }
  if (!exposureTime || parseInt(exposureTime) < 1) {
    return ; 
  }

  console.log("Taking a picture with a exposure time of " + exposureTime + "ms, the setting channel: " + settingChannel + " and the light status is: " + lightStatus);
/*
  $.ajax({
    type: 'POST',
    url : 'TAKE_PICURE_ROUTE',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '" }',
    contentType:'application/json; charset=utf-8',
    //dataType: 'json',
    success: function(data) { // data is already parsed !!
        INNER L'IMG
       $('#modalPicture').modal('hide')
    },
    error: function(jqXHR, textstatus, errorThrown) {
       $('#modalPicture').modal('hide')
      if (jqXHR.responseText[0] == '{') {
        errorJSON = JSON.parse(jqXHR.responseText);
        error = errorJSON.error;
      }
      else {
        error = jqXHR.responseText;
      }
      //MAKE A NICE MESSAGE FOR THE USER
    }
  })*/
}

function abortPicture() {
  console.log("Abort picture");
}

function myEasterEgg() {

}

  /* TOAST */
  /* https://codepen.io/Aladini/pen/NbbQPL */

  /**
   * Exemple

      $.toast({
      heading: 'Error',
      text: 'Try again!',
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

   */

  "function"!=typeof Object.create&&(Object.create=function(t){function o(){}return o.prototype=t,new o}),function(t,o){"use strict";var i={_positionClasses:["bottom-left","bottom-right","top-right","top-left","bottom-center","top-center","mid-center"],_defaultIcons:["success","error","info","warning"],init:function(o){this.prepareOptions(o,t.toast.options),this.process()},prepareOptions:function(o,i){var s={};"string"==typeof o||o instanceof Array?s.text=o:s=o,this.options=t.extend({},i,s)},process:function(){this.setup(),this.addToDom(),this.position(),this.bindToast(),this.animate()},setup:function(){var o="";if(this._toastEl=this._toastEl||t("<div></div>",{"class":"jq-toast-single"}),o+='<span class="jq-toast-loader"></span>',this.options.allowToastClose&&(o+='<span class="close-jq-toast-single">&times;</span>'),this.options.text instanceof Array){this.options.heading&&(o+='<h2 class="jq-toast-heading">'+this.options.heading+"</h2>"),o+='<ul class="jq-toast-ul">';for(var i=0;i<this.options.text.length;i++)o+='<li class="jq-toast-li" id="jq-toast-item-'+i+'">'+this.options.text[i]+"</li>";o+="</ul>"}else this.options.heading&&(o+='<h2 class="jq-toast-heading">'+this.options.heading+"</h2>"),o+=this.options.text;this._toastEl.html(o),this.options.bgColor!==!1&&this._toastEl.css("background-color",this.options.bgColor),this.options.textColor!==!1&&this._toastEl.css("color",this.options.textColor),this.options.textAlign&&this._toastEl.css("text-align",this.options.textAlign),this.options.icon!==!1&&(this._toastEl.addClass("jq-has-icon"),-1!==t.inArray(this.options.icon,this._defaultIcons)&&this._toastEl.addClass("jq-icon-"+this.options.icon))},position:function(){"string"==typeof this.options.position&&-1!==t.inArray(this.options.position,this._positionClasses)?"bottom-center"===this.options.position?this._container.css({left:t(o).outerWidth()/2-this._container.outerWidth()/2,bottom:20}):"top-center"===this.options.position?this._container.css({left:t(o).outerWidth()/2-this._container.outerWidth()/2,top:20}):"mid-center"===this.options.position?this._container.css({left:t(o).outerWidth()/2-this._container.outerWidth()/2,top:t(o).outerHeight()/2-this._container.outerHeight()/2}):this._container.addClass(this.options.position):"object"==typeof this.options.position?this._container.css({top:this.options.position.top?this.options.position.top:"auto",bottom:this.options.position.bottom?this.options.position.bottom:"auto",left:this.options.position.left?this.options.position.left:"auto",right:this.options.position.right?this.options.position.right:"auto"}):this._container.addClass("bottom-left")},bindToast:function(){var t=this;this._toastEl.on("afterShown",function(){t.processLoader()}),this._toastEl.find(".close-jq-toast-single").on("click",function(o){o.preventDefault(),"fade"===t.options.showHideTransition?(t._toastEl.trigger("beforeHide"),t._toastEl.fadeOut(function(){t._toastEl.trigger("afterHidden")})):"slide"===t.options.showHideTransition?(t._toastEl.trigger("beforeHide"),t._toastEl.slideUp(function(){t._toastEl.trigger("afterHidden")})):(t._toastEl.trigger("beforeHide"),t._toastEl.hide(function(){t._toastEl.trigger("afterHidden")}))}),"function"==typeof this.options.beforeShow&&this._toastEl.on("beforeShow",function(){t.options.beforeShow()}),"function"==typeof this.options.afterShown&&this._toastEl.on("afterShown",function(){t.options.afterShown()}),"function"==typeof this.options.beforeHide&&this._toastEl.on("beforeHide",function(){t.options.beforeHide()}),"function"==typeof this.options.afterHidden&&this._toastEl.on("afterHidden",function(){t.options.afterHidden()})},addToDom:function(){var o=t(".jq-toast-wrap");if(0===o.length?(o=t("<div></div>",{"class":"jq-toast-wrap"}),t("body").append(o)):(!this.options.stack||isNaN(parseInt(this.options.stack,10)))&&o.empty(),o.find(".jq-toast-single:hidden").remove(),o.append(this._toastEl),this.options.stack&&!isNaN(parseInt(this.options.stack),10)){var i=o.find(".jq-toast-single").length,s=i-this.options.stack;s>0&&t(".jq-toast-wrap").find(".jq-toast-single").slice(0,s).remove()}this._container=o},canAutoHide:function(){return this.options.hideAfter!==!1&&!isNaN(parseInt(this.options.hideAfter,10))},processLoader:function(){if(!this.canAutoHide()||this.options.loader===!1)return!1;var t=this._toastEl.find(".jq-toast-loader"),o=(this.options.hideAfter-400)/1e3+"s",i=this.options.loaderBg,s=t.attr("style")||"";s=s.substring(0,s.indexOf("-webkit-transition")),s+="-webkit-transition: width "+o+" ease-in;                       -o-transition: width "+o+" ease-in;                       transition: width "+o+" ease-in;                       background-color: "+i+";",t.attr("style",s).addClass("jq-toast-loaded")},animate:function(){var t=this;if(this._toastEl.hide(),this._toastEl.trigger("beforeShow"),"fade"===this.options.showHideTransition.toLowerCase()?this._toastEl.fadeIn(function(){t._toastEl.trigger("afterShown")}):"slide"===this.options.showHideTransition.toLowerCase()?this._toastEl.slideDown(function(){t._toastEl.trigger("afterShown")}):this._toastEl.show(function(){t._toastEl.trigger("afterShown")}),this.canAutoHide()){var t=this;o.setTimeout(function(){"fade"===t.options.showHideTransition.toLowerCase()?(t._toastEl.trigger("beforeHide"),t._toastEl.fadeOut(function(){t._toastEl.trigger("afterHidden")})):"slide"===t.options.showHideTransition.toLowerCase()?(t._toastEl.trigger("beforeHide"),t._toastEl.slideUp(function(){t._toastEl.trigger("afterHidden")})):(t._toastEl.trigger("beforeHide"),t._toastEl.hide(function(){t._toastEl.trigger("afterHidden")}))},this.options.hideAfter)}},reset:function(o){"all"===o?t(".jq-toast-wrap").remove():this._toastEl.remove()},update:function(t){this.prepareOptions(t,this.options),this.setup(),this.bindToast()}};t.toast=function(t){var o=Object.create(i);return o.init(t,this),{reset:function(t){o.reset(t)},update:function(t){o.update(t)}}},t.toast.options={text:"",heading:"",showHideTransition:"fade",allowToastClose:!0,hideAfter:3e3,loader:!0,loaderBg:"#9EC600",stack:5,position:"bottom-left",bgColor:!1,textColor:!1,textAlign:"left",icon:!1,beforeShow:function(){},afterShown:function(){},beforeHide:function(){},afterHidden:function(){}}}(jQuery,window,document);

  /* !TOAST */