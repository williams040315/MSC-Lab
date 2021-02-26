/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\routes\send-notifications.js
 * Created Date: Wednesday, April 10th 2019, 1:50:00 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: MDA panel
 * 
 * OpenSource
 */

const express = require('express');
const router = express.Router();
const request = require('sync-request');
const { Token, validateToken } = require('../models/token');
const { User } = require('../models/user');
const { Equipement } = require('../models/equipement');
const { Settings_channel } = require('../models/settings_channel');
const { Protocol } = require('../models/protocol');
const { Mosaic_mask } = require('../models/mosaic_mask');

const send_notifications = require('./send-notifications');
const globals = require('../globals');

async function buildResponseMidCol(userSettingsChannels, userMosaicMask) {
    // SETTINGS CHANNELS
    var k = 1;
    var response = '<select class="form-control form-control-lg" id="setting-channel-to-apply" onchange="applySettingChannel()">';
    response += '<option value="'+k+'">';
    response += "Select a setting channel...";
    response += '</option>';
    k++;
    for (var i = 0; i < userSettingsChannels.length; i++) {
        response += '<option value="'+k+'">';
        response += userSettingsChannels[i].channel_name;
        response += '</option>';
        k++;
    }
    response += '</select>';

    // MOSAIC MASKS
    k = 1;
    response += '<select class="form-control form-control-lg mt-2" id="mosaic-mask-to-apply" onchange="applyMosaicMask()">';
    response += '<option value="'+k+'">';
    response += "Select a mosaic mask...";
    response += '</option>';
    k++;
    for (var i = 0; i < userMosaicMask.length; i++) {
        response += '<option value="'+k+'">';
        response += userMosaicMask[i].mask_name;
        response += '</option>';
        k++;
    }
    response += '</select>';

    response += '<div class="form-group mt-2"><label for="exposure-time">Exposure Time (ms)</label>';
    response += '<input type="number" class="form-control" id="exposure-time" placeholder="Exposure Time" onchange="updateExposureTime()"></div>';
    
    response += '<button type="button" class="btn btn-primary mr-4 mt-2 mb-4 " id="button-apply-sc" onclick="reloadSettingChannel()">Reload settings channels</button>';
    response += '<button type="button" class="btn btn-primary mr-4 mt-2 mb-4 " id="button-apply-mm" onclick="reloadMosaicMask()">Reload mosaïc masks</button>';
    response += '<button type="button" class="btn btn-success float-right mb-4 mt-2" id="button-switch-light" onclick="opencloseLight()">Light ON</button>';
    response += '<button type="button" id="btn-run-protocol" class="btn btn-success btn-lg btn-block mr-4 mb-4 disabled" onclick="runProtocol()">Select a protocol</button>';

    //response += '<button type="button" class="btn btn-success btn-lg btn-block  mr-4 mt-4 mb-4" id="button-switch" onclick="switchLive()">Live ON</button>';

    //AUTOFOCUS STUFF
    response += '<div class="border border-dark" id="focus-content" style="padding-left: 5px;padding-right: 5px;">';
    response += '<button type="button" class="btn btn-primary mr-3 mt-2 mb-4" onclick="requestAutoFocus(0)">Init AutoFocus</button>';
    response += 'Z-Offset <span class="badge badge-pill badge-primary" id="z-offset-value">undefined</span> <span id="focus-status" class="badge badge-pill badge-success">Status</span>';
    response += '<button type="button" class="btn btn-success btn-lg btn-block  mr-4 mb-2" onclick="requestAutoFocus(1)">Refocus</button>';
    response += '</div>';
    


    //CAMERA STUFF
    response += '<button type="button" class="btn btn-success btn-lg btn-block mt-4 mr-4 mb-4" onclick="takeAPicture()" data-toggle="modal" data-target="#modalPicture">Take a picture</button>';
    /*
       
  
    
     
        
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          
        </button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
    */
   response += '<div class="modal fade" data-keyboard="false" data-backdrop="static" id="modalPicture" tabindex="-1" role="dialog" aria-labelledby="modalPictureTitle" aria-hidden="true">';
   response += '<div class="modal-dialog modal-dialog-centered" role="document"><div class="modal-content"> <div class="modal-header">';
   response += '<h5 class="modal-title" id="pictureModalLongTitle">Taking a picture...</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="abortPicture()">';
    response += '<span aria-hidden="true">&times;</span></button></div><div class="modal-body">';
    response += '<div class="spinner-border text-primary mr-2" role="status"><span class="sr-only">Loading...</span></div>';
    response += '<div class="spinner-border text-secondary mr-2" role="status"><span class="sr-only">Loading...</span></div>';
    response += '<div class="spinner-border text-success mr-2" role="status"><span class="sr-only">Loading...</span></div>';
    response += '<div class="spinner-border text-danger mr-2" role="status"><span class="sr-only">Loading...</span></div>';
    response += '<div class="spinner-border text-warning mr-2" role="status"><span class="sr-only">Loading...</span></div>';
    response += '<div class="spinner-border text-info mr-2" role="status"><span class="sr-only">Loading...</span></div>';
    response += '<div class="spinner-border text-light mr-2" role="status"><span class="sr-only">Loading...</span></div>';
    response += '<div class="spinner-border text-dark mr-2" role="status"><span class="sr-only">Loading...</span></div>';
    response += '</div>';
    response += ' <div class="modal-footer"><button type="button" class="btn btn-danger" data-dismiss="modal" onclick="abortPicture()">Abort</button>';
    response += '</div></div></div></div>';
    return response;
}

