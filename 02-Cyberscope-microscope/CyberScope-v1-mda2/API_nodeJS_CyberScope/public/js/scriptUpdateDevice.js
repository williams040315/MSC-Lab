/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\public\js\scriptUpdateDevice.js
 * Created Date: Friday, April 12th 2019, 3:34:12 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: function to update devices config
 * 
 * OpenSource
 */

var userToken = localStorage.getItem("access_token");

if (!userToken) {
    window.location.href = "/views/welcome";
}

/* CoolLed-pE4000 */

 function updateCoolledpe4000mosaic(name) {
     
    var La = document.getElementById("lambda-a-mosaic").value;
    var Lb = document.getElementById("lambda-b-mosaic").value;
    var Lc = document.getElementById("lambda-c-mosaic").value;
    var Ld = document.getElementById("lambda-d-mosaic").value;

    var Ia = document.getElementById("intensite-a-mosaic").value;
    var Ib = document.getElementById("intensite-b-mosaic").value;
    var Ic = document.getElementById("intensite-c-mosaic").value;
    var Id = document.getElementById("intensite-d-mosaic").value;

    var Sa = document.getElementById("shutter-a-mosaic").value;
    var Sb = document.getElementById("shutter-b-mosaic").value;
    var Sc = document.getElementById("shutter-c-mosaic").value;
    var Sd = document.getElementById("shutter-d-mosaic").value;

    var autoClose = document.getElementById("auto-close").value;

    $.ajax({
        type: 'POST',
        url : '/devices/update/coolledpe4000',
        crossDomain: true,
        data: '{ "access_token": "' + userToken + '", "device": "' + name + '", "mode": "manual", "action": "setChannelsValues", "auto_close": "' + autoClose + '", "La": "' + La + '" , "Lb": "' + Lb + '" , "Lc": "' + Lc + '" , "Ld": "' + Ld + '" , "Ia": "' + Ia + '" , "Ib": "' + Ib + '" , "Ic": "' + Ic + '" , "Id": "' + Id + '" , "Sa": "' + Sa + '" , "Sb": "' + Sb + '" , "Sc": "' + Sc + '" , "Sd": "' + Sd + '" }',
        contentType:'application/json; charset=utf-8',
        success: function(data) { // data is already parsed !!
            document.getElementById("alert-message").innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Success!</strong> ' + "CoolLed-pE4000 updated successfully" + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
        },
        error: function(jqXHR, textstatus, errorThrown) {
            if (jqXHR.responseText[0] == '{') {
                errorJSON = JSON.parse(jqXHR.responseText);
                error = errorJSON.error;
              }
              else {
                error = jqXHR.responseText;
              }
              document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';                }
      })
 }

 
 function updateCoolledpe4000fluo(name) {
     
  var La = document.getElementById("lambda-a-fluo").value;
  var Lb = document.getElementById("lambda-b-fluo").value;
  var Lc = document.getElementById("lambda-c-fluo").value;
  var Ld = document.getElementById("lambda-d-fluo").value;

  var Ia = document.getElementById("intensite-a-fluo").value;
  var Ib = document.getElementById("intensite-b-fluo").value;
  var Ic = document.getElementById("intensite-c-fluo").value;
  var Id = document.getElementById("intensite-d-fluo").value;

  var Sa = document.getElementById("shutter-a-fluo").value;
  var Sb = document.getElementById("shutter-b-fluo").value;
  var Sc = document.getElementById("shutter-c-fluo").value;
  var Sd = document.getElementById("shutter-d-fluo").value;

  var autoClose = document.getElementById("auto-close").value;

  $.ajax({
      type: 'POST',
      url : '/devices/update/coolledpe4000',
      crossDomain: true,
      data: '{ "access_token": "' + userToken + '", "device": "' + name + '", "mode": "manual", "action": "setChannelsValues", "auto_close": "' + autoClose + '", "La": "' + La + '" , "Lb": "' + Lb + '" , "Lc": "' + Lc + '" , "Ld": "' + Ld + '" , "Ia": "' + Ia + '" , "Ib": "' + Ib + '" , "Ic": "' + Ic + '" , "Id": "' + Id + '" , "Sa": "' + Sa + '" , "Sb": "' + Sb + '" , "Sc": "' + Sc + '" , "Sd": "' + Sd + '" }',
      contentType:'application/json; charset=utf-8',
      success: function(data) { // data is already parsed !!
          document.getElementById("alert-message").innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Success!</strong> ' + "CoolLed-pE4000 updated successfully" + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
      },
      error: function(jqXHR, textstatus, errorThrown) {
          if (jqXHR.responseText[0] == '{') {
              errorJSON = JSON.parse(jqXHR.responseText);
              error = errorJSON.error;
            }
            else {
              error = jqXHR.responseText;
            }
            document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';                }
    })
}

 function setAllChannelsClosed(name) {
  $.ajax({
    type: 'POST',
    url : '/devices/update/coolledpe4000',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '", "device": "' + name + '", "mode": "manual", "action": "setAllChannelsClosed", "auto_close": "2", "La": "2" , "Lb": "2" , "Lc": "2" , "Ld": "2" , "Ia": "2" , "Ib": "2" , "Ic": "2" , "Id": "2" , "Sa": "2" , "Sb": "2" , "Sc": "2" , "Sd": "2" }',
    contentType:'application/json; charset=utf-8',
    success: function(data) { // data is already parsed !!
        document.getElementById("alert-message").innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Success!</strong> ' + "CoolLed-pE4000 updated successfully" + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    },
    error: function(jqXHR, textstatus, errorThrown) {
        if (jqXHR.responseText[0] == '{') {
            errorJSON = JSON.parse(jqXHR.responseText);
            error = errorJSON.error;
          }
          else {
            error = jqXHR.responseText;
          }
          document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';                }
  })
 }

 function getAllChannelsValuesmosaic(scep, name) {
  $.ajax({
    type: 'POST',
    url : '/devices/update/coolledpe4000',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '", "device": "' + name + '", "mode": "manual", "action": "getChannelsValues", "auto_close": "2", "La": "2" , "Lb": "2" , "Lc": "2" , "Ld": "2" , "Ia": "2" , "Ib": "2" , "Ic": "2" , "Id": "2" , "Sa": "2" , "Sb": "2" , "Sc": "2" , "Sd": "2" }',
    contentType:'application/json; charset=utf-8',
    success: function(data) {
      //console.log(scep);
      if (scep == "poseCeTransistor") {
          document.getElementById("alert-message").innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Success!</strong> ' + "Datas successfully recovered" + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
      }
        data = JSON.parse(data);

        document.getElementById("lambda-a-mosaic").value = data.La;
        document.getElementById("lambda-b-mosaic").value = data.Lb;
        document.getElementById("lambda-c-mosaic").value = data.Lc;
        document.getElementById("lambda-d-mosaic").value = data.Ld;

        document.getElementById("intensite-a-mosaic").value = data.Ia;
        document.getElementById("intensite-b-mosaic").value = data.Ib;
        document.getElementById("intensite-c-mosaic").value = data.Ic;
        document.getElementById("intensite-d-mosaic").value = data.Id;

        document.getElementById("shutter-a-mosaic").value = data.Sa;
        document.getElementById("shutter-b-mosaic").value = data.Sb;
        document.getElementById("shutter-c-mosaic").value = data.Sc;
        document.getElementById("shutter-d-mosaic").value = data.Sd;

        document.getElementById("auto-close-mosaic").value = data.auto_close;
      },
    error: function(jqXHR, textstatus, errorThrown) {
        if (jqXHR.responseText[0] == '{') {
            errorJSON = JSON.parse(jqXHR.responseText);
            error = errorJSON.error;
          }
          else {
            error = jqXHR.responseText;
          }
          document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';                }
  })
 }

 function getAllChannelsValuesfluo(scep, name) {
  $.ajax({
    type: 'POST',
    url : '/devices/update/coolledpe4000',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '", "device": "' + name + '", "mode": "manual", "action": "getChannelsValues", "auto_close": "2", "La": "2" , "Lb": "2" , "Lc": "2" , "Ld": "2" , "Ia": "2" , "Ib": "2" , "Ic": "2" , "Id": "2" , "Sa": "2" , "Sb": "2" , "Sc": "2" , "Sd": "2" }',
    contentType:'application/json; charset=utf-8',
    success: function(data) {
      //console.log(scep);
      if (scep == "poseCeTransistor") {
          document.getElementById("alert-message").innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Success!</strong> ' + "Datas successfully recovered" + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
      }
        data = JSON.parse(data);
        document.getElementById("lambda-a-fluo").value = data.La;
        document.getElementById("lambda-b-fluo").value = data.Lb;
        document.getElementById("lambda-c-fluo").value = data.Lc;
        document.getElementById("lambda-d-fluo").value = data.Ld;

        document.getElementById("intensite-a-fluo").value = data.Ia;
        document.getElementById("intensite-b-fluo").value = data.Ib;
        document.getElementById("intensite-c-fluo").value = data.Ic;
        document.getElementById("intensite-d-fluo").value = data.Id;

        document.getElementById("shutter-a-fluo").value = data.Sa;
        document.getElementById("shutter-b-fluo").value = data.Sb;
        document.getElementById("shutter-c-fluo").value = data.Sc;
        document.getElementById("shutter-d-fluo").value = data.Sd;

        document.getElementById("auto-close").value = data.auto_close;
      },
    error: function(jqXHR, textstatus, errorThrown) {
        if (jqXHR.responseText[0] == '{') {
            errorJSON = JSON.parse(jqXHR.responseText);
            error = errorJSON.error;
          }
          else {
            error = jqXHR.responseText;
          }
          document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';                }
  })
 }

 /* !CoolLed-pE4000 */

 function updateOlympusIX71() {}
 function updateOlympusIX83() {}

 function updateCoolledpe300fluo() {}
 function updateCoolledpe300mosaic() {}

 function updateCoolledpe100fluo() {}
 function updateCoolledpe100mosaic() {}
 /* X-Cite */

 function updateXCite120PCMosaic() {
    var shutter = document.getElementById("shutter-mosaic-xcite120PC").value;
    var intensite = document.getElementById("intensite-mosaic-xcite120pc").value;

  $.ajax({
    type: 'POST',
    url : '/devices/update/xcite',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '", "action": "setChannelsValues", "device": "X-Cite-120PC-Mosaic", "shutter": "' + shutter + '", "intensity": "' + intensite + '" }',
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
          document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';                }
  })
}

 function updateXCite120PCFluo() {
    var shutter = document.getElementById("shutter-fluo-xcite120PC").value;
    var intensite = document.getElementById("intensite-fluo-xcite120pc").value;

  $.ajax({
    type: 'POST',
    url : '/devices/update/xcite',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '", "action": "setChannelsValues", "device": "X-Cite-120PC-Fluo", "shutter": "' + shutter + '", "intensity": "' + intensite + '" }',
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
          document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';                }
  })
}

function getAllChannelsValuesMosaicXCite(scep, device_name) {
  $.ajax({
    type: 'POST',
    url : '/devices/update/xcite',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '", "device": "' + device_name + '", "intensity": "1", "action": "getChannelsValues", "shutter": "ON" }',
    contentType:'application/json; charset=utf-8',
    success: function(data) {
      //console.log(scep);
      if (scep == "poseCeTransistor") {
          document.getElementById("alert-message").innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Success!</strong> ' + "Datas successfully recovered" + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
      }
        data = JSON.parse(data);
        document.getElementById("shutter-mosaic-xcite120PC").value = data.shutter; //TO_CHANGE
        document.getElementById("intensite-mosaic-xcite120pc").value = data.intensity; //TO_CHANGE
      },
    error: function(jqXHR, textstatus, errorThrown) {
        if (jqXHR.responseText[0] == '{') {
            errorJSON = JSON.parse(jqXHR.responseText);
            error = errorJSON.error;
          }
          else {
            error = jqXHR.responseText;
          }
          document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';                }
  })
}

function getAllChannelsValuesFluoXCite(scep, device_name) {
  $.ajax({
    type: 'POST',
    url : '/devices/update/xcite',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '", "device": "' + device_name + '", "intensity": "1", "action": "getChannelsValues", "shutter": "ON" }',
    contentType:'application/json; charset=utf-8',
    success: function(data) {
      //console.log(scep);
      if (scep == "poseCeTransistor") {
          document.getElementById("alert-message").innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Success!</strong> ' + "Datas successfully recovered" + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
      }
        data = JSON.parse(data);
        document.getElementById("shutter-fluo-xcite120PC").value = data.shutter; //TO_CHANGE
        document.getElementById("intensite-fluo-xcite120pc").value = data.intensity; //TO_CHANGE
      },
    error: function(jqXHR, textstatus, errorThrown) {
        if (jqXHR.responseText[0] == '{') {
            errorJSON = JSON.parse(jqXHR.responseText);
            error = errorJSON.error;
          }
          else {
            error = jqXHR.responseText;
          }
          document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';                }
  })
}

function setAllChannelsClosedXCite(device_name) {
  $.ajax({
    type: 'POST',
    url : '/devices/update/xcite',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '", "device": "' + device_name + '", "intensity": "1", "action": "setChannelClosed", "shutter": "ON" }',
    contentType:'application/json; charset=utf-8',
    success: function(data) {
      //console.log(scep);
        document.getElementById("alert-message").innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Success!</strong> ' + "Shutter successfully closed." + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
        data = JSON.parse(data);
        document.getElementById("shutter-mosaic-xcite120PC").value = data.shutter; //TO_CHANGE
        document.getElementById("intensite-mosaic-xcite120pc").value = data.intensity; //TO_CHANGE
      },
    error: function(jqXHR, textstatus, errorThrown) {
        if (jqXHR.responseText[0] == '{') {
            errorJSON = JSON.parse(jqXHR.responseText);
            error = errorJSON.error;
          }
          else {
            error = jqXHR.responseText;
          }
          document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';                }
  })
}

/* !X-Cite */

 function updateEvolv512(){
  var olympusShutter = document.getElementById("shutter-olympus-ix81").value;
    var olympusIntensity = document.getElementById("intensite-olympus-ix81").value;
    var olympusLamp = document.getElementById("lamp-olympus-ix81").value;
    var olympusWheelFilter = document.getElementById("wheel-filter-olympus-ix81").value;

  $.ajax({
    type: 'POST',
    url : '/devices/update/olympusix81',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '", "shutter": "' + olympusShutter + '", "intensity": "' + olympusIntensity + '", "lamp": "' + olympusLamp + '", "wheel_filter": "' + olympusWheelFilter + '" }',
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
          document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';                }
  })
 }

/* Olympus */

 function updateOlympusIX81(){

    var olympusShutter = document.getElementById("shutter-olympus-ix81").value;
    var olympusIntensity = document.getElementById("intensite-olympus-ix81").value;
    var olympusLamp = document.getElementById("lamp-olympus-ix81").value;
    var olympusWheelFilter = document.getElementById("wheel-filter-olympus-ix81").value;

  $.ajax({
    type: 'POST',
    url : '/devices/update/olympusix81',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '", "action": "setChannelsValues", "shutter": "' + olympusShutter + '", "intensity": "' + olympusIntensity + '", "lamp": "' + olympusLamp + '", "wheel_filter": "' + olympusWheelFilter + '" }',
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
          document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';                }
  })
 }

 function updateZAxis(mode, value) {
  $.ajax({
    type: 'POST',
    url : '/devices/update/z-axis',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '", "type": "' + mode + '", "zValue": "' + value + '", "action": "setZAxis" }',
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
          document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';                }
  })
 }

 /* !Olympus */

 function updatePriorMotionStage(x, y){
   console.log(x, y);
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
          document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';                }
  })
 }

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function myPause() {
  console.log('Taking a break...');
  await sleep(250);
  console.log('Quarter seconds later');
}


/*document.onkeydown = function(e) {
  
 switch (e.keyCode) {

      case 37:
          console.log('left');
          break;
      case 38:
          console.log('up');
          break;
      case 39:
          console.log('right');
          break;
      case 40:
          console.log('down');
          break;
  }
   //myPause();
};*/

 function updateAndorMosaic(){
     
 }
