/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\public\js\scriptDashboard.js
 * Created Date: Friday, April 5th 2019, 2:09:10 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Many stuff like API requests for the dashboard
 * 
 * OpenSource
 */

var userToken = localStorage.getItem("access_token");

if (!userToken) {
    window.location.href = "/views/welcome";
}

var email = null;
var name = null;

var equipementList = null;

$.ajax({
    type: 'POST',
    url : '/users/infos',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '" }',
    contentType:'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data) { // data is already parsed !!
      if (data.email) {
        email = data.email;
        name = data.name;
        document.getElementById("UserInfo").innerHTML = "Logged in as " + email;
      }
      else {
        email = "ERROR";
        name = "ERROR";
        document.getElementById("UserInfo").innerHTML = "data.error";
      }
    },
    error: function(jqXHR, textstatus, errorThrown) {
      if (jqXHR.responseText[0] == '{') {
        errorJSON = JSON.parse(jqXHR.responseText);
        error = errorJSON.error;
      }
      else {
        error = jqXHR.responseText;
      }
      document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    }
})

$.ajax({
  type: 'POST',
  url : '/equipements/infos',
  crossDomain: true,
  data: '{ "access_token": "' + userToken + '" }',
  contentType:'application/json; charset=utf-8',
//  dataType: 'json',
  success: function(data) { // data is already parsed !!
      document.getElementById("equipements-data").innerHTML = data;
  },
  error: function(jqXHR, textstatus, errorThrown) {
    if (jqXHR.responseText[0] == '{') {
      errorJSON = JSON.parse(jqXHR.responseText);
      error = errorJSON.error;
    }
    else {
      error = jqXHR.responseText;
    }
    document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
  }
})

function logout() {
    localStorage.removeItem("access_token");
    window.location.href = "/views/welcome";
}

function testSendToNodeRed() {
    $.ajax({
        type: 'GET',
        url : '/node-red/test',
        crossDomain: true,
        contentType:'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) { // data is already parsed !!
          if (data.message) {
            document.getElementById("NodeRedTest").innerHTML = data.message;
          }
          else {
    
          }
          
        },
        error: function(jqXHR, textstatus, errorThrown) {
          
        }
    })
}

function bookMyEquipement(equipementName) {
  $.ajax({
    type: 'POST',
    url : '/equipements/book',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '", "equipement_name": "' + equipementName + '" }',
    contentType:'application/json; charset=utf-8',
    success: function(data) { // data is already parsed !!
      document.getElementById("equipements-data").innerHTML = data;
    },
    error: function(jqXHR, textstatus, errorThrown) {
      if (jqXHR.responseText[0] == '{') {
        errorJSON = JSON.parse(jqXHR.responseText);
        error = errorJSON.error;
      }
      else {
        error = jqXHR.responseText;
      }
      document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    }
  })
}

function releaseMyEquipement(equipementName) {
  $.ajax({
    type: 'POST',
    url : '/equipements/release',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '", "equipement_name": "' + equipementName + '" }',
    contentType:'application/json; charset=utf-8',
    success: function(data) { // data is already parsed !!
      document.getElementById("equipements-data").innerHTML = data;
    },
    error: function(jqXHR, textstatus, errorThrown) {
      if (jqXHR.responseText[0] == '{') {
        errorJSON = JSON.parse(jqXHR.responseText);
        error = errorJSON.error;
      }
      else {
        error = jqXHR.responseText;
      }
      document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    }
  })
}

function showMain(equipementName) {
  $.ajax({
    type: 'POST',
    url : '/equipements/get-main',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '" }',
    contentType:'application/json; charset=utf-8',
    success: function(data) { // data is already parsed !!
      document.getElementById("equipements-data").innerHTML = data;
    },
    error: function(jqXHR, textstatus, errorThrown) {
      if (jqXHR.responseText[0] == '{') {
        errorJSON = JSON.parse(jqXHR.responseText);
        error = errorJSON.error;
      }
      else {
        error = jqXHR.responseText;
      }
      document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    }
  })
}

