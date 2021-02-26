/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\public\js\scriptUserSettings.js
 * Created Date: Monday, April 8th 2019, 12:19:35 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Edit user settings
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

function requestChangePassword()
{
  var password = document.getElementById("first-password").value;
  var confirm_password = document.getElementById("confirm-password").value;

  if (password != confirm_password) {
    document.getElementById("alerts-password").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> Passwords are different<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    return (1);
  }

  if (password.length <= 3) {
    document.getElementById("alerts-password").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> Password must contain at least 4 characters<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    return (1);
  }

  //INNER L'ALERTE

  $.ajax({
    type: 'POST',
    url : '/users-settings/update-password',
    crossDomain: true,
    data: '{ "password": "' + password + '", "confirm_password": "' + password + '", "access_token": "' + userToken + '" }',
    contentType:'application/json; charset=utf-8',
    dataType: 'json',
    success: function(data) {
      document.getElementById("alerts-password").innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Password updated!</strong> ' + data.name + ' you have successfully updated your password<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    },
    error: function(jqXHR, textstatus, errorThrown) {
      document.getElementById("alerts-password").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> Your password has not been updated<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    }
})
}