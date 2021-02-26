var ws;
var wsUri = "ws:";
var loc = window.location;
var data = "" ;

var order = 'getSettingChannels' ;

if (loc.protocol === "https:") { wsUri = "wss:"; }
    wsUri += "//" + loc.host + loc.pathname.replace("missmarple","ws/missmarple");
function wsConnect() {
    ws = new WebSocket(wsUri);
    ws.onmessage = function(msg) {
        data = msg.data;
        data = JSON.parse(data);            
        if(order == 'getSettingChannels') SettingChannels('get');
    };
    ws.onopen = function() {
        document.getElementById('status').innerHTML = "Connected to server";
        setTimeout(function(){
            requestWS(order);
        },500);
    };
    ws.onclose = function() {
        document.getElementById('status').innerHTML = "Not connected - retry in 3 seconds ...";
        setTimeout(wsConnect,3000);
    };        
}
function requestWS(m) {
    if (ws) { ws.send(m); }
}

var settingsChannels = 0;
function SettingChannels(method){
    //get
    $("#setting_table_channel").empty();
    for(var scan=0; scan<data.length;scan++){
        settingsChannels = settingsChannels + 1 ;
        //alert(scan);
        $("#setting_table_channel").append('<table id="channel'+scan+'" class="table table-striped"></table>');
        $("#channel"+scan).append("<thead><tr><th></th><th>Name Channel</th><th>Light Source</th><th style='width:500px;'></th><th></th><th></th><th></th><th></th></tr></thead>");
        //var selectLightSource = 
        $("#channel"+scan).append("<tbody><tr><td id='chk"+scan+"'></td><td id='"+scan+"_name'></td><td id='option"+scan+"'></td><td id='config"+scan+"'></td><<td id='delete"+scan+"'></td></tr></tbody>");
        //$("#chk"+idCounter).append("<input id='chk_"+idCounter+"' type='checkbox'/>");
        $("#"+scan+"_name").append("<input required name='"+scan+"_channel' id='"+scan+"_channel 'type='text' value='"+data[scan]['name']+"' placeholder='channel " + scan + "'/>");
        $("#option"+scan).append("<select class='settings_select_device' name='"+scan+"_devices' id='"+scan+"_devices'></select>");
        
        for(var i=0; i<data.length;i++) $('#'+scan+'_devices').append("<option value=" + data[i]['device'] + ">" + data[i]['device']  + "</option>");
        $("#"+scan+"_devices option[value='"+data[scan]['device']+"']").prop('selected', true);
        
        for(var key in data[scan]["config"]) {
            for(var element=0; element<data[scan]['config'][key].length;element++){
                $("#config"+scan).append("<strong>"+key+":&nbsp;</strong>"+data[scan]['config'][key][element]+"&nbsp;");
            }
            $("#config"+scan).append("<br>");      
        }
        $("#delete"+scan).append("<button class='setting_button' name='del"+scan+"' id='del"+scan+"'>Delete</button>");
    }
    order = '';
    if(settingsChannels === 0) {$("#setting_button_save_channel").prop('disabled',true);}
    else { $("#setting_button_save_channel").prop('disabled',false);}
}