router.post('/show-mid-col', async (req, res) => {
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
     let userSettingsChannels = await Settings_channel.find( { channel_author: userInfo.email } );
     console.log("\nsetting channel\n",userSettingsChannels);     
     let userMosaicMask = await Mosaic_mask.find( { author: userInfo.email } );
    var response = await buildResponseMidCol(userSettingsChannels, userMosaicMask);
    return res.status(200).send(response);
});

async function buildResponseLeftCol(userProtocol) {
    var response = '<select class="form-control form-control-lg" id="protocol-to-run" onchange="updateAffichageCurrentProtocol()">';
     response += '<option value="0">';
     response += "New protocol";
     response += '</option>';
     var k = 1;
    for (var i = 0; i < userProtocol.length; i++) {
        response += '<option value="'+k+'">';
        response += userProtocol[i].protocol_name;
        response += '</option>';
        k++;
    }
    response += '</select>';

     
     response += '<div class="row mt-2" id="create-protocol-formulaire"><div class="form-group col" id="create-protocol-form">';
     response += '<input type="text" class="form-control" id="protocol-name" placeholder="Protocol Name"></div>';
     response += '<div class="col "><button type="button" id="create-protocol-btn" class="btn btn-success" onclick="createProtocol(1)">Create</button></div></div>';

     response += '<div class="row mt-2" id="update-protocol-formulaire">';
     response += '<div class="col "><button type="button" id="update-protocol-btn" class="btn btn-primary" onclick="updateProtocol()">Update</button></div>';

     response += '<div class="col "><button type="button" id="duplicate-protocol-btn" class="btn btn-info" data-toggle="modal" data-target="#duplicateProtocolModal">Duplicate</button></div>';
     //MODAL DUPLICATE PROTOCOL
     response += '<div class="modal fade" id="duplicateProtocolModal" tabindex="-1" role="dialog" aria-labelledby="duplicateProtocolModalCenterTitle" aria-hidden="true">';
     response += '<div class="modal-dialog modal-dialog-centered" role="document"><div class="modal-content"><div class="modal-header">';
     response += '<h5 class="modal-title" id="duplicateProtocolModalLongTitle">Duplicate Protocol</h5>';
     response += ' <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
     response += '<div class="modal-body">';
     response += '<div class="form-group"><label for="duplicate-protocol-name" class="col-form-label">New protocol name</label>';
     response += '<input type="text" class="form-control" id="duplicate-protocol-name"></div>';
     response += '</div><div class="modal-footer"><button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>';
     response += '<button type="button" class="btn btn-success"  onclick="duplicateProtocol()" data-dismiss="modal">Duplicate Protocol</button>';
     response += '</div></div></div></div>';

     response += '<div class="col "><button type="button" id="delete-protocol-btn" class="btn btn-danger" data-toggle="modal" data-target="#deleteProtocolModal">Delete</button>';
     //MODAL DELETE PROTOCOL

     response += '<div class="modal fade" id="deleteProtocolModal" tabindex="-1" role="dialog" aria-labelledby="deleteProtocolModalCenterTitle" aria-hidden="true">';
     response += '<div class="modal-dialog modal-dialog-centered" role="document"><div class="modal-content"><div class="modal-header">';
     response += '<h5 class="modal-title" id="deleteProtocolModalLongTitle">Delete Protocol</h5>';
     response += ' <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
     response += '<div class="modal-body">Are you sure to delete the current protocol ?';
     response += '</div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>';
     response += '<button type="button" class="btn btn-danger"  data-dismiss="modal" onclick="deleteProtocol()">Delete Protocol</button>';
     response += '</div></div></div></div>';

     response += '</div></div>';
     return (response);
}
//onclick="deleteProtocol()"
async function buildScLIST(userSettingsChannels) {
    var k = 1;
    var response = '<select class="form-control form-control-lg" id="setting-channel-to-apply" onchange="applySettingChannel()">';
    response += '<option value="'+k+'">';
    response += "Select a setting channel...";
    response += '</option>';
    k++;
    for (var i = 0; i < userSettingsChannels.length; i++) {
        response += '<option value="'+k+'">';
        response += userSettingsChannels[i].channel_name;
        response += '</option>';
        k++;
    }
    response += '</select>';
    return response;
}

