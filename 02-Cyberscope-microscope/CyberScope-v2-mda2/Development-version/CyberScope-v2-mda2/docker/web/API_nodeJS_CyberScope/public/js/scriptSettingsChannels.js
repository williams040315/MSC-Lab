/*
 * Filename: c:\Users\Natasha\Desktop\cyber-scope\public\js\scriptSettingsChannels.js
 * Created Date: Tuesday, May 7th 2019, 12:23:27 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Function to create and remove settings channels + some cool stuff
 * 
 * OpenSource
 */

var userToken = localStorage.getItem("access_token");

if (!userToken) {
    window.location.href = "/views/welcome";
}
/*
$.ajax({
    type: 'POST',
    url : '/equipements/infos',
    crossDomain: true,
    data: '{ "access_token": "' + userToken + '" }',
    contentType:'application/json; charset=utf-8',
  //  dataType: 'json',
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
      document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    }
  })*/

  function setAccordionVisibility(channel_name) {
      var first = document.getElementById(channel_name + "cbCoolLedpE4000fluo");
      var second = document.getElementById(channel_name + "cbCoolLedpE4000mosaic");
      var third = document.getElementById(channel_name + "cbCoolLedpE100fluo");
      var fourth = document.getElementById(channel_name + "cbCoolLedpE100mosaic");
      var fifth = document.getElementById(channel_name + "cbCoolLedpE300fluo");
      var sixth = document.getElementById(channel_name + "cbCoolLedpE300mosaic");
      var seven = document.getElementById(channel_name + "cbXCite120PCfluo");
      var eight = document.getElementById(channel_name + "cbXCite120PCmosaic");
      var nine = document.getElementById(channel_name + "cbOlympusIX81");
      var ten = document.getElementById(channel_name + "cbOlympusIX83");
      var eleven = document.getElementById(channel_name + "cbOlympusIX71");

      if (!first.checked) {
        $( "#" + channel_name + "a-coolledpe4000fluo" ).hide();
      }
      else {
        $( "#" + channel_name + "a-coolledpe4000fluo" ).show();
      }

      if (!second.checked) {
        $( "#" + channel_name + "a-coolledpe4000mosaic" ).hide();
      }
      else {
        $( "#" + channel_name + "a-coolledpe4000mosaic" ).show();
      }

      if (!third.checked) {
        $( "#" + channel_name + "a-coolledpe100fluo" ).hide();
      }
      else {
        $( "#" + channel_name + "a-coolledpe100fluo" ).show();
      }

      if (!fourth.checked) {
        $( "#" + channel_name + "a-coolledpe100mosaic" ).hide();
      }
      else {
        $( "#" + channel_name + "a-coolledpe100mosaic" ).show();
      }

      if (!fifth.checked) {
        $( "#" + channel_name + "a-coolledpe300fluo" ).hide();
      }
      else {
        $( "#" + channel_name + "a-coolledpe300fluo" ).show();
      }

      if (!sixth.checked) {
        $( "#" + channel_name + "a-coolledpe300mosaic" ).hide();
      }
      else {
        $( "#" + channel_name + "a-coolledpe300mosaic" ).show();
      }

      if (!seven.checked) {
        $( "#" + channel_name + "a-xcite120pc-fluo" ).hide();
      }
      else {
        $( "#" + channel_name + "a-xcite120pc-fluo" ).show();
      }

      if (!eight.checked) {
        $( "#" + channel_name + "a-xcite120pc-mosaic" ).hide();
      }
      else {
        $( "#" + channel_name + "a-xcite120pc-mosaic" ).show();
      }

      if (!nine.checked) {
        $( "#" + channel_name + "a-olympusix81" ).hide();
      }
      else {
        $( "#" + channel_name + "a-olympusix81" ).show();
      }

      if (!ten.checked) {
        $( "#" + channel_name + "a-olympusix83" ).hide();
      }
      else {
        $( "#" + channel_name + "a-olympusix83" ).show();
      }

      if (!eleven.checked) {
        $( "#" + channel_name + "a-olympusix71" ).hide();
      }
      else {
        $( "#" + channel_name + "a-olympusix71" ).show();
      }
  }

  function createSettingChannel() {

    var channel_name = document.getElementById("create42scName").value;

    if (!channel_name || channel_name.length == 0) {
      document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> You need to provide a name for your setting channel.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
      return ;
    }

    var is4000f = document.getElementById("create42cbCoolLedpE4000fluo").checked;
    var is4000m = document.getElementById("create42cbCoolLedpE4000mosaic").checked;
    var is100f = document.getElementById("create42cbCoolLedpE100fluo").checked;
    var is100m = document.getElementById("create42cbCoolLedpE100mosaic").checked;
    var is300f = document.getElementById("create42cbCoolLedpE300fluo").checked;
    var is300m = document.getElementById("create42cbCoolLedpE300mosaic").checked;
    var isxc120pcf = document.getElementById("create42cbXCite120PCfluo").checked;
    var isxc120pcm = document.getElementById("create42cbXCite120PCmosaic").checked;
    var isix81 = document.getElementById("create42cbOlympusIX81").checked;
    var isix83 = document.getElementById("create42cbOlympusIX83").checked;
    var isix71 = document.getElementById("create42cbOlympusIX71").checked;


    var cl4000fla = document.getElementById("lambda-a-fluo").value;
    var cl4000flb = document.getElementById("lambda-b-fluo").value;
    var cl4000flc = document.getElementById("lambda-c-fluo").value;
    var cl4000fld = document.getElementById("lambda-d-fluo").value;
    var cl4000fia = document.getElementById("intensite-a-fluo").value;
    var cl4000fib = document.getElementById("intensite-b-fluo").value;
    var cl4000fic = document.getElementById("intensite-c-fluo").value;
    var cl4000fid = document.getElementById("intensite-d-fluo").value;
    var cl4000fsa = document.getElementById("shutter-a-fluo").value;
    var cl4000fsb = document.getElementById("shutter-b-fluo").value;
    var cl4000fsc = document.getElementById("shutter-c-fluo").value;
    var cl4000fsd = document.getElementById("shutter-d-fluo").value;

    var cl4000mla = document.getElementById("lambda-a-mosaic").value;
    var cl4000mlb = document.getElementById("lambda-b-mosaic").value;
    var cl4000mlc = document.getElementById("lambda-c-mosaic").value;
    var cl4000mld = document.getElementById("lambda-d-mosaic").value;
    var cl4000mia = document.getElementById("intensite-a-mosaic").value;
    var cl4000mib = document.getElementById("intensite-b-mosaic").value;
    var cl4000mic = document.getElementById("intensite-c-mosaic").value;
    var cl4000mid = document.getElementById("intensite-d-mosaic").value;
    var cl4000msa = document.getElementById("shutter-a-mosaic").value;
    var cl4000msb = document.getElementById("shutter-b-mosaic").value;
    var cl4000msc = document.getElementById("shutter-c-mosaic").value;
    var cl4000msd = document.getElementById("shutter-d-mosaic").value;

    var cl100fb = document.getElementById("band-fluo-pe100").value;
    var cl100fs = document.getElementById("shutter-fluo-pe100").value;
    var cl100fi = document.getElementById("intensite-fluo-pe100").value;

    var cl100mb = document.getElementById("band-mosaic-pe100").value;
    var cl100ms = document.getElementById("shutter-mosaic-pe100").value;
    var cl100mi = document.getElementById("intensite-mosaic-pe100").value;

    var cl300fba = document.getElementById("band-a-fluo-pe300").value;
    var cl300fbb = document.getElementById("band-b-fluo-pe300").value;
    var cl300fbc = document.getElementById("band-c-fluo-pe300").value;
    var cl300fs = document.getElementById("shutter-fluo-pe300").value;
    var cl300fi = document.getElementById("intensite-fluo-pe300").value;

    var cl300mba = document.getElementById("band-a-mosaic-pe300").value;
    var cl300mbb = document.getElementById("band-b-mosaic-pe300").value;
    var cl300mbc = document.getElementById("band-c-mosaic-pe300").value;
    var cl300ms = document.getElementById("shutter-mosaic-pe300").value;
    var cl300mi = document.getElementById("intensite-mosaic-pe300").value;

    var xc120pcfs = document.getElementById("shutter-fluo-xcite120PC").value;
    var xc120pcfi = document.getElementById("intensite-fluo-xcite120pc").value;

    var xc120pcms = document.getElementById("shutter-mosaic-xcite120PC").value;
    var xc120pcmi = document.getElementById("intensite-mosaic-xcite120pc").value;

    var olix81i = document.getElementById("intensite-olympus-ix81").value;
    var olix81s = document.getElementById("shutter-olympus-ix81").value;
    var olix81l = document.getElementById("lamp-olympus-ix81").value;
    var olix81w = document.getElementById("wheel-filter-olympus-ix81").value;

    var olix83i = document.getElementById("intensite-olympus-ix83").value;
    var olix83s = document.getElementById("shutter-olympus-ix83").value;
    var olix83l = document.getElementById("lamp-olympus-ix83").value;
    var olix83w = document.getElementById("wheel-filter-olympus-ix83").value;

    var olix71i = document.getElementById("intensite-olympus-ix71").value;
    var olix71s = document.getElementById("shutter-olympus-ix71").value;
    var olix71l = document.getElementById("lamp-olympus-ix71").value;
    var olix71w = document.getElementById("wheel-filter-olympus-ix71").value;

    $.ajax({
      type: 'POST',
      url : '/settings-channels/add-settings-channels',
      crossDomain: true,
      data: '{ "access_token": "' + userToken + '", "channel_name": "' + channel_name + '", "is4000f": "' + is4000f + '", "is4000m": "' + is4000m + '", "is100f": "' + is100f + '", "is100m": "' + is100m + '", "is300f": "' + is300f + '", "is300m": "' + is300m + '", "isxc120pcf": "' + isxc120pcf + '", "isxc120pcm": "' + isxc120pcm + '", "cl4000fla": "' + cl4000fla + '", "isix81": "' + isix81 + '", "isix83": "' + isix83 + '", "isix71": "' + isix71 + '", "cl4000flb": "' + cl4000flb + '", "cl4000flc": "' + cl4000flc + '", "cl4000fld": "' + cl4000fld + '", "cl4000fia": "' + cl4000fia + '", "cl4000fib": "' + cl4000fib + '", "cl4000fic": "' + cl4000fic + '", "cl4000fid": "' + cl4000fid + '", "cl4000fsa": "' + cl4000fsa + '", "cl4000fsb": "' + cl4000fsb + '", "cl4000fsc": "' + cl4000fsc + '", "cl4000fsd": "' + cl4000fsd + '", "cl4000mla": "' + cl4000mla + '", "cl4000mlb": "' + cl4000mlb + '", "cl4000mlc": "' + cl4000mlc + '", "cl4000mld": "' + cl4000mld + '", "cl4000mia": "' + cl4000mia + '", "cl4000mib": "' + cl4000mib + '", "cl4000mic": "' + cl4000mic + '", "cl4000mid": "' + cl4000mid + '", "cl4000msa": "' + cl4000msa + '", "cl4000msb": "' + cl4000msb + '", "cl4000msc": "' + cl4000msc + '", "cl4000msd": "' + cl4000msd + '", "cl100fb": "' + cl100fb + '", "cl100fs": "' + cl100fs + '", "cl100fi": "' + cl100fi + '", "cl100mb": "' + cl100mb + '", "cl100ms": "' + cl100ms + '", "cl100mi": "' + cl100mi + '", "cl300fba": "' + cl300fba + '", "cl300fbb": "' + cl300fbb + '", "cl300fbc": "' + cl300fbc + '", "cl300fs": "' + cl300fs + '", "cl300fi": "' + cl300fi + '", "cl300mba": "' + cl300mba + '", "cl300mbb": "' + cl300mbb + '", "cl300mbc": "' + cl300mbc + '", "cl300ms": "' + cl300ms + '", "cl300mi": "' + cl300mi + '", "xc120pcfs": "' + xc120pcfs + '", "xc120pcfi": "' + xc120pcfi + '", "xc120pcms": "' + xc120pcms + '", "xc120pcmi": "' + xc120pcmi + '", "olix81i": "' + olix81i + '", "olix81s": "' + olix81s + '", "olix81l": "' + olix81l + '", "olix81w": "' + olix81w + '", "olix83i": "' + olix83i + '", "olix83s": "' + olix83s + '", "olix83l": "' + olix83l + '", "olix83w": "' + olix83w + '", "olix71i": "' + olix71i + '", "olix71s": "' + olix71s + '", "olix71l": "' + olix71l + '", "olix71w": "' + olix71w + '" }',
      contentType:'application/json; charset=utf-8',
      success: function(data) {
        showSettingsChannels("Miss Marple"); //TO_CHANGE and MAKE A REQ TO RET THE CURRENT MICROSCOPE USED BY THE USER FROM ITS TOKEN
        document.getElementById("alert-message").innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Success!</strong> ' + data.status + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
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

  function updateSettingChannel(SettingChannelName) {

    var new_channel_name = $('#'+SettingChannelName+'scName').val();

    if (!new_channel_name || new_channel_name.length == 0) {
      document.getElementById("alert-message").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong> You need to provide a name for your setting channel.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
      return ;
    }

    var is4000f = $('#'+SettingChannelName+'cbCoolLedpE4000fluo').is(':checked');
    var is4000m = $('#'+SettingChannelName+'cbCoolLedpE4000mosaic').is(':checked');
    var is100f = $('#'+SettingChannelName+'cbCoolLedpE100fluo').is(':checked');
    var is100m = $('#'+SettingChannelName+'cbCoolLedpE100mosaic').is(':checked');
    var is300f = $('#'+SettingChannelName+'cbCoolLedpE300fluo').is(':checked');
    var is300m = $('#'+SettingChannelName+'cbCoolLedpE300mosaic').is(':checked');
    var isxc120pcf = $('#'+SettingChannelName+'cbXCite120PCfluo').is(':checked');
    var isxc120pcm = $('#'+SettingChannelName+'cbXCite120PCmosaic').is(':checked');
    var isix81 = $('#'+SettingChannelName+'cbOlympusIX81').is(':checked');
    var isix83 = $('#'+SettingChannelName+'cbOlympusIX83').is(':checked');
    var isix71 = $('#'+SettingChannelName+'cbOlympusIX71').is(':checked');


    var cl4000fla = $('#'+SettingChannelName+' #lambda-a-fluo').val();
    var cl4000flb = $('#'+SettingChannelName+' #lambda-b-fluo').val();
    var cl4000flc = $('#'+SettingChannelName+' #lambda-c-fluo').val();
    var cl4000fld = $('#'+SettingChannelName+' #lambda-d-fluo').val();
    var cl4000fia = $('#'+SettingChannelName+' #intensite-a-fluo').val();
    var cl4000fib = $('#'+SettingChannelName+' #intensite-b-fluo').val();
    var cl4000fic = $('#'+SettingChannelName+' #intensite-c-fluo').val();
    var cl4000fid = $('#'+SettingChannelName+' #intensite-d-fluo').val();
    var cl4000fsa = $('#'+SettingChannelName+' #shutter-a-fluo').val();
    var cl4000fsb = $('#'+SettingChannelName+' #shutter-b-fluo').val();
    var cl4000fsc = $('#'+SettingChannelName+' #shutter-c-fluo').val();
    var cl4000fsd = $('#'+SettingChannelName+' #shutter-d-fluo').val();

    var cl4000mla = $('#'+SettingChannelName+' #lambda-a-mosaic').val();
    var cl4000mlb = $('#'+SettingChannelName+' #lambda-b-mosaic').val();
    var cl4000mlc = $('#'+SettingChannelName+' #lambda-c-mosaic').val();
    var cl4000mld = $('#'+SettingChannelName+' #lambda-d-mosaic').val();
    var cl4000mia = $('#'+SettingChannelName+' #intensite-a-mosaic').val();
    var cl4000mib = $('#'+SettingChannelName+' #intensite-b-mosaic').val();
    var cl4000mic = $('#'+SettingChannelName+' #intensite-c-mosaic').val();
    var cl4000mid = $('#'+SettingChannelName+' #intensite-d-mosaic').val();
    var cl4000msa = $('#'+SettingChannelName+' #shutter-a-mosaic').val();
    var cl4000msb = $('#'+SettingChannelName+' #shutter-b-mosaic').val();
    var cl4000msc = $('#'+SettingChannelName+' #shutter-c-mosaic').val();
    var cl4000msd = $('#'+SettingChannelName+' #shutter-d-mosaic').val();

    var cl100fb = $('#'+SettingChannelName+' #band-fluo-pe100').val();
    var cl100fs = $('#'+SettingChannelName+' #shutter-fluo-pe100').val();
    var cl100fi = $('#'+SettingChannelName+' #intensite-fluo-pe100').val();

    var cl100mb = $('#'+SettingChannelName+' #band-mosaic-pe100').val();
    var cl100ms = $('#'+SettingChannelName+' #shutter-mosaic-pe100').val();
    var cl100mi = $('#'+SettingChannelName+' #intensite-mosaic-pe100').val();

    var cl300fba = $('#'+SettingChannelName+' #band-a-fluo-pe300').val();
    var cl300fbb = $('#'+SettingChannelName+' #band-b-fluo-pe300').val();
    var cl300fbc = $('#'+SettingChannelName+' #band-c-fluo-pe300').val();
    var cl300fs = $('#'+SettingChannelName+' #shutter-fluo-pe300').val();
    var cl300fi = $('#'+SettingChannelName+' #intensite-fluo-pe300').val();

    var cl300mba = $('#'+SettingChannelName+' #band-a-mosaic-pe300').val();
    var cl300mbb = $('#'+SettingChannelName+' #band-b-mosaic-pe300').val();
    var cl300mbc = $('#'+SettingChannelName+' #band-c-mosaic-pe300').val();
    var cl300ms = $('#'+SettingChannelName+' #shutter-mosaic-pe300').val();
    var cl300mi = $('#'+SettingChannelName+' #intensite-mosaic-pe300').val();

    var xc120pcfs = $('#'+SettingChannelName+' #shutter-fluo-xcite120PC').val();
    var xc120pcfi = $('#'+SettingChannelName+' #intensite-fluo-xcite120pc').val();

    var xc120pcms = $('#'+SettingChannelName+' #shutter-mosaic-xcite120PC').val();
    var xc120pcmi = $('#'+SettingChannelName+' #intensite-mosaic-xcite120pc').val();

    var olix81i = $('#'+SettingChannelName+' #intensite-olympus-ix81').val();
    var olix81s = $('#'+SettingChannelName+' #shutter-olympus-ix81').val();
    var olix81l = $('#'+SettingChannelName+' #lamp-olympus-ix81').val();
    var olix81w = $('#'+SettingChannelName+' #wheel-filter-olympus-ix81').val();

    var olix83i = $('#'+SettingChannelName+' #intensite-olympus-ix83').val();
    var olix83s = $('#'+SettingChannelName+' #shutter-olympus-ix83').val();
    var olix83l = $('#'+SettingChannelName+' #lamp-olympus-ix83').val();
    var olix83w = $('#'+SettingChannelName+' #wheel-filter-olympus-ix83').val();

    var olix71i = $('#'+SettingChannelName+' #intensite-olympus-ix71').val();
    var olix71s = $('#'+SettingChannelName+' #shutter-olympus-ix71').val();
    var olix71l = $('#'+SettingChannelName+' #lamp-olympus-ix71').val();
    var olix71w = $('#'+SettingChannelName+' #wheel-filter-olympus-ix71').val();
    
    $.ajax({
      type: 'POST',
      url : '/settings-channels/update-settings-channels',
      crossDomain: true,
      data: '{ "access_token": "' + userToken + '", "new_channel_name": "' + new_channel_name + '", "old_channel_name": "' + SettingChannelName + '", "is4000f": "' + is4000f + '", "is4000m": "' + is4000m + '", "is100f": "' + is100f + '", "is100m": "' + is100m + '", "is300f": "' + is300f + '", "is300m": "' + is300m + '", "isxc120pcf": "' + isxc120pcf + '", "isxc120pcm": "' + isxc120pcm + '", "isix81": "' + isix81 + '", "isix83": "' + isix83 + '", "isix71": "' + isix71 + '", "cl4000fla": "' + cl4000fla + '", "cl4000flb": "' + cl4000flb + '", "cl4000flc": "' + cl4000flc + '", "cl4000fld": "' + cl4000fld + '", "cl4000fia": "' + cl4000fia + '", "cl4000fib": "' + cl4000fib + '", "cl4000fic": "' + cl4000fic + '", "cl4000fid": "' + cl4000fid + '", "cl4000fsa": "' + cl4000fsa + '", "cl4000fsb": "' + cl4000fsb + '", "cl4000fsc": "' + cl4000fsc + '", "cl4000fsd": "' + cl4000fsd + '", "cl4000mla": "' + cl4000mla + '", "cl4000mlb": "' + cl4000mlb + '", "cl4000mlc": "' + cl4000mlc + '", "cl4000mld": "' + cl4000mld + '", "cl4000mia": "' + cl4000mia + '", "cl4000mib": "' + cl4000mib + '", "cl4000mic": "' + cl4000mic + '", "cl4000mid": "' + cl4000mid + '", "cl4000msa": "' + cl4000msa + '", "cl4000msb": "' + cl4000msb + '", "cl4000msc": "' + cl4000msc + '", "cl4000msd": "' + cl4000msd + '", "cl100fb": "' + cl100fb + '", "cl100fs": "' + cl100fs + '", "cl100fi": "' + cl100fi + '", "cl100mb": "' + cl100mb + '", "cl100ms": "' + cl100ms + '", "cl100mi": "' + cl100mi + '", "cl300fba": "' + cl300fba + '", "cl300fbb": "' + cl300fbb + '", "cl300fbc": "' + cl300fbc + '", "cl300fs": "' + cl300fs + '", "cl300fi": "' + cl300fi + '", "cl300mba": "' + cl300mba + '", "cl300mbb": "' + cl300mbb + '", "cl300mbc": "' + cl300mbc + '", "cl300ms": "' + cl300ms + '", "cl300mi": "' + cl300mi + '", "xc120pcfs": "' + xc120pcfs + '", "xc120pcfi": "' + xc120pcfi + '", "xc120pcms": "' + xc120pcms + '", "xc120pcmi": "' + xc120pcmi + '", "olix81i": "' + olix81i + '", "olix81s": "' + olix81s + '", "olix81l": "' + olix81l + '", "olix81w": "' + olix81w + '", "olix83i": "' + olix83i + '", "olix83s": "' + olix83s + '", "olix83l": "' + olix83l + '", "olix83w": "' + olix83w + '", "olix71i": "' + olix71i + '", "olix71s": "' + olix71s + '", "olix71l": "' + olix71l + '", "olix71w": "' + olix71w + '" }',
      contentType:'application/json; charset=utf-8',
      success: function(data) {
        showSettingsChannels("Miss Marple"); //TO_CHANGE and MAKE A REQ TO RET THE CURRENT MICROSCOPE USED BY THE USER FROM ITS TOKEN
        document.getElementById("alert-message").innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Success!</strong> ' + data.status + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
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

  function removeSettingChannel(SettingChannelName){
    $.ajax({
      type: 'POST',
      url : '/settings-channels/remove-settings-channels',
      crossDomain: true,
      data: '{ "access_token": "' + userToken + '", "channel_name": "' + SettingChannelName + '" }',
      contentType:'application/json; charset=utf-8',
      success: function(data) {
        showSettingsChannels("Miss Marple"); //TO_CHANGE and MAKE A REQ TO RET THE CURRENT MICROSCOPE USED BY THE USER FROM ITS TOKEN
        document.getElementById("alert-message").innerHTML = '<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Success!</strong> ' + SettingChannelName + ' successfully removed.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
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

  function fillAllSettingsChannels() {
    $.ajax({
      type: 'POST',
      url : '/settings-channels/get-settings-channels-from-db',
      crossDomain: true,
      data: '{ "access_token": "' + userToken + '" }',
      contentType:'application/json; charset=utf-8',
      success: function(data) {
        console.log("post succes result\n",data)
        for (var i = 0; i < data.length; i++) {
          $("#" + data[i].channel_name + "scName").val(data[i].channel_name);

          if (data[i].is_cl_4000_fluo == "false") {
            $("#" + data[i].channel_name + "cbCoolLedpE4000fluo").prop('checked', false);
          }
          else {
            $("#" + data[i].channel_name + "cbCoolLedpE4000fluo").prop('checked', true);
          }
          if (data[i].is_cl_4000_mosaic == "false") {
            $("#" + data[i].channel_name + "cbCoolLedpE4000mosaic").prop('checked', false);
          }
          else {
            $("#" + data[i].channel_name + "cbCoolLedpE4000mosaic").prop('checked', true);
          }
          if (data[i].is_cl_100_fluo == "false") {
            $("#" + data[i].channel_name + "cbCoolLedpE100fluo").prop('checked', false);
          }
          else {
            $("#" + data[i].channel_name + "cbCoolLedpE100fluo").prop('checked', true);
          }
          if (data[i].is_cl_100_mosaic == "false") {
            $("#" + data[i].channel_name + "cbCoolLedpE100mosaic").prop('checked', false);
          }
          else {
            $("#" + data[i].channel_name + "cbCoolLedpE100mosaic").prop('checked', true);
          }
          if (data[i].is_cl_300_fluo == "false") {
            $("#" + data[i].channel_name + "cbCoolLedpE300fluo").prop('checked', false);
          }
          else {
            $("#" + data[i].channel_name + "cbCoolLedpE300fluo").prop('checked', true);
          }
          if (data[i].is_cl_300_mosaic == "false") {
            $("#" + data[i].channel_name + "cbCoolLedpE300mosaic").prop('checked', false);
          }
          else {
            $("#" + data[i].channel_name + "cbCoolLedpE300mosaic").prop('checked', true);
          }
          if (data[i].is_xc_120_pc_fluo == "false") {
            $("#" + data[i].channel_name + "cbXCite120PCfluo").prop('checked', false);
          }
          else {
            $("#" + data[i].channel_name + "cbXCite120PCfluo").prop('checked', true);
          }
          if (data[i].is_xc_120_pc_mosaic == "false") {
            $("#" + data[i].channel_name + "cbXCite120PCmosaic").prop('checked', false);
          }
          else {
            $("#" + data[i].channel_name + "cbXCite120PCmosaic").prop('checked', true);
          }
          if (data[i].is_olympus_ix81 == "false") {
            $("#" + data[i].channel_name + "cbOlympusIX81").prop('checked', false);
          }
          else {
            $("#" + data[i].channel_name + "cbOlympusIX81").prop('checked', true);
          }
          if (data[i].is_olympus_ix83 == "false") {
            $("#" + data[i].channel_name + "cbOlympusIX83").prop('checked', false);
          }
          else {
            $("#" + data[i].channel_name + "cbOlympusIX83").prop('checked', true);
          }
          if (data[i].is_olympus_ix71 == "false") {
            $("#" + data[i].channel_name + "cbOlympusIX71").prop('checked', false);
          }
          else {
            $("#" + data[i].channel_name + "cbOlympusIX71").prop('checked', true);
          }

          $("#" + data[i].channel_name + " #lambda-a-fluo").val(data[i].cl_4000_fluo_la);
          $("#" + data[i].channel_name + " #lambda-b-fluo").val(data[i].cl_4000_fluo_lb);
          $("#" + data[i].channel_name + " #lambda-c-fluo").val(data[i].cl_4000_fluo_lc);
          $("#" + data[i].channel_name + " #lambda-d-fluo").val(data[i].cl_4000_fluo_ld);
          $("#" + data[i].channel_name + " #intensite-a-fluo").val(data[i].cl_4000_fluo_ia);
          $("#" + data[i].channel_name + " #intensite-b-fluo").val(data[i].cl_4000_fluo_ib);
          $("#" + data[i].channel_name + " #intensite-c-fluo").val(data[i].cl_4000_fluo_ic);
          $("#" + data[i].channel_name + " #intensite-d-fluo").val(data[i].cl_4000_fluo_id);
          $("#" + data[i].channel_name + " #shutter-a-fluo").val(data[i].cl_4000_fluo_sa);
          $("#" + data[i].channel_name + " #shutter-b-fluo").val(data[i].cl_4000_fluo_sb);
          $("#" + data[i].channel_name + " #shutter-c-fluo").val(data[i].cl_4000_fluo_sc);
          $("#" + data[i].channel_name + " #shutter-d-fluo").val(data[i].cl_4000_fluo_sd);

          $("#" + data[i].channel_name + " #lambda-a-mosaic").val(data[i].cl_4000_mosaic_la);
          $("#" + data[i].channel_name + " #lambda-b-mosaic").val(data[i].cl_4000_mosaic_lb);
          $("#" + data[i].channel_name + " #lambda-c-mosaic").val(data[i].cl_4000_mosaic_lc);
          $("#" + data[i].channel_name + " #lambda-d-mosaic").val(data[i].cl_4000_mosaic_ld);
          $("#" + data[i].channel_name + " #intensite-a-mosaic").val(data[i].cl_4000_mosaic_ia);
          $("#" + data[i].channel_name + " #intensite-b-mosaic").val(data[i].cl_4000_mosaic_ib);
          $("#" + data[i].channel_name + " #intensite-c-mosaic").val(data[i].cl_4000_mosaic_ic);
          $("#" + data[i].channel_name + " #intensite-d-mosaic").val(data[i].cl_4000_mosaic_id);
          $("#" + data[i].channel_name + " #shutter-a-mosaic").val(data[i].cl_4000_mosaic_sa);
          $("#" + data[i].channel_name + " #shutter-b-mosaic").val(data[i].cl_4000_mosaic_sb);
          $("#" + data[i].channel_name + " #shutter-c-mosaic").val(data[i].cl_4000_mosaic_sc);
          $("#" + data[i].channel_name + " #shutter-d-mosaic").val(data[i].cl_4000_mosaic_sd);

          $("#" + data[i].channel_name + " #band-fluo-pe100").val(data[i].cl_100_fluo_b);
          $("#" + data[i].channel_name + " #shutter-fluo-pe100").val(data[i].cl_100_fluo_s);
          $("#" + data[i].channel_name + " #intensite-fluo-pe100").val(data[i].cl_100_fluo_i);

          $("#" + data[i].channel_name + " #band-mosaic-pe100").val(data[i].cl_100_mosaic_b);
          $("#" + data[i].channel_name + " #shutter-mosaic-pe100").val(data[i].cl_100_mosaic_s);
          $("#" + data[i].channel_name + " #intensite-mosaic-pe100").val(data[i].cl_100_mosaic_i);
        
          $("#" + data[i].channel_name + " #band-a-fluo-pe300").val(data[i].cl_300_fluo_ba);
          $("#" + data[i].channel_name + " #band-b-fluo-pe300").val(data[i].cl_300_fluo_bb);
          $("#" + data[i].channel_name + " #band-c-fluo-pe300").val(data[i].cl_300_fluo_bc);
          $("#" + data[i].channel_name + " #shutter-fluo-pe300").val(data[i].cl_300_fluo_i);
          $("#" + data[i].channel_name + " #intensite-fluo-pe300").val(data[i].cl_300_fluo_s);

          $("#" + data[i].channel_name + " #band-a-mosaic-pe300").val(data[i].cl_300_mosaic_ba);
          $("#" + data[i].channel_name + " #band-b-mosaic-pe300").val(data[i].cl_300_mosaic_bb);
          $("#" + data[i].channel_name + " #band-c-mosaic-pe300").val(data[i].cl_300_mosaic_bc);
          $("#" + data[i].channel_name + " #shutter-mosaic-pe300").val(data[i].cl_300_mosaic_i);
          $("#" + data[i].channel_name + " #intensite-mosaic-pe300").val(data[i].cl_300_mosaic_s);

          $("#" + data[i].channel_name + " #shutter-fluo-xcite120PC").val(data[i].xc_120_pc_fluo_s);
          $("#" + data[i].channel_name + " #intensite-fluo-xcite120pc").val(data[i].xc_120_pc_fluo_i);

          $("#" + data[i].channel_name + " #shutter-mosaic-xcite120PC").val(data[i].xc_120_pc_mosaic_s);
          $("#" + data[i].channel_name + " #intensite-mosaic-xcite120pc").val(data[i].xc_120_pc_mosaic_i);

          $("#" + data[i].channel_name + " #intensite-olympus-ix81").val(data[i].olix81_i);
          $("#" + data[i].channel_name + " #shutter-olympus-ix81").val(data[i].olix81_s);
          $("#" + data[i].channel_name + " #lamp-olympus-ix81").val(data[i].olix81_l);
          $("#" + data[i].channel_name + " #wheel-filter-olympus-ix81").val(data[i].olix81_w);

          $("#" + data[i].channel_name + " #intensite-olympus-ix83").val(data[i].olix83_i);
          $("#" + data[i].channel_name + " #shutter-olympus-ix83").val(data[i].olix83_s);
          $("#" + data[i].channel_name + " #lamp-olympus-ix83").val(data[i].olix83_l);
          $("#" + data[i].channel_name + " #wheel-filter-olympus-ix83").val(data[i].olix83_w);

          $("#" + data[i].channel_name + " #intensite-olympus-ix71").val(data[i].olix71_i);
          $("#" + data[i].channel_name + " #shutter-olympus-ix71").val(data[i].olix71_s);
          $("#" + data[i].channel_name + " #lamp-olympus-ix71").val(data[i].olix71_l);
          $("#" + data[i].channel_name + " #wheel-filter-olympus-ix71").val(data[i].olix71_w);

          setAccordionVisibility(data[i].channel_name);
        }
      },
      error: function(jqXHR, textstatus, errorThrown) {
          console.log("post error result\n",jqXHR)

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
