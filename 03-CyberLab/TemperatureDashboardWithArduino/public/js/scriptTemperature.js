/*
 * Filename: c:\Users\Natasha\Desktop\arduino\index.js
 * Created Date: Thursday, July 30th 2019, 2:25:19 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Arduino temp
 * 
 * OpenSource
 */

 function updateData() {
    $.ajax({
        type: 'GET',
        url : '/get-temperature',
        crossDomain: true,
        contentType:'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
          if (data.missMarpleOutside.status == "OK") {
              $('#7-temp').html(data.missMarpleOutside.temp + '°C');
              $('#7-status').html('Online');
              $('#7-status').removeClass("text-danger");
              $('#7-status').addClass("text-success");
              $('#7-port').html(data.missMarpleOutside.port);
          }
          else {
              $('#7-temp').html('Unknown temperature');
              $('#7-status').html('Offline');
              $('#7-status').removeClass("text-success");
              $('#7-status').addClass("text-danger");
              $('#7-port').html('Disconnected');
          }
          if (data.missMarpleInside.status == "OK") {
            $('#5-temp').html(data.missMarpleInside.temp + '°C');
            $('#5-status').html('Online');
            $('#5-status').removeClass("text-danger");
              $('#5-status').addClass("text-success");
            $('#5-port').html(data.missMarpleInside.port);
        }
        else {
            $('#5-temp').html('Unknown temperature');
            $('#5-status').html('Offline');
            $('#5-status').removeClass("text-success");
              $('#5-status').addClass("text-danger");
            $('#5-port').html('Disconnected');
        }
        if (data.pcEvolver.status == "OK") {
            $('#8-temp').html(data.pcEvolver.temp + '°C');
            $('#8-status').html('Online');
            $('#8-status').removeClass("text-danger");
              $('#8-status').addClass("text-success");
            $('#8-port').html(data.pcEvolver.port);
        }
        else {
            $('#8-temp').html('Unknown temperature');
            $('#8-status').html('Offline');
            $('#8-status').removeClass("text-success");
              $('#8-status').addClass("text-danger");
            $('#8-port').html('Disconnected');
        }
        if (data.room502.status == "OK") {
            $('#9-temp').html(data.room502.temp + '°C');
            $('#9-status').html('Online');
            $('#9-status').removeClass("text-danger");
              $('#9-status').addClass("text-success");
            $('#9-port').html(data.room502.port);
        }
        else {
            $('#9-temp').html('Unknown temperature');
            $('#9-status').html('Offline');
            $('#9-status').removeClass("text-success");
              $('#9-status').addClass("text-danger");
            $('#9-port').html('Disconnected');
        }
        },
        error: function(jqXHR, textstatus, errorThrown) {
            
        }
      })
 }

 updateData();
 setInterval("updateData()", 10000);