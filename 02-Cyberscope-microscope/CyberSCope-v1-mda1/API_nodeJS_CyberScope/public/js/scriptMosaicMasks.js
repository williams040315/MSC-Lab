/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\routes\equipement.js
 * Created Date: Monday, April 8th 2019, 2:06:06 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Mosaic Masks script
 * 
 * OpenSource
 */

var userToken = localStorage.getItem("access_token");

if (!userToken) {
    window.location.href = "/views/welcome";
}

function initializeAllWPaint() {
    $.ajax({
      type: 'POST',
      url : '/mosaic-masks/get-user-mosaic-masks',
      crossDomain: true,
      data: '{ "access_token": "' + userToken + '" }',
      contentType:'application/json; charset=utf-8',
      success: function(data) { // data is already parsed !!
        $('#wPaint-creation').wPaint({
            menuOffsetLeft: -35,
            menuOffsetTop: -50,
            saveImg: saveImg,
            menuOrientation: 'vertical',
            fillStyle: 'transparent',
            strokeStyle: '#000000',
            path: '/wpaint/'
          });
          for (var i = 0; i < data.length; i++) {
              console.log(data[i]);
              document.getElementById(data[i].mask_name + "MaskName").value = data[i].mask_name;
            $('#wPaint-' + data[i].mask_name).wPaint({
                menuOffsetLeft: -35,
                menuOffsetTop: -50,
                image: data[i].b64_mask,
                menuOrientation: 'vertical',
                fillStyle: 'transparent',
                strokeStyle: '#000000',
                path: '/wpaint/'
              });
           }
           $('.wPaint-menu-icon .wPaint-menu-icon-img').css('background-image', 'url("/wpaint_icons/icons-menu-main.png")');
           $('.wPaint-menu-colorpicker .wPaint-menu-icon-img').css('background-image', '');
           $('.wPaint-menu-icon-name-lineWidth .wPaint-menu-icon-img').css('background-image', '');
           $('.wPaint-menu-icon-name-strokeStyle .wPaint-menu-icon-img').css('background-image', '');
           $('.wPaint-menu-select-holder .wPaint-menu-icon-select-img').css('background-image', 'url("/wpaint_icons/icons-menu-main-shapes.png")');
           $('.wPaint-menu-icon-name-save .wPaint-menu-icon-img').css('background-image', 'url("/wpaint_icons/icons-menu-main-file.png")');
           $('.wPaint-menu-icon-name-loadBg .wPaint-menu-icon-img').css('background-image', 'url("/wpaint_icons/icons-menu-main-file.png")');
           $('.wPaint-menu-icon-name-bold .wPaint-menu-icon-img').css('background-image', 'url("/wpaint_icons/icons-menu-text.png")');
           $('.wPaint-menu-icon-name-italic .wPaint-menu-icon-img').css('background-image', 'url("/wpaint_icons/icons-menu-text.png")');
           $('.wPaint-menu-icon-name-fontSize .wPaint-menu-icon-img').css('background-image', '');
           $('.wPaint-menu-icon-name-fontFamily .wPaint-menu-icon-img').css('background-image', '');
           
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

  function createMask() {
    //THE NAME IS IN newMaskName ID input
    var mask_name = document.getElementById("newMaskName").value;
    var b64_mask = $("#wPaint-creation").wPaint("image");
    if (!mask_name) {
        document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> Bad input<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
        return ;
    }
    $.ajax({
        type: 'POST',
        url : '/mosaic-masks/create-mosaic-masks',
        crossDomain: true,
        data: '{ "access_token": "' + userToken + '", "mask_name": "' + mask_name + '", "b64_mask": "' + b64_mask + '" }',
        contentType:'application/json; charset=utf-8',
        success: function(data) { // data is already parsed !!
            document.getElementById("alert-message").innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Success</strong> Mask ' + mask_name + ' successfully created.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            showMosaicMask("Miss Marple");
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

  function updateMask(mask_name) {
    var mask_name_new = document.getElementById(mask_name + "MaskName").value;
    var b64_mask = $("#wPaint-" + mask_name).wPaint("image");
    $.ajax({
        type: 'POST',
        url : '/mosaic-masks/update-mosaic-mask',
        crossDomain: true,
        data: '{ "access_token": "' + userToken + '", "mask_name": "' + mask_name + '", "mask_name_new": "' + mask_name_new + '", "b64_mask": "' + b64_mask + '" }',
        contentType:'application/json; charset=utf-8',
        success: function(data) { // data is already parsed !!
            document.getElementById("alert-message").innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Success</strong> Mask ' + mask_name + ' successfully updated.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            showMosaicMask("Miss Marple");
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

  function deleteMask(mask_name) {
    $.ajax({
        type: 'POST',
        url : '/mosaic-masks/delete-mosaic-mask',
        crossDomain: true,
        data: '{ "access_token": "' + userToken + '", "mask_name": "' + mask_name + '" }',
        contentType:'application/json; charset=utf-8',
        success: function(data) { // data is already parsed !!
            document.getElementById("alert-message").innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Success</strong> Mask ' + mask_name + ' successfully deleted.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            showMosaicMask("Miss Marple");
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
  
  function exportMask(mask_name) {
    $.ajax({
        type: 'POST',
        url : '/mosaic-masks/get-mosaic-mask-from-name',
        crossDomain: true,
        data: '{ "access_token": "' + userToken + '", "mask_name": "' + mask_name + '" }',
        contentType:'application/json; charset=utf-8',
        success: function(data) { // data is already parsed !!
            var image = new Image();
            image.src = data[0].b64_mask;

            var w = window.open("");
            w.document.write(image.outerHTML);
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

  function loadFromB64Mask() {
      var b64_mask = document.getElementById("B64_Mask").value;
      $('#wPaint-creation').wPaint('image', b64_mask);
  }