function showSettingsChannels(equipementName) {
  $.ajax({
    type: 'POST',
    url : '/settings-channels/get-settings-channels',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '" }',
    contentType:'application/json; charset=utf-8',
    success: function(data) { // data is already parsed !!
      document.getElementById("equipements-data").innerHTML = data;
      setAccordionVisibility("create42");
      fillAllSettingsChannels();
    },
    error: function(jqXHR, textstatus, errorThrown) {
      /*alert(jqXHR + textstatus + errorThrown);
      if (!jqXHR) {
        alert("KO");
      }*/
      if (jqXHR.responseText[0] == '{') {
        errorJSON = JSON.parse(jqXHR.responseText);
        error = errorJSON.error;
      }
      else {
        error = jqXHR.responseText;
      }
      document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    
    }
  })
}


function showMosaicMask(equipement_name) {
  $.ajax({
    type: 'POST',
    url : '/mosaic-masks/get-mosaic-masks',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '" }',
    contentType:'application/json; charset=utf-8',
    success: function(data) { // data is already parsed !!
      document.getElementById("equipements-data").innerHTML = data;
      initializeAllWPaint();
    },
    error: function(jqXHR, textstatus, errorThrown) {
      if (jqXHR.responseText[0] == '{') {
        errorJSON = JSON.parse(jqXHR.responseText);
        error = errorJSON.error;
      }
      else {
        error = jqXHR.responseText;
      }
      document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    
    }
  })
}

function initializeJoystick() {
  (function () {
    console.log("JoyStick has been initialize");
    var my_check = 0; // THIS VAR IS USED TO ALLOW ONLY ONE MOVE PER KEY PRESSED
    var KEYS = [];
    KEYS[32] = 'pressed';
    KEYS[37] = 'left';
    KEYS[38] = 'up';
    KEYS[39] = 'right';
    KEYS[40] = 'down';
    var joystick = document.getElementById('joystick');
    var keysDown = {};
    document.addEventListener('keydown', function (e) {
      if (my_check == 1) return; // NB OF MOVE PER KEY PRESSED
      my_check += 1;
      if (!KEYS[e.which]) return;
      e.preventDefault();
      keysDown[KEYS[e.which]] = true;
      updateJoystickClass();
      var myJoyStick = document.getElementById("joystick");

      /* JOYSTICK BUTTON DETECTION */

      if (myJoyStick.classList.contains("pressed")) {
        console.log("PICTURE");
      }

      /* JOYSTICK POSITION DETECTION */

      if (myJoyStick.classList.contains("up") && myJoyStick.classList.contains("right")) {
        updatePriorMotionStage("2000", "-2000");
        console.log("UP AND RIGHT");
      }

      else if (myJoyStick.classList.contains("right") && myJoyStick.classList.contains("down")) {
        updatePriorMotionStage("2000", "2000");
        console.log("RIGHT AND DOWN");
      }

      else if (myJoyStick.classList.contains("down") && myJoyStick.classList.contains("left")) {
        updatePriorMotionStage("-2000", "2000");
        console.log("DOWN AND LEFT");
      }

      else if (myJoyStick.classList.contains("left") && myJoyStick.classList.contains("up")) {
        updatePriorMotionStage("-2000", "-2000");
        console.log("LEFT AND UP");
      }

      else if (myJoyStick.classList.contains("down")) {
        updatePriorMotionStage("0", "2000");
        console.log("down");
      }

      else if (myJoyStick.classList.contains("up")) {
        updatePriorMotionStage("0", "-2000");
        console.log("up");
      }

      else if (myJoyStick.classList.contains("right")) {
        updatePriorMotionStage("2000", "0");
        console.log("right");
      }

      else if (myJoyStick.classList.contains("left")) {
        updatePriorMotionStage("-2000", "0");
        console.log("left");
      }

      /* END OF DETECTION */

    });
    document.addEventListener('keyup', function (e) {
      my_check = 0;
      if (!KEYS[e.which]) return;
      e.preventDefault();
      keysDown[KEYS[e.which]] = false;
      updateJoystickClass();
    });
    function updateJoystickClass() {
      var classNames = ['joystick'];
      Object.keys(keysDown).forEach(function (key) {
        if (keysDown[key]) classNames.push(key);
      });
      joystick.className = classNames.join(' ');
    }
  })();
}

