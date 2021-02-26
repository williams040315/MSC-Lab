/*
 * Filename: c:\Users\Natasha\Desktop\cyber-scope\public\js\scriptAdminPanel.js
 * Created Date: Thursday, April 25th 2019, 2:52:59 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: 
 * 
 * OpenSource
 */

var userToken = localStorage.getItem("access_token");

if (!userToken) {
    window.location.href = "/views/welcome";
}

var email = null;
var name = null;

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
      alert("Error: Auth failed :/");
    }
})

function logout() {
    localStorage.removeItem("access_token");
    window.location.href = "/views/welcome";
}

function showMicroscopeTable() {
    $.ajax({
        type: 'POST',
        url : '/admin/list-microscope',
        crossDomain: true,
        data: '{ "access_token": "' + userToken + '" }',
        contentType:'application/json; charset=utf-8',
        success: function(data) { // data is already parsed !!
          document.getElementById("microscope-table").innerHTML = data;
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

function addMicroscope() {
    // SHOW LOADING ANIMATION
    var microscopeName = document.getElementById("microscope-name").value;
    var microscopeIP = document.getElementById("microscope-IP").value;

    if (!microscopeName || !microscopeIP) {
        document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> Bad input<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
        return ;
    }
    $.ajax({
        type: 'POST',
        url : '/admin/add-microscope',
        crossDomain: true,
        data: '{ "access_token": "' + userToken + '", "microscope_name": "' + microscopeName + '", "microscope_ip": "' + microscopeIP + '"}',
        contentType:'application/json; charset=utf-8',
        success: function(data) { // data is already parsed !!
            document.getElementById("alert-message").innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Success</strong> Microscope successfully added<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            showMicroscopeTable();
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
              showMicroscopeTable();
        }
    })
}

function removeMicroscope(microscopeName) {
    // SHOW LOADING ANIMATION
    $.ajax({
        type: 'POST',
        url : '/admin/remove-microscope',
        crossDomain: true,
        data: '{ "access_token": "' + userToken + '", "microscope_name": "' + microscopeName + '"}',
        contentType:'application/json; charset=utf-8',
        success: function(data) { // data is already parsed !!
            document.getElementById("alert-message").innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Success</strong> Microscope successfully removed<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            showMicroscopeTable();
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
              showMicroscopeTable();
        }
    })
}

showMicroscopeTable();