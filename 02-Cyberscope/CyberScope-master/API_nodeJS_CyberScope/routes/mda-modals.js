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

async function buildResponseZSPSCM(userSettingsChannels) {
    var k = 1;
    var response = '<select class="form-control mb-3" id="setting-channel-zs-sc-modal">';
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

    response += '<div class="form-group"><label for="near-limit-zs-sc-modal">Near Limit (um)</label>';
    response += '<input type="text" class="form-control" id="near-limit-zs-sc-modal" placeholder="Near Limit"></div>';

    response += '<div class="form-group"><label for="far-limit-zs-sc-modal">Far Limit (um)</label>';
    response += '<input type="text" class="form-control" id="far-limit-zs-sc-modal" placeholder="Far Limit"></div>';

    response += '<div class="form-group"><label for="step-zs-sc-modal">Step Limit (um)</label>';
    response += '<input type="text" class="form-control" id="step-zs-sc-modal" placeholder="Step Limit"></div>';

    response += '<div class="form-group"><label for="exposure-time-zs-sc-modal">Exposure Time (ms)</label>';
    response += '<input type="text" class="form-control" id="exposure-time-zs-sc-modal" placeholder="Exposure Time"></div>';

    response += '<div class="form-check"><input class="form-check-input" type="checkbox" value="" id="keep-shutter-on-zs-sc-modal">';
    response += '<label class="form-check-label" for="keep-shutter-on-zs-sc-modal">Keep shutter ON while Z-Stacking ?</label></div>';

    return (response);
}

router.post('/show-zs-sc-modal', async (req, res) => {
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
     var response = await buildResponseZSPSCM(userSettingsChannels);
    return res.status(200).send(response);
});

async function buildResponseZSPSCPMMM(userSettingsChannels, userMosaicMasks) {
    var k = 1;
    var response = '<select class="form-control mb-3" id="setting-channel-zs-sc-mm-modal">';
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

    k = 1;
    response += '<select class="form-control mb-3" id="mosaic-mask-zs-sc-mm-modal">';
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

    response += '<div class="form-group"><label for="near-limit-zs-sc-mm-modal">Near Limit (um)</label>';
    response += '<input type="text" class="form-control" id="near-limit-zs-sc-mm-modal" placeholder="Near Limit"></div>';

    response += '<div class="form-group"><label for="far-limit-zs-sc-mm-modal">Far Limit (um)</label>';
    response += '<input type="text" class="form-control" id="far-limit-zs-sc-mm-modal" placeholder="Far Limit"></div>';

    response += '<div class="form-group"><label for="step-zs-sc-mm-modal">Step Limit (um)</label>';
    response += '<input type="text" class="form-control" id="step-zs-sc-mm-modal" placeholder="Step Limit"></div>';

    response += '<div class="form-group"><label for="exposure-time-zs-sc-mm-modal">Exposure Time (ms)</label>';
    response += '<input type="text" class="form-control" id="exposure-time-zs-sc-mm-modal" placeholder="Exposure Time"></div>';

    response += '<div class="form-check"><input class="form-check-input" type="checkbox" value="" id="keep-shutter-on-zs-sc-mm-modal">';
    response += '<label class="form-check-label" for="keep-shutter-on-zs-sc-mm-modal">Keep shutter ON while Z-Stacking ?</label></div>';

    return (response);
}

router.post('/show-zs-sc-mm-modal', async (req, res) => {
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
     let userMosaicMasks = await Mosaic_mask.find( { author: userInfo.email } );
     var response = await buildResponseZSPSCPMMM(userSettingsChannels, userMosaicMasks);
    return res.status(200).send(response);
});