/* WPAINT */

function saveImg(image) {
  var _this = this;

  $.ajax({
    type: 'POST',
    url: '/devices/update/mosaic',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '", "mask": "' + image + '" }',
    contentType:'application/json; charset=utf-8',
    success: function(data) { // data is already parsed !!
      document.getElementById("alert-message").innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Success</strong> Mosaic sucessfully updated!<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    },
    error: function(jqXHR, textstatus, errorThrown) {
      if (jqXHR.responseText[0] == '{') {
        errorJSON = JSON.parse(jqXHR.responseText);
        error = errorJSON.error;
      }
      else {
        error = jqXHR.responseText;
      }
      document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    }
  });
}

// init wPaint
function initializewPaint() {

  //MAKE A REQ TO GET NODE RED IP CAMERA

  $('#wPaint').wPaint({
    menuOffsetLeft: -35,
    menuOffsetTop: -50,
    saveImg: saveImg,
    menuOrientation: 'vertical',
    fillStyle: 'transparent',
    strokeStyle: '#000000',
    path: '/wpaint/'
  });
  $('.wPaint-menu-icon .wPaint-menu-icon-img').css('background-image', 'url("/wpaint_icons/icons-menu-main.png")');
  $('.wPaint-menu-colorpicker .wPaint-menu-icon-img').css('background-image', '');
  $('.wPaint-menu-icon-name-lineWidth .wPaint-menu-icon-img').css('background-image', '');
  $('.wPaint-menu-icon-name-strokeStyle .wPaint-menu-icon-img').css('background-image', '');
  $('.wPaint-menu-select-holder .wPaint-menu-icon-select-img').css('background-image', 'url("/wpaint_icons/icons-menu-main-shapes.png")');
  $('.wPaint-menu-icon-name-save .wPaint-menu-icon-img').css('background-image', 'url("/wpaint_icons/icons-menu-main-file.png")');
  $('.wPaint-menu-icon-name-loadBg .wPaint-menu-icon-img').css('background-image', 'url("/wpaint_icons/icons-menu-main-file.png")');
  $('.wPaint-menu-icon-name-fontSize .wPaint-menu-icon-img').css('background-image', '');
  $('.wPaint-menu-icon-name-fontFamily .wPaint-menu-icon-img').css('background-image', '');
  console.log("wPaint has been initialize");
}

/* !WPAINT */


function showManuel(equipementName) {
  $.ajax({
    type: 'POST',
    url : '/equipements/get-manuel',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '" }',
    contentType:'application/json; charset=utf-8',
    success: function(data) { // data is already parsed !!
      document.getElementById("equipements-data").innerHTML = data;
      initializeJoystick();
      initializewPaint();
      
    },
    error: function(jqXHR, textstatus, errorThrown) {
      if (jqXHR.responseText[0] == '{') {
        errorJSON = JSON.parse(jqXHR.responseText);
        error = errorJSON.error;
      }
      else {
        error = jqXHR.responseText;
      }
      document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    
    }
  })
}

function showAuto(equipementName) {
  $.ajax({
    type: 'POST',
    url : '/equipements/get-auto',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '" }',
    contentType:'application/json; charset=utf-8',
    success: function(data) { // data is already parsed !!
      document.getElementById("equipements-data").innerHTML = data;
    },
    error: function(jqXHR, textstatus, errorThrown) {
      if (jqXHR.responseText[0] == '{') {
        errorJSON = JSON.parse(jqXHR.responseText);
        error = errorJSON.error;
      }
      else {
        error = jqXHR.responseText;
      }
      document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    
    }
  })
}

function showAlarms(equipementName) {
  $.ajax({
    type: 'POST',
    url : '/equipements/get-alarms',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '" }',
    contentType:'application/json; charset=utf-8',
    success: function(data) { // data is already parsed !!
      document.getElementById("equipements-data").innerHTML = data;
    },
    error: function(jqXHR, textstatus, errorThrown) {
      if (jqXHR.responseText[0] == '{') {
        errorJSON = JSON.parse(jqXHR.responseText);
        error = errorJSON.error;
      }
      else {
        error = jqXHR.responseText;
      }
      document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    
    }
  })
}
