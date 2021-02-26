/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\routes\equipement.js
 * Created Date: Monday, April 8th 2019, 2:06:06 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Equipements infos and control routes
 * 
 * OpenSource
 */

const express = require('express');
var request = require('sync-request');
const { Token, validateToken } = require('../models/token');
const { User } = require('../models/user');
const { Equipement } = require('../models/equipement');
const { Devices_html } = require('../models/devices_html');
const { Settings_channel } = require('../models/settings_channel');
const router = express.Router();

const send_notifications = require('./send-notifications');
const globals = require('../globals');


router.post('/camera-feed', async (req, res) => {
    if (!req.body.access_token) {
        return res.status(400).send('{ "error": "You need to provide an access_token" }');
    }
    let userToken = await Token.findOne({ token: req.body.access_token });
     if (!userToken) {
         return res.status(400).send('{ "error": "Incorrect access_token." }');
     }
     let userInfo = await User.findOne({ email: userToken.email });
     if (!userInfo) {
        return res.status(400).send('{ "error": "Cannot find a user with this token." }');
    }
   return res.status(200).send('{ "camera_feed": "authorized" }');
});

function commentEstVotreBlanquette(equipementName)
{
    try {
        var resp = request('POST', globals.nodeRedIP + '/comment-est-votre-blanquette', {
            timeout: 5000,
            headers: { 'Authorization': globals.nodeRedToken },
            json: { microscope: equipementName },
        });
    }
    catch (error) {
        console.log(error);
        return ('<div class="alert alert-danger alert-dismissible fade show mt-4" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
    }
    var finalData = JSON.parse(resp.getBody('utf8'));
    if (finalData.status == "connected") {
        return ('OK<i class="fas fa-check-circle ml-2"></i>');
    }
    return ('KO<i class="fas fa-times-circle ml-2"></i>');
    //if network_status == KO ==> Cant book button
    
    // IF NOT CONNECTED
    //return ('KO<i class="fas fa-times-circle ml-2"></i>');
}

function listMicroscope(finalResponse) {
    var res = '<table class="table table-striped table-dark"><thead><tr><th scope="col">#</th><th scope="col">Name</th><th scope="col">Used since</th><th scope="col">Current user</th><th scope="col">IP address</th><th scope="col">Network Status</th><th scope="col">Book</th></tr></thead><tbody>';
    for (var i = 0; i < finalResponse.length; i++) {
        var j = i + 1;
        res += '<tr><th scope="row">'+ j + '</th>';
        res += '<td>' + finalResponse[i].equipement_name + '</td>';
        if (finalResponse[i].is_available == "false") {
            res += '<td>' + finalResponse[i].begin_time + '</td>';
            res += '<td>' + finalResponse[i].current_user + '</td>';
            res += '<td>' + finalResponse[i].ip_address + '</td>';
            var check = commentEstVotreBlanquette(finalResponse[i].equipement_name);
            res += '<td>' + check + '</td>';
            if (check.indexOf("OK") >= 0) {
                res += '<td>' + '<button class="btn btn-outline-danger my-2 my-sm-0 btn-sm" type="submit">Already in use</button>' + '</td>';
            }
            else {
                res += '<td>' + '<button class="btn btn-outline-danger my-2 my-sm-0 btn-sm" type="submit">Connection lost</button>' + '</td>';
            }
        }
        else {
            res += '<td> - </td>';
            res += '<td> - </td>';
            res += '<td>' + finalResponse[i].ip_address + '</td>';
            var check2 = commentEstVotreBlanquette(finalResponse[i].equipement_name);
            res += '<td>' + check2 + '</td>';
            if (check2.indexOf("OK") >= 0) {
                res += '<td>' + '<button class="btn btn-outline-success my-2 my-sm-0 btn-sm" type="submit" onclick="bookMyEquipement(\'' + finalResponse[i].equipement_name + '\')">Book Now</button>' + '</td>';
            }
            else {
                res += '<td>' + '<button class="btn btn-outline-danger my-2 my-sm-0 btn-sm" type="submit">Connection lost</button>' + '</td>';
            }
        }
        res += "</tr>";
    }
    res += '</tbody></table>';
    return res;
}

function listConnectedEquipement(stuff_name) // CARD OF ALL DEVICES WITH THEIR STATUS
{
    try {
        var resp = request('POST', globals.nodeRedIP + '/list-device-connected', { //list-device-card
            timeout: 5000,
            headers: { 'Authorization': globals.nodeRedToken },
            json: { microscope: stuff_name },
        });
    }
    catch (error) {
        console.log(error);
        return ('<div class="alert alert-danger alert-dismissible fade show mt-4" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><img src="https://i.giphy.com/media/Xjo8pbrphfVuw/giphy.webp">');
    }

    finalData = JSON.parse(resp.getBody('utf8'));
    //req node-red and build HTML from JSON response
    var connectedStuff = '<div class="row mt-4">';
//close and create a  new row div every 3 or 4 cards
    connectedStuff += '<div class="card col" style="width:300px"><img class="card-img-top mt-3" src="../images/devices/CoolLED-pE4000.jpg" alt="Card image">';
    connectedStuff += '<div class="card-body"><h4 class="card-title">CoolLed-pE4000 - Fluo</h4><p class="card-text">';
    if (finalData.CoolLed_pE4000_fluorescence == "connected") {
        connectedStuff += '<div class="alert alert-success"><strong align="center">Connected</strong></div>';
    }
    else {
        connectedStuff += '<div class="alert alert-danger"><strong align="center">Disconnected</strong></div>';
    }
    connectedStuff += '</p></div></div>';

    connectedStuff += '<div class="card col" style="width:300px"><img class="card-img-top mt-3" src="../images/devices/CoolLED-pE4000.jpg" alt="Card image">';
    connectedStuff += '<div class="card-body"><h4 class="card-title">CoolLed-pE4000 - Mosaïc</h4><p class="card-text">';
    if (finalData.CoolLed_pE4000_mosaic == "connected") {
        connectedStuff += '<div class="alert alert-success"><strong align="center">Connected</strong></div>';
    }
    else {
        connectedStuff += '<div class="alert alert-danger"><strong align="center">Disconnected</strong></div>';
    }
    connectedStuff += '</p></div></div>';

    connectedStuff += '<div class="card col" style="width:300px"><img class="card-img-top mt-3" src="../images/devices/CoolLED-pE300.jpg" alt="Card image">';
    connectedStuff += '<div class="card-body"><h4 class="card-title">CoolLed-pE300 - Fluo</h4>   <p class="card-text">';
    if (finalData.CoolLed_pE300_fluorescence == "connected") {
        connectedStuff += '<div class="alert alert-success"><strong align="center">Connected</strong></div>';
    }
    else {
        connectedStuff += '<div class="alert alert-danger"><strong align="center">Disconnected</strong></div>';
    }
    connectedStuff += '</p></div></div>';

    connectedStuff += '<div class="card col" style="width:300px"><img class="card-img-top mt-3" src="../images/devices/CoolLED-pE300.jpg" alt="Card image">';
    connectedStuff += '<div class="card-body"><h4 class="card-title">CoolLed-pE300 - Mosaïc</h4>   <p class="card-text">';
    if (finalData.CoolLed_pE300_mosaic == "connected") {
        connectedStuff += '<div class="alert alert-success"><strong align="center">Connected</strong></div>';
    }
    else {
        connectedStuff += '<div class="alert alert-danger"><strong align="center">Disconnected</strong></div>';
    }
    connectedStuff += '</p></div></div>';

    connectedStuff += '<div class="card col" style="width:300px"><img class="card-img-top mt-3" src="../images/devices/CoolLED-pE100.jpg" alt="Card image">';
    connectedStuff += '<div class="card-body"><h4 class="card-title">CoolLed-pE100 - Fluo</h4><p class="card-text">';
    if (finalData.CoolLed_pE100_fluorescence == "connected") {
        connectedStuff += '<div class="alert alert-success"><strong align="center">Connected</strong></div>';
    }
    else {
        connectedStuff += '<div class="alert alert-danger"><strong align="center">Disconnected</strong></div>';
    }
    connectedStuff += '</p></div></div>';

    connectedStuff += '</div>';

    connectedStuff += '<div class="row mt-4">';

    connectedStuff += '<div class="card col" style="width:300px"><img class="card-img-top mt-3" src="../images/devices/CoolLED-pE100.jpg" alt="Card image">';
    connectedStuff += '<div class="card-body"><h4 class="card-title">CoolLed-pE100 - Mosaïc</h4><p class="card-text">';
    if (finalData.CoolLed_pE100_mosaic == "connected") {
        connectedStuff += '<div class="alert alert-success"><strong align="center">Connected</strong></div>';
    }
    else {
        connectedStuff += '<div class="alert alert-danger"><strong align="center">Disconnected</strong></div>';
    }
    connectedStuff += '</p></div></div>';



    
//close and create a  new row div every 3 or 4 cards
    connectedStuff += '<div class="card col" style="width:300px"><img class="card-img-top mt-3" src="../images/devices/Andor-Zyla.jpg" alt="Card image">';
    connectedStuff += '<div class="card-body"><h4 class="card-title">Andor-Zyla</h4><p class="card-text">';
    if (finalData.Andor_Zyla == "connected") {
        connectedStuff += '<div class="alert alert-success"><strong align="center">Connected</strong></div>';
    }
    else {
        connectedStuff += '<div class="alert alert-danger"><strong align="center">Disconnected</strong></div>';
    }
    connectedStuff += '</p></div></div>';

    connectedStuff += '<div class="card col" style="width:300px"><img class="card-img-top mt-3" src="../images/devices/Andor-Mosaic-3.jpg" alt="Card image">';
    connectedStuff += '<div class="card-body"><h4 class="card-title">Andor-Mosaïc-3</h4><p class="card-text">';
    if (finalData.Andor_Mosaic_3 == "connected") {
        connectedStuff += '<div class="alert alert-success"><strong align="center">Connected</strong></div>';
    }
    else {
        connectedStuff += '<div class="alert alert-danger"><strong align="center">Disconnected</strong></div>';
    }
    connectedStuff += '</p></div></div>';

    connectedStuff += '<div class="card col" style="width:300px"><img class="card-img-top mt-3" src="../images/devices/X-Cite-120PC.jpg" alt="Card image">';
    connectedStuff += '<div class="card-body"><h4 class="card-title">X-Cite-120PC - Fluo</h4><p class="card-text">';
    if (finalData.X_Cite_120PC_fluorescence == "connected") {
        connectedStuff += '<div class="alert alert-success"><strong align="center">Connected</strong></div>';
    }
    else {
        connectedStuff += '<div class="alert alert-danger"><strong align="center">Disconnected</strong></div>';
    }
    connectedStuff += '</p></div></div>';

    connectedStuff += '<div class="card col" style="width:300px"><img class="card-img-top mt-3" src="../images/devices/X-Cite-120PC.jpg" alt="Card image">';
    connectedStuff += '<div class="card-body"><h4 class="card-title">X-Cite-120PC - Mosaïc</h4><p class="card-text">';
    if (finalData.X_Cite_120PC_mosaic == "connected") {
        connectedStuff += '<div class="alert alert-success"><strong align="center">Connected</strong></div>';
    }
    else {
        connectedStuff += '<div class="alert alert-danger"><strong align="center">Disconnected</strong></div>';
    }
    connectedStuff += '</p></div></div>';

    connectedStuff += '</div><div class="row mt-4">';

    connectedStuff += '<div class="card col" style="width:300px"><img class="card-img-top mt-3" src="../images/devices/Prior-Motion-Stage.jpg" alt="Card image">';
    connectedStuff += '<div class="card-body"><h4 class="card-title">Prior-Motion-Stage</h4><p class="card-text">';
    if (finalData.PriorScientific_V31XYZE == "connected") {
        connectedStuff += '<div class="alert alert-success"><strong align="center">Connected</strong></div>';
    }
    else {
        connectedStuff += '<div class="alert alert-danger"><strong align="center">Disconnected</strong></div>';
    }
    connectedStuff += '</p></div></div>';
    
    

    connectedStuff += '<div class="card col" style="width:300px"><img class="card-img-top mt-3" src="../images/devices/Evolv-512.jpg" alt="Card image">';
    connectedStuff += '<div class="card-body"><h4 class="card-title">Evolv512</h4><p class="card-text">';
    if (finalData.Evolv512 == "connected") {
        connectedStuff += '<div class="alert alert-success"><strong align="center">Connected</strong></div>';
    }
    else {
        connectedStuff += '<div class="alert alert-danger"><strong align="center">Disconnected</strong></div>';
    }
    connectedStuff += '</p></div></div>';

    connectedStuff += '<div class="card col" style="width:300px"><img class="card-img-top mt-3" src="img_avatar1.png" alt="Card image">';
    connectedStuff += '<div class="card-body"><h4 class="card-title">Fluigent-micro-fluidic-10-valves</h4><p class="card-text">';
    if (finalData.Fluigent_micro_fluidic_10_valves == "connected") {
        connectedStuff += '<div class="alert alert-success"><strong align="center">Connected</strong></div>';
    }
    else {
        connectedStuff += '<div class="alert alert-danger"><strong align="center">Disconnected</strong></div>';
    }
    connectedStuff += '</p></div></div>';

    connectedStuff += '<div class="card col" style="width:300px"><img class="card-img-top mt-3" src="img_avatar1.png" alt="Card image">';
    connectedStuff += '<div class="card-body"><h4 class="card-title">Lab513-micro-fluidic-5-valves</h4><p class="card-text">';
    if (finalData.Lab513_micro_fluidic_5_valves == "connected") {
        connectedStuff += '<div class="alert alert-success"><strong align="center">Connected</strong></div>';
    }
    else {
        connectedStuff += '<div class="alert alert-danger"><strong align="center">Disconnected</strong></div>';
    }
    connectedStuff += '</p></div></div>';

    connectedStuff += '<div class="card col" style="width:300px"><img class="card-img-top mt-3" src="../images/devices/Olympus-IX81.jpg" alt="Card image">';
    connectedStuff += '<div class="card-body"><h4 class="card-title">Olympus-IX81</h4><p class="card-text">';
    if (finalData.Olympus_IX81 == "connected") {
        connectedStuff += '<div class="alert alert-success"><strong align="center">Connected</strong></div>';
    }
    else {
        connectedStuff += '<div class="alert alert-danger"><strong align="center">Disconnected</strong></div>';
    }
    connectedStuff += '</p></div></div>';


    connectedStuff += '</div>';

    //LAST ROW
    connectedStuff += '</div><div class="row mt-4">';

    connectedStuff += '<div class="card col" style="width:300px"><img class="card-img-top mt-3" src="../images/devices/Olympus-IX83.jpg" alt="Card image">';
    connectedStuff += '<div class="card-body"><h4 class="card-title">Olympus-IX83</h4><p class="card-text">';
    if (finalData.Olympus_IX83 == "connected") {
        connectedStuff += '<div class="alert alert-success"><strong align="center">Connected</strong></div>';
    }
    else {
        connectedStuff += '<div class="alert alert-danger"><strong align="center">Disconnected</strong></div>';
    }
    connectedStuff += '</p></div></div>';
    


    connectedStuff += '<div class="card col" style="width:300px"><img class="card-img-top mt-3" src="../images/devices/Olympus-IX71.jpg" alt="Card image">';
    connectedStuff += '<div class="card-body"><h4 class="card-title">Olympus-IX71</h4><p class="card-text">';
    if (finalData.Olympus_IX71 == "connected") {
        connectedStuff += '<div class="alert alert-success"><strong align="center">Connected</strong></div>';
    }
    else {
        connectedStuff += '<div class="alert alert-danger"><strong align="center">Disconnected</strong></div>';
    }
    connectedStuff += '</p></div></div>';


    connectedStuff += '</div>';

    return connectedStuff;
}

async function listManuel(stuff) // PANNEAU DE CONTROLE MANUEL
{

    /* CAMERA EVOLV512 + DIRECTIONS */
    //class ==> fixed-top
    var toResponse = '<div class="sticky-top row mt-4 bg-light">';

    toResponse += '<div class="col-md-auto d-flex align-items-center">';
// get real size of cams pic and set same size on wPaint, then use w-25 to resize le tout
    toResponse += '<div class="ml-4 mr-4 border border-danger" id="wPaint" style="background-image: url(' + globals.nodeRedIpCamera + ');width: 375px !important; height: 375px !important;position:relative;background-size: auto 100% !important;"></div>';
    //toResponse += '<img id="cam" class="img-fluid w-25 mr-4" src="' + globals.nodeRedIpCamera + '" style="position:relative; ">';
    
    
   
    toResponse += '<div><div class="form-group"><br><table style="text-align: left; " border="0" cellpadding="2" cellspacing="5"><tbody><tr><td></td><td></td><td style="width:50px;"></td><td></td><td></td><td></td><td></td><td></td><td style="width:50px;"> </td><td></td></tr>                <tr><td style="width:200px;"></td><td></td><td></td><td></td><td></td><td style="text-align: center;"><button id="xPosUP2" onclick="updatePriorMotionStage(\'' + "0" + "\',\'" + "-5000" + '\')"><img src="../icons/007-ascending.png"></button></td><td></td><td></td><td></td><td style="text-align: center;"><button id="zPosUP2" onclick="updateZAxis(\'' + "N" + "\',\'" + "10" + '\')"><img src="../icons/007-ascending.png"></button></td></tr>                <tr><td style="width:200px;"></td><td></td><td></td><td></td><td></td><td style="text-align: center;"><button  id="xPosUP1" onclick="updatePriorMotionStage(\'' + "0" + "\',\'" + "-1000" + '\')"><img src="../icons/008-arrow-2.png"></button></td><td></td><td></td><td></td><td style="text-align: center;"><button id="zPosUP1" onclick="updateZAxis(\'' + "N" + "\',\'" + "1" + '\')"><img src="../icons/008-arrow-2.png"></button></td></tr>';
    toResponse += '<tr><td style="width:200px;"></td><td></td><td></td><td><button id="yPosLF2" onclick="updatePriorMotionStage(\'' + "-5000" + "\',\'" + "0" + '\')"><img src="../icons/002-back.png"></button></td><td><button id="yPosLF1" onclick="updatePriorMotionStage(\'' + "-1000" + "\',\'" + "0" + '\')"><img src="../icons/001-arrow.png"></button></td><td style="text-align: center;"><strong>X-Y</strong></td><td><button id="yPosRG1" onclick="updatePriorMotionStage(\'' + "1000" + "\',\'" + "0" + '\')"><img src="../icons/004-arrow-1.png"></button ></td><td><button id="yPosRG2" onclick="updatePriorMotionStage(\'' + "5000" + "\',\'" + "0" + '\')"><img src="../icons/003-right.png"></button></td><td></td><td style="text-align: center;"><strong>Z</strong></td></tr>';
    toResponse += '<tr><td style="width:200px;">Resolution1 [um]&nbsp;&nbsp;&nbsp;<img src="../icons/008-arrow-2.png"><img src="../icons/001-arrow.png"><img src="../icons/005-down.png"><img src="../icons/004-arrow-1.png"></td><td><input style="width:136px;" class="res1"   required type="number" min="0"  max="100000" step="1" ></td><td></td><td></td><td></td><td style="text-align: center;"><button id="xPosDW1" onclick="updatePriorMotionStage(\'' + "0" + "\',\'" + "1000" + '\')"><img src="../icons/005-down.png"></button></td><td></td><td></td><td></td><td style="text-align: center;"><button onclick="updateZAxis(\'' + "F" + "\',\'" + "1" + '\')" id="zPosDW1"><img src="../icons/005-down.png"></button></td></tr>';
    toResponse += '<tr><td style="width:200px;">Resolution2 [um]&nbsp;&nbsp;&nbsp;<img src="../icons/007-ascending.png"><img src="../icons/002-back.png"><img src="../icons/006-down-1.png"><img src="../icons/003-right.png"></td><td><input style="width:136px;" class="res2" required type="number" min="0"  max="100000" step="1"></td><td></td><td></td><td></td><td style="text-align: center;"><button  id="xPosDW2" onclick="updatePriorMotionStage(\'' + "0" + "\',\'" + "5000" + '\')"><img src="../icons/006-down-1.png"></button></td><td></td><td></td><td></td><td style="text-align: center;"><button onclick="updateZAxis(\'' + "F" + "\',\'" + "10" + '\')" id="zPosDW2"><img src="../icons/006-down-1.png"></button></td></tr>';
    toResponse += '<tr><td></td><td></td><td></td><td></td><td></td><td"></td><td></td><td></td><td></td><td></td></tr></tbody></table></div>';

    toResponse += '</div>';
    toResponse += '</div>';
    //toResponse += '</div>'; //CP SUR FIN JOYSTICK

    /* END OF CAMERA */
    /*toResponse += '<div class="col-md-auto d-flex align-items-center">';
    toResponse += '<div class="joystick" id="joystick"></div>';
    toResponse += '</div>';*/


    toResponse += '</div>';

    // CLASS < p-2 border > si jamais faut recentrer les panels devices
    toResponse += '<div id="accordion" class="mt-4">';
    try {
        var resp = request('POST', globals.nodeRedIP + '/list-device-connected', {
            timeout: 5000,
            headers: { 'Authorization': globals.nodeRedToken },
            json: { microscope: stuff.equipement_name },
        });
    }
    catch (error) {
        console.log(error);
        return ('<div class="alert alert-danger alert-dismissible fade show mt-4" role="alert"><strong>An error occured</strong> ' + error + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><img src="https://i.giphy.com/media/PqcIFm93VxA8o/giphy.webp">');
    }
    var connectedDevices = JSON.parse(resp.getBody('utf8'));
    
    let DevicesHtml = {};

    if (connectedDevices.CoolLed_pE4000_fluorescence == "connected") {
        DevicesHtml = await Devices_html.findOne( { name: "CoolLed_pE4000_fluorescence" } );
        //console.log(DevicesHtml);
        toResponse += '<div class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#coolLedPe4000Fluo" onclick="getAllChannelsValuesfluo(\'' + "lol" + '\', \'' + "CoolLed_pE4000_fluorescence" + '\')">CoolLed-pE4000 - Fluo</a></div><div id="coolLedPe4000Fluo" class="collapse" data-parent="#accordion"><div class="card-body">';
        toResponse += DevicesHtml.html;
        toResponse += '</div></div></div>';
    }

    if (connectedDevices.CoolLed_pE4000_mosaic == "connected") {
        DevicesHtml = await Devices_html.findOne( { name: "CoolLed_pE4000_mosaic" } );
        //console.log(DevicesHtml);
        toResponse += '<div class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#coolLedPe4000Mosaic" onclick="getAllChannelsValuesmosaic(\'' + "lol" + '\', \'' + "CoolLed_pE4000_mosaic" + '\')">CoolLed-pE4000 - Mosaïc</a></div><div id="coolLedPe4000Mosaic" class="collapse" data-parent="#accordion"><div class="card-body">';
        toResponse += DevicesHtml.html;
        toResponse += '</div></div></div>';
    }

    if (connectedDevices.CoolLed_pE300_fluorescence == "connected") {
        DevicesHtml = await Devices_html.findOne( { name: "CoolLed_pE300_fluorescence" } );
        //console.log(DevicesHtml);
        toResponse += '<div class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#coolLedPe300Fluo">CoolLed-pE300 - Fluo</a></div><div id="coolLedPe300Fluo" class="collapse" data-parent="#accordion"><div class="card-body">';
        toResponse += DevicesHtml.html;
        toResponse += '</div></div></div>';
    }

    if (connectedDevices.CoolLed_pE300_mosaic == "connected") {
        DevicesHtml = await Devices_html.findOne( { name: "CoolLed_pE300_mosaic" } );
        //console.log(DevicesHtml);
        toResponse += '<div class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#coolLedPe300Mosaic">CoolLed-pE300 - Mosaïc</a></div><div id="coolLedPe300Mosaic" class="collapse" data-parent="#accordion"><div class="card-body">';
        toResponse += DevicesHtml.html;
        toResponse += '</div></div></div>';
    }

    if (connectedDevices.CoolLed_pE100_fluorescence == "connected") {
        DevicesHtml = await Devices_html.findOne( { name: "CoolLed_pE100_fluorescence" } );
        //console.log(DevicesHtml);
        toResponse += '<div class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#coolLedPe100Fluo">CoolLed-pE100 - Fluo</a></div><div id="coolLedPe100Fluo" class="collapse" data-parent="#accordion"><div class="card-body">';
        toResponse += DevicesHtml.html;
        toResponse += '</div></div></div>';
    }

    if (connectedDevices.CoolLed_pE100_mosaic == "connected") {
        DevicesHtml = await Devices_html.findOne( { name: "CoolLed_pE100_mosaic" } );
        //console.log(DevicesHtml);
        toResponse += '<div class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#coolLedPe100Mosaic">CoolLed-pE100 - Mosaïc</a></div><div id="coolLedPe100Mosaic" class="collapse" data-parent="#accordion"><div class="card-body">';
        toResponse += DevicesHtml.html;
        toResponse += '</div></div></div>';
    }

    if (connectedDevices.X_Cite_120PC_fluorescence == "connected") {
        DevicesHtml = await Devices_html.findOne( { name: "X_Cite_120PC_fluorescence" } );
        //console.log(DevicesHtml);
        toResponse += '<div class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#xCite120PCFluo" onclick="getAllChannelsValuesFluoXCite(\'' + "lol" + '\', \'' + "X_Cite_120PC_fluorescence" + '\')">X-Cite-120PC - Fluo</a></div><div id="xCite120PCFluo" class="collapse" data-parent="#accordion"><div class="card-body">';
        toResponse += DevicesHtml.html;
        toResponse += '</div></div></div>';
    }

    if (connectedDevices.X_Cite_120PC_mosaic == "connected") {
        DevicesHtml = await Devices_html.findOne( { name: "X_Cite_120PC_mosaic" } );
        //console.log(DevicesHtml);
        toResponse += '<div class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#xCite120PCMosaic" onclick="getAllChannelsValuesMosaicXCite(\'' + "lol" + '\', \'' + "X_Cite_120PC_mosaic" + '\')">X-Cite-120PC - Mosaïc</a></div><div id="xCite120PCMosaic" class="collapse" data-parent="#accordion"><div class="card-body">';
        toResponse += DevicesHtml.html;
        toResponse += '</div></div></div>';
    }

    // $$%%%$$

    if (connectedDevices.Olympus_IX81 == "connected") {
        DevicesHtml = await Devices_html.findOne( { name: "Olympus_IX81" } );
        //console.log(DevicesHtml);
        toResponse += '<div class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#olympusIX81">Olympus-IX81</a></div><div id="olympusIX81" class="collapse" data-parent="#accordion"><div class="card-body">';
        toResponse += DevicesHtml.html;
        toResponse += '</div></div></div>';
    }

    if (connectedDevices.Olympus_IX83 == "connected") {
        DevicesHtml = await Devices_html.findOne( { name: "Olympus_IX83" } );
        //console.log(DevicesHtml);
        toResponse += '<div class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#olympusIX83">Olympus-IX83</a></div><div id="olympusIX83" class="collapse" data-parent="#accordion"><div class="card-body">';
        toResponse += DevicesHtml.html;
        toResponse += '</div></div></div>';
    }

    if (connectedDevices.Olympus_IX71 == "connected") {
        DevicesHtml = await Devices_html.findOne( { name: "Olympus_IX71" } );
        //console.log(DevicesHtml);
        toResponse += '<div class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#olympusIX71">Olympus-IX71</a></div><div id="olympusIX71" class="collapse" data-parent="#accordion"><div class="card-body">';
        toResponse += DevicesHtml.html;
        toResponse += '</div></div></div>';
    }

    if (connectedDevices.Evolv512 == "connected") {
        DevicesHtml = await Devices_html.findOne( { name: "Evolv512" } );
        //console.log(DevicesHtml);
        toResponse += '<div class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#evolv512">Evolv512</a></div><div id="evolv512" class="collapse" data-parent="#accordion"><div class="card-body">';
        toResponse += DevicesHtml.html;
        toResponse += '</div></div></div>';
    }

    if (connectedDevices.PriorScientific_V31XYZE == "connected") {
        DevicesHtml = await Devices_html.findOne( { name: "PriorScientific_V31XYZE" } );
        //console.log(DevicesHtml);
        toResponse += '<div class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#priorMotionStage">PriorScientific_V31XYZE</a></div><div id="priorMotionStage" class="collapse" data-parent="#accordion"><div class="card-body">';
        toResponse += DevicesHtml.html;
        toResponse += '</div></div></div>';
    }

    if (connectedDevices.Andor_Mosaic_3 == "connected") {
        DevicesHtml = await Devices_html.findOne( { name: "Andor_Mosaic_3" } );
        //console.log(DevicesHtml);
        toResponse += '<div class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#andorMosaic3">Andor-Mosaïc-3</a></div><div id="andorMosaic3" class="collapse" data-parent="#accordion"><div class="card-body">';
        toResponse += DevicesHtml.html;
        toResponse += '</div></div></div>';
    }

    if (connectedDevices.Andor_Zyla == "connected") {
        DevicesHtml = await Devices_html.findOne( { name: "Andor_Zyla" } );
        //console.log(DevicesHtml);
        toResponse += '<div class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#andorZyla">Andor-Zyla</a></div><div id="andorZyla" class="collapse" data-parent="#accordion"><div class="card-body">';
        toResponse += DevicesHtml.html;
        toResponse += '</div></div></div>';
    }

    if (connectedDevices.Fluigent_micro_fluidic_10_valves == "connected") {
        DevicesHtml = await Devices_html.findOne( { name: "Fluigent_micro_fluidic_10_valves" } );
        //console.log(DevicesHtml);
        toResponse += '<div class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#Fluigent-micro-fluidic-10-valves">Fluigent-micro-fluidic-10-valves</a></div><div id="Fluigent-micro-fluidic-10-valves" class="collapse" data-parent="#accordion"><div class="card-body">';
        toResponse += DevicesHtml.html;
        toResponse += '</div></div></div>';
    }

    if (connectedDevices.Lab513_micro_fluidic_5_valves == "connected") {
        DevicesHtml = await Devices_html.findOne( { name: "Lab513_micro_fluidic_5_valves" } );
        //console.log(DevicesHtml);
        toResponse += '<div class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#Lab513-micro-fluidic-5-valves">Lab513-micro-fluidic-5-valves</a></div><div id="Lab513-micro-fluidic-5-valves" class="collapse" data-parent="#accordion"><div class="card-body">';
        toResponse += DevicesHtml.html;
        toResponse += '</div></div></div>';
    }

    toResponse += '</div>';
    if (toResponse.indexOf("card-header") == -1) {
        //toResponse = '<div class="mt-4 alert alert-danger alert-dismissible fade show" role="alert"><strong>An error occured</strong>  0 device connected to ' + stuff.equipement_name + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    }
    return toResponse;
}
function listAuto(stuff)
{
    var res = '<div class="row mt-4"><p>You are in auto</p></div>';
    return res;
}
function listAlarms(stuff)
{
    var res = '<div class="row mt-4"><p>You are in alarms</p></div>';
    return res;
}

function listOption(stuff)
{
    var res = '<div class="btn-group" role="group" aria-label="Stuff options"><button type="button" class="btn btn-secondary" onclick="showMain()">' + stuff.equipement_name + '</button>';
    res += '<button type="button" class="btn btn-secondary" onclick="showSettingsChannels()">Settings channels</button>';
    res += '<button type="button" class="btn btn-secondary" onclick="showMosaicMask()">Mosaic Masks</button>';
    res += '<button type="button" class="btn btn-secondary" onclick="showManuel()">Manuel</button>';
    res += '<button type="button" class="btn btn-secondary" onclick="showAuto()">Auto</button>';
    res += '<button type="button" class="btn btn-secondary" onclick="showAlarms()">Alarms</button>';
    res += '<button type="button" class="btn btn-danger" onclick="releaseMyEquipement(\'' + stuff.equipement_name + '\')">Finish and disconnect</button></div>';
    return res;
}

router.post('/get-main', async (req, res) => {
    if (!req.body.access_token) {
        return res.status(400).send('{ "error": "You need to provide an access_token" }');
    }
    let userToken = await Token.findOne({ token: req.body.access_token });
     if (!userToken) {
         return res.status(400).send('{ "error": "Incorrect access_token." }');
     }
     let userInfo = await User.findOne({ email: userToken.email });
     if (!userInfo) {
        return res.status(400).send('{ "error": "Cannot find a user with this token." }');
    }
    let checkStuff = await Equipement.findOne({ current_user: userInfo.email });
     if (!checkStuff) {
        return res.status(200).send("An error occured");    
     }
    var otherResponse = listOption(checkStuff);
    otherResponse += listConnectedEquipement(checkStuff.equipement_name);
    return res.status(200).send(otherResponse);
});

router.post('/get-manuel', async (req, res) => {
    if (!req.body.access_token) {
        return res.status(400).send('{ "error": "You need to provide an access_token" }');
    }
    let userToken = await Token.findOne({ token: req.body.access_token });
     if (!userToken) {
         return res.status(400).send('{ "error": "Incorrect access_token." }');
     }
     let userInfo = await User.findOne({ email: userToken.email });
     if (!userInfo) {
        return res.status(400).send('{ "error": "Cannot find a user with this token." }');
    }
    let checkStuff = await Equipement.findOne({ current_user: userInfo.email });
     if (!checkStuff) {
        return res.status(200).send("An error occured");    
     }
    var otherResponse = listOption(checkStuff);
    otherResponse += await listManuel(checkStuff);
    return res.status(200).send(otherResponse);
});

router.post('/get-auto', async (req, res) => {
    if (!req.body.access_token) {
        return res.status(400).send('{ "error": "You need to provide an access_token" }');
    }
    let userToken = await Token.findOne({ token: req.body.access_token });
     if (!userToken) {
         return res.status(400).send('{ "error": "Incorrect access_token." }');
     }
     let userInfo = await User.findOne({ email: userToken.email });
     if (!userInfo) {
        return res.status(400).send('{ "error": "Cannot find a user with this token." }');
    }
    let checkStuff = await Equipement.findOne({ current_user: userInfo.email });
     if (!checkStuff) {
        return res.status(200).send("An error occured");    
     }
    var otherResponse = listOption(checkStuff);
    otherResponse += listAuto(checkStuff);
    return res.status(200).send(otherResponse);
});

router.post('/get-alarms', async (req, res) => {
    if (!req.body.access_token) {
        return res.status(400).send('{ "error": "You need to provide an access_token" }');
    }
    let userToken = await Token.findOne({ token: req.body.access_token });
     if (!userToken) {
         return res.status(400).send('{ "error": "Incorrect access_token." }');
     }
     let userInfo = await User.findOne({ email: userToken.email });
     if (!userInfo) {
        return res.status(400).send('{ "error": "Cannot find a user with this token." }');
    }
    let checkStuff = await Equipement.findOne({ current_user: userInfo.email });
     if (!checkStuff) {
        return res.status(200).send("An error occured");    
     }
    var otherResponse = listOption(checkStuff);
    otherResponse += listAlarms(checkStuff);
    return res.status(200).send(otherResponse);
});

router.post('/book', async (req, res) => {
    if (!req.body.access_token) {
        return res.status(400).send('{ "error": "You need to provide an access_token" }');
    }
    let userToken = await Token.findOne({ token: req.body.access_token });
     if (!userToken) {
         return res.status(400).send('{ "error": "Incorrect access_token." }');
     }
     let userInfo = await User.findOne({ email: userToken.email });
     if (!userInfo) {
        return res.status(400).send('{ "error": "Cannot find a user with this token." }');
    }
    let checkStuff = await Equipement.findOne({ email: userInfo.email });
     if (!checkStuff) {
        let updateStuff = await Equipement.findOne({ equipement_name: req.body.equipement_name });
        if (!updateStuff) {
            return res.status(400).send("Bad equipement name");
        }
        else if (updateStuff.is_available == "false") {
            return res.status(400).send('{ "error": "Already in use, refresh your page." }');
        }
        var current_time = new Date().toString();
        var posi = current_time.indexOf(" GMT");
        current_time = current_time.slice(0, posi);
        Equipement.updateOne({
            "equipement_name": req.body.equipement_name
            }, {
                $set: {
                    "current_user": userInfo.email,
                    "begin_time": current_time,
                    "is_available": "false"
                }
            }, function(err, results){
                console.log(results);
                 
            });
            let checkStuff = await Equipement.findOne({ current_user: userInfo.email });
            //console.log(checkStuff);
            var otherResp = listOption(checkStuff);
            otherResp += listConnectedEquipement(checkStuff.equipement_name);
            if (globals.enableSlackNotifications) {
                send_notifications.sendMessageToSlack(userInfo.name + " book " + req.body.equipement_name + ".");
            }
            return res.status(200).send(otherResp);
     }
    return res.status(400).send("Nice try hackerman");
});

router.post('/release', async (req, res) => {
    if (!req.body.access_token) {
        return res.status(400).send('{ "error": "You need to provide an access_token" }');
    }
    let userToken = await Token.findOne({ token: req.body.access_token });
     if (!userToken) {
         return res.status(400).send('{ "error": "Incorrect access_token." }');
     }
     let userInfo = await User.findOne({ email: userToken.email });
     if (!userInfo) {
        return res.status(400).send('{ "error": "Cannot find a user with this token." }');
    }
    let checkStuff = await Equipement.findOne({ equipement_name: req.body.equipement_name });
     if (checkStuff) {
        Equipement.updateOne({
            "equipement_name": req.body.equipement_name
            }, {
                $set: {
                    "current_user": " - ",
                    "begin_time": " - ",
                    "is_available": "true"
                }
            }, function(err, results){
                console.log(results);
                 
            });
            let equipementInfo = await Equipement.find();
            var finalResponse = listMicroscope(equipementInfo);
            if (globals.enableSlackNotifications) {
                send_notifications.sendMessageToSlack(userInfo.name + " release " + req.body.equipement_name + ".");
            }
            return res.status(200).send(finalResponse);    
     }
    return res.status(400).send('{ "error": "Microscope already free." }');
});

router.post('/infos', async (req, res) => {
    if (!req.body.access_token) {
        return res.status(400).send('{ "error": "You need to provide an access_token" }');
    }
    let userToken = await Token.findOne({ token: req.body.access_token });
     if (!userToken) {
         return res.status(400).send('{ "error": "Incorrect access_token." }');
     }
     let userInfo = await User.findOne({ email: userToken.email });
     if (!userInfo) {
        return res.status(400).send('{ "error": "Cannot find a user with this token." }');
    }
    let checkStuff = await Equipement.findOne({ current_user: userInfo.email });
     if (!checkStuff) {
        let equipementInfo = await Equipement.find();
        var finalResponse = listMicroscope(equipementInfo);
        return res.status(200).send(finalResponse);    
     }
    var otherResponse = listOption(checkStuff);
    otherResponse += listConnectedEquipement(checkStuff.equipement_name);
    return res.status(200).send(otherResponse);
});

router.post('/update', async (req, res) => {
    if (!req.body.access_token) {
        return res.status(400).send('{ "error": "You need to provide an access_token" }');
    }
    let userToken = await Token.findOne({ token: req.body.access_token });
     if (!userToken) {
         return res.status(400).send('{ "error": "Incorrect access_token." }');
     }
     let userInfo = await User.findOne({ email: userToken.email });
     if (!userInfo) {
        return res.status(400).send('{ "error": "Cannot find a user with this token." }');
    }
    let checkStuff = await Equipement.findOne({ current_user: userInfo.email });
     if (!checkStuff) {
        let equipementInfo = await Equipement.find();
        var finalResponse = listMicroscope(equipementInfo);
        return res.status(200).send(finalResponse);    
     }
    var otherResponse = listOption(checkStuff);
    otherResponse += listConnectedEquipement(checkStuff.equipement_name);
    return res.status(200).send(otherResponse);
});

router.post('/azerty', async (req, res) => { // RETURN THE NAME OF THE MICROSCOPE THE USER IS USING
    if (!req.body.access_token) {
        return res.status(400).send('{ "error": "You need to provide an access_token" }');
    }
    let userToken = await Token.findOne({ token: req.body.access_token });
     if (!userToken) {
         return res.status(400).send('{ "error": "Incorrect access_token." }');
     }
     let userInfo = await User.findOne({ email: userToken.email });
     if (!userInfo) {
        return res.status(400).send('{ "error": "Cannot find a user with this token." }');
    }
    let checkStuff = await Equipement.findOne({ current_user: userInfo.email });
     if (!checkStuff) {
        return res.status(400).send('{ "error": "You are not currently using a microscope." }');
     }
    return res.status(200).send('{ "microscope": "' + checkStuff.equipement_name + '" }');
});

module.exports = router;