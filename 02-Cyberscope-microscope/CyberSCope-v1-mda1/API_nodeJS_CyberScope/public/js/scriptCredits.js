/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\public\js\scriptUserInfo.js
 * Created Date: Monday, April 8th 2019, 12:21:07 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Request the user information
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

function loadCreditsPicture() {
  var nb = 0;
  while (nb == 0 || nb == 10) {
    nb = Math.floor((Math.random() * 10) + 1);
  }
  document.getElementById("credits-pic").innerHTML = '<img class="img-fluid fit-picture" src="../images/credits/credits-' + nb + '.jpg" alt="Notre raïs à nous" />';
}

loadCreditsPicture();