router.post('/reload-settings-channels-list', async (req, res) => {
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
     let userSettingsChannels = await Settings_channel.find( { channel_author: userInfo.email } );
     console.log("\nsetting channel\n",userSettingsChannels);
    var response = await buildScLIST(userSettingsChannels);
    return res.status(200).send(response);
});

async function buildMmLIST(userMosaicMasks) {
    var k = 1;
    var response = '<select class="form-control form-control-lg" id="mosaic-mask-to-apply" onchange="applyMosaicMask()">';
    response += '<option value="'+k+'">';
    response += "Select a mosaic mask...";
    response += '</option>';
    k++;
    for (var i = 0; i < userMosaicMasks.length; i++) {
        response += '<option value="'+k+'">';
        response += userMosaicMasks[i].mask_name;
        response += '</option>';
        k++;
    }
    response += '</select>';
    return response;
}

router.post('/reload-mosaic-masks-list', async (req, res) => {
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
     let userMosaicMask = await Mosaic_mask.find( { author: userInfo.email } );
    var response = await buildMmLIST(userMosaicMask);
    return res.status(200).send(response);
});

router.post('/show-left-col', async (req, res) => {
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
     let userProtocol = await Protocol.find( { email: userInfo.email } );
     var response = await buildResponseLeftCol(userProtocol);
    return res.status(200).send(response);
});

router.post('/run-protocol', async (req, res) => {
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
     let userProtocol = await Protocol.findOne( { email: userInfo.email, protocol_name: req.body.protocol_name } );
     if (!userProtocol) {
        return res.status(400).send('{"error":"Protocol ' + req.body.protocol_name + ' not found!"}');
     }
     var mname = await globals.getMicroscopeNameFromUserEmail(userToken.email);
     let userSC = await Settings_channel.find();
     console.log("\nsetting channel\n",userSC);

     let userMM = await Mosaic_mask.find();
     try {
        var resp = request('POST', globals.nodeRedIP + globals.nodeRedRunProtocol, {
            timeout: 5000,
            headers: { 'Authorization': globals.nodeRedToken },
            json: { microscope: mname.microscope, protocol_name: req.body.protocol_name, protocol_data: userProtocol.protocol_data, user_sc: userSC, user_mm: userMM},
        });
        }
        catch (error) {
            console.log(error);
            return res.status(400).send(' { "error": "' + error + '" } ');
        }
    return res.status(200).send('{"status":"ok"}');
}); 

module.exports = router;