$(document).ready( function (){

      $(document).ready(function(){
          $("#alert-warning").hide();
          $("#alert-success").hide();
           setting();
      });
  
  // Variable to get ids for the checkboxes
  var obj_ini = {
      "CoolLed-PE4000": {
        "topic" : "Fluorescence1",
        "device" : "CoolLed-PE4000",
        "parameters" : {
          "Channel-ABCD" : {
            "A" : {
              "300" : true,
              "320" : false,
              "340" : false,
              "360" : false
            },
            "B" : {
              "400" : false,
              "420" : true,
              "440" : false,
              "460" : false
            },
            "C" : {
              "500" : false ,
              "520" : false,
              "540" : false,
              "560" : true
            },
            "D" : {
              "600" : true,
              "620" : false,
              "640" : false,
              "660" : false
            }
          },
          "Intensity-ABCD" : {
            "A" : 100,
            "B": 20,
            "C" : 40,
            "D": 90
            },
          "Shutter-ABCD" : {
            "A" : true,
            "B": false,
            "C": true,
            "D" : true
          }
        } 
      },
      "X-Cite 120PC": {
        "topic" : "Fluorescence2",
        "device" : "X-Cite 120PC",
        "parameters" : {
          "Intensity" : 20
          }
      },
      "Olympus IX81": {
        "topic" : "Bright field1",
        "device" : "Olympus IX81",
        "parameters" : {
          "Intensity" : 12
          }
      }
  };
  
/*    $('#test1').submit(function() {
  // Get all the forms elements and their values in one step
  alert('ettet');
  //var values = $(this).serialize();

  });
  function test1(){
      alert("ee");
  }
  
*/
  function alertmessage(msg,classmsg){
      $(classmsg).append(msg);
      $(classmsg).show();
      setTimeout(function(){
          $(classmsg).hide();
          $(classmsg).empty();
          },2000);
  }
  
  $("form[ajax=true]").submit(function(e) {        
      var id = $("form[ajax=true]").attr('id');
      e.preventDefault();       
      var form_data = $(this).serialize();
      //var form_data = JSON.stringify($(this).serializeArray());
      if(id==='setting_channel_form') form_data = "topicpost=setting_channel_form&" + form_data ;
      var form_url = $(this).attr("action");
      var form_method = $(this).attr("method").toUpperCase();
      $.ajax({
          url: form_url, 
          type: form_method,      
          data: form_data,     
//            dataType: "json",
          cache: false,
          success: function(returnhtml){                          
              alertmessage("<strong>Well done ! </strong>"+returnhtml,'#alert-success');
          }           
      });    
  });

  $(document).on('click', '.setting_button', function () {
      var id = this.id; //setting_button_add_channel
      if(id=='setting_button_add_channel'){
        idCounter ++;
        $("#setting_table_channel").append('<table id="channel'+idCounter+'" class="table table-striped"></table>');
        $("#channel"+idCounter).append("<thead><tr><th></th><th>Name Channel</th><th>Light Source</th><th style='width:500px;'></th><th></th><th></th><th></th><th></th></tr></thead>");
        //var selectLightSource = 
        $("#channel"+idCounter).append("<tbody><tr><td id='chk"+idCounter+"'></td><td id='"+idCounter+"_name'></td><td id='option"+idCounter+"'></td><td id='config"+idCounter+"'></td><<td id='delete"+idCounter+"'></td></tr></tbody>");
        //$("#chk"+idCounter).append("<input id='chk_"+idCounter+"' type='checkbox'/>");
        $("#"+idCounter+"_name").append("<input required name='"+idCounter+"_channel' id='"+idCounter+"_channel 'type='text' placeholder='channel " + idCounter + "'/>");
        $("#option"+idCounter).append("<select class='settings_select_device' name='"+idCounter+"_devices' id='"+idCounter+"_devices'></select>");
        
        for(var i=0; i<data.length;i++) $('#'+idCounter+'_devices').append("<option value=" + data[i]['device'] + ">" + data[i]['device']  + "</option>");
          
        //make(obj_ini,'#config'+idCounter, target,idCounter);
        build_object_settings_channels('#config'+idCounter);
        $("#delete"+idCounter).append("<button class='setting_button' name='del"+idCounter+"' id='del"+idCounter+"'>Delete</button>");
        
      }
/*        if(id='setting_button_save_channel'){
          //ws.send(obj_ini);
          ws.send(JSON.stringify(obj_ini));
      }
*/        
      if(id.substr(0,3) == 'del'){
          if (confirm("Delete this channel ?")) {
            $("#channel"+id.replace('del','')).remove();
          }
      }
  });
  
  $(document).on('change', '.settings_select_device', function () {
      var id = this.id; //settings_device1
      //alert(id);
      var selection = id.replace("_devices",""); //1
      //alert(selection);
      $('#config'+selection).closest("td").empty(); //remove td
      make(obj_ini,'#config'+selection,$( "#"+id+" option:selected" ).text(),idCounter); //build the new object
          
  });

  
  function build_object_settings_channels(where){
      //alert("e");
      for(var key in data[0]["config"]) {
          $(where).append("<strong>"+key+": </strong>"+data[0]['config'][key]+'<br>');
      //if(table===i) $("#"+idCounter+"_"+topic+"_"+key2+" option[value='"+i+"']").prop('selected', true);
                //
      }
      
  
  }
/*    function make(obj,where,target,idCounter){
    var str = target;  
    var topic = '';
    if(typeof obj[str] == 'object'){
      for(var key in obj[str]) {
        if(key === 'topic') topic = obj[str][key] ;
        if(typeof obj[str][key] == 'string'){$(where).append("<input readonly name='"+idCounter+"_"+key+"' id='"+idCounter+"_"+key+"' type='text' value='"+obj[str][key]+"'/><br>");}
        if(typeof obj[str][key] == 'object'){ //parameters
          for(var key2 in obj[str][key]) {
            $(where).append("<input  name='"+key2+"' id='"+key2+"'  disabled type='text' value='"+key2+"'/>"); //lambda, shutter
            if(typeof obj[str][key][key2] == 'number'){
                var table = obj[str][key][key2] ; // soit les valeurs lambda soit shutter
                $(where).append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");      
                //$(where).append("<select name='"+idCounter+"_"+topic+"_"+key2+"' id='"+idCounter+"_"+topic+"_"+key2+"'></select>");
                //for(var i=0;i<=100;i++){
                  $(where).append("<input name='"+idCounter+"_"+key+"_"+key2+"' id='"+idCounter+"_"+key+"_"+key2+"'  type='number' min='0' max='100' value='"+table+"'</>");
                  //if(table===i) $("#"+idCounter+"_"+topic+"_"+key2+" option[value='"+i+"']").prop('selected', true);
                //}
            }
            if(typeof obj[str][key][key2] == 'object'){
              for(var key3 in obj[str][key][key2]) { //A2, B2
                var table = obj[str][key][key2][key3] ; // soit les valeurs lambda soit shutter
                $(where).append("&nbsp;&nbsp;<label>"+key3+"</label>:&nbsp;");      
                $(where).append("<select name='"+idCounter+"_"+key+"_"+key2+"_"+key3+"' id='"+idCounter+"_"+key+"_"+key2+"_"+key3+"'></select>");
                if(typeof table == 'object'){
                    for(var key4 in obj[str][key][key2][key3]) { //A2, B2
                      //alert(key4);
                      $("#"+idCounter+"_"+key+"_"+key2+"_"+key3).append("<option value=" + key4  + ">" +key4 + "</option>");
                      if(obj[str][key][key2][key3][key4]) $("#"+idCounter+"_"+key+"_"+key2+"_"+key3+" option[value='"+key4+"']").prop('selected', true);
                    }
                }
                if(typeof table == 'boolean'){
                  $("#"+idCounter+"_"+key+"_"+key2+"_"+key3).append("<option value='0'>0</option>");
                  $("#"+idCounter+"_"+key+"_"+key2+"_"+key3).append("<option value='1'>1</option>");
                  if(table===true) $('#'+idCounter+"_"+key+"_"+key2+"_"+key3+' option[value="1"]').prop('selected', true);
                  else $('#'+idCounter+"_"+key+"_"+key2+"_"+key3+' option[value="0"]').prop('selected', true);
                }
                if(typeof table == 'number'){
                    for(var i=0;i<=100;i++){
                      $("#"+idCounter+"_"+key+"_"+key2+"_"+key3).append("<option value='"+i+"'>"+i+"</option>");
                      if(table===i) $("#"+idCounter+"_"+key+"_"+key2+"_"+key3+" option[value='"+i+"']").prop('selected', true);
                    }
                }
              }
            }
            $(where).append('<br>');
            
          }
        }
      }
    }
    str="";
  }
*/  
});


  function live_mode(){
  $(document).ready(function(){
    $("#live_mode").show();
    $("#settings").hide();
    $("#mda").hide();
    });
  $.get( "http://127.0.0.1:5000/liveOn", function( data ) {
    $( ".result" ).html( data );
    alert( "Load was performed." );
  });
}

function setting(){
  $(document).ready(function(){
    $("#live_mode").hide();
    $("#settings").show();
    $("#mda").hide();
    });
}

function mda(){
  $(document).ready(function(){
    $("#live_mode").hide();
    $("#settings").hide();
    $("#mda").show();
    });
  $.get( "http://127.0.0.1:5000/quit", function( data ) {
    $( ".result" ).html( data );
    alert( "Load was performed." );
  });
}

  function initialize(){
      //while(init===false);
      
  }