async function buildResponseSPPSCM(userSettingsChannels) {
    var k = 1;
    
    var response = '<div class="form-check"><input class="form-check-input" type="checkbox" value="" id="enableConditionnalSPSC">';
    response += '<label class="form-check-label mb-2" for="enableConditionnalSPSC">click here if this node is conditionnal.</label></div>';

    response += '<div class="row">';
    
    response += '<select class="col form-control mb-2" id="typeConditionnalSPCP">';
    response += '<option value="1">IF</option>';
    response += '<option value="2">WHILE</option>';
    response += '</select>'

    response += '<select class="col form-control mb-2" id="leftDataConditionnalSPSC">';
    response += '<option value="1">NB Cells</option>';
    response += '<option value="2">Image</option>';
    response += '</select>'

    response += '<select class="col form-control mb-2" id="operatorConditionnalSPSC">';
    response += '<option value="1">==</option>';
    response += '<option value="2">></option>';
    response += '<option value="3"><</option>';
    response += '<option value="4">>=</option>';
    response += '<option value="5"><=</option>';
    response += '<option value="6">!=</option>';
    response += '</select>'

    response += '<select class="col form-control mb-2" id="rightDataConditionnalSPSC">';
    response += '<option value="1">Option to replace with a number input</option>';
    response += '<option value="2">Blur</option>';
    response += '<option value="3">Black</option>';
    response += '</select>'

    response += '</div>'

    response += '<div class="form-check"><input class="form-check-input" type="checkbox" value="" id="enableSlackConditionnalSPSC">';
    response += '<label class="form-check-label mb-2" for="enableSlackConditionnalSPSC">click here if you want a slack message  of the status.</label></div>';
    
    response += '<select class="form-control mb-3" id="setting-channel-sp-sc-modal">';
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

    response += '<div class="form-group"><label for="exposure-time-sp-sc-modal">Exposure Time (ms)</label>';
    response += '<input type="text" class="form-control" id="exposure-time-sp-sc-modal" placeholder="Exposure Time"></div>';

    return (response);
}

router.post('/show-sp-sc-modal', async (req, res) => {
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
     var response = await buildResponseSPPSCM(userSettingsChannels);
    return res.status(200).send(response);
});

async function buildResponseSPPSCMMM(userSettingsChannels, userMosaicMasks) {
    var k = 1;
    var response = '<select class="form-control mb-3" id="setting-channel-sp-sc-mm-modal">';
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

    k = 1;
    response += '<select class="form-control mb-3" id="mosaic-mask-sp-sc-mm-modal">';
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

    response += '<div class="form-group"><label for="exposure-time-sp-sc-mm-modal">Exposure Time (ms)</label>';
    response += '<input type="text" class="form-control" id="exposure-time-sp-sc-mm-modal" placeholder="Exposure Time"></div>';

    return (response);
}

router.post('/show-sp-sc-mm-modal', async (req, res) => {
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
     let userMosaicMasks = await Mosaic_mask.find( { author: userInfo.email } );
     var response = await buildResponseSPPSCMMM(userSettingsChannels, userMosaicMasks);
    return res.status(200).send(response);
});

async function buildResponseDelayM() {
    var response = '<div class="form-group"><label for="delay-modal">Delay (ms)</label>';
    response += '<input type="text" class="form-control" id="delay-modal" placeholder="Delay"></div>';

    return (response);
}

router.post('/show-delay-modal', async (req, res) => {
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
     var response = await buildResponseDelayM();
    return res.status(200).send(response);
});

async function buildResponseSequenceM() {
    var response = '<div class="form-group"><label for="nb-repetition-modal">Nb repeats</label>';
    response += '<input type="text" class="form-control" id="nb-repetition-modal" placeholder="Nb repeats"></div>';

    response += '<div class="form-group"><label for="time-per-repetition-modal">Time per repetition (m)</label>';
    response += '<input type="text" class="form-control" id="time-per-repetition-modal" placeholder="Delay"></div>';

    return (response);
}

router.post('/show-sequence-modal', async (req, res) => {
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
     var response = await buildResponseSequenceM();
    return res.status(200).send(response);
});

async function buildResponseMFVM() {
    var response = '<label for="valve-1-modal">Valve 1</label><select class="form-control mb-3" id="valve-1-modal">';
    response += '<option value="1">Open</option>';
    response += '<option value="2">Close</option>';
    response += '</select>';

    response += '<label for="valve-2-modal">Valve 2</label><select class="form-control mb-3" id="valve-2-modal">';
    response += '<option value="1">Open</option>';
    response += '<option value="2">Close</option>';
    response += '</select>';

    response += '<label for="valve-3-modal">Valve 3</label><select class="form-control mb-3" id="valve-3-modal">';
    response += '<option value="1">Open</option>';
    response += '<option value="2">Close</option>';
    response += '</select>';

    response += '<label for="valve-4-modal">Valve 4</label><select class="form-control mb-3" id="valve-4-modal">';
    response += '<option value="1">Open</option>';
    response += '<option value="2">Close</option>';
    response += '</select>';

    response += '<label for="valve-5-modal">Valve 5</label><select class="form-control mb-3" id="valve-5-modal">';
    response += '<option value="1">Open</option>';
    response += '<option value="2">Close</option>';
    response += '</select>';
    return (response);
}

router.post('/show-mfv-modal', async (req, res) => {
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
     var response = await buildResponseMFVM();
    return res.status(200).send(response);
});

module.exports = router;