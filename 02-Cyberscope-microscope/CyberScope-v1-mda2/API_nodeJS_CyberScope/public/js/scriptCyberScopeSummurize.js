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

function showMicroscopeSummurize() {
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
}

function showCurrentTime() {

}

window.onload = function() {
    clock();  
      function clock() {
      var now = new Date();
      var nbInMonth = now.getDate();
      var day = now.getDay();
      var month = now.getMonth() + 1;
      var year = now.getFullYear();
      var TwentyFourHour = now.getHours();
      var hour = now.getHours();
      var min = now.getMinutes();
      var sec = now.getSeconds();
      var mid = 'pm';
      if (sec < 10) {
          sec = "0" + sec;
      }
      if (min < 10) {
        min = "0" + min;
      }
      if (hour > 12) {
        hour = hour - 12;
      }    
      if(hour==0){ 
        hour=12;
      }
      if(TwentyFourHour < 12) {
         mid = 'am';
      }
      if (nbInMonth < 10) {
        nbInMonth = "0" + day;
      }
      if (month < 10) {
        month = "0" + month;
      }
    document.getElementById('currentTime').innerHTML = nbInMonth + '/' + month + '/' + year + " "+hour+':'+min+':'+sec +' '+mid ;
      setTimeout(clock, 1000);
      }
  }
  