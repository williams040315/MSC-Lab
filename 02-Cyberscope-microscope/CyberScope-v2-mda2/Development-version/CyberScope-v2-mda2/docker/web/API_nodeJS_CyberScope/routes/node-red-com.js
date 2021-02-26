/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\routes\auth.js
 * Created Date: Thursday, April 4th 2019, 2:37:22 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Route to perform a MDA
 * 
 * OpenSource
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const { Settings_channel } = require('../models/settings_channel');
const { Mosaic_mask } = require('../models/mosaic_mask');

router.post('/upload-picture', async (req, res) => {
    //TODO : Secure with a common token with Node-RED
    //       Maybe check the incoming IP
    //       Get the author in the request body and store the picture in the right directory
    console.log(req.body)
    return res.status(200).send('{"status":"ok"}');
    fs.writeFile(__dirname + "\\..\\users_pictures\\" + req.body.author_email + "\\" + req.body.image_name, req.body.image_content, function(err){
        if (err) {
            console.log("Cannot create this file.");
            return res.status(400).send('{"error":"Cannot create this file."}');
        }
        console.log("Receive picture from Node-RED.");
    });
    return res.status(200).send('{"status":"ok"}');
});

router.post('/ask-settings-channel', async (req, res) => {
    //TODO : Secure with a common token with Node-RED
    //       Maybe check the incoming IP
    //       Get the author in the request body and store the picture in the right directory
    let SettingsChannel = await Settings_channel.findOne({ channel_name: req.body.settings_channel_name });
    if (!SettingsChannel) {
        return res.status(400).send('{"error":"Unknown settings channel."}');
    }
    console.log("\nsetting channel\n",SettingsChannel);
    return res.status(200).send(SettingsChannel);
});

router.post('/ask-mosaic-mask', async (req, res) => {
    //TODO : Secure with a common token with Node-RED
    //       Maybe check the incoming IP
    //       Get the author in the request body and store the picture in the right directory
    let MosaicMask = await Mosaic_mask.findOne({ mask_name: req.body.mosaic_mask_name });
    if (!MosaicMask) {
        return res.status(400).send('{"error":"Unknown mosaic mask."}');
    }
    return res.status(200).send(MosaicMask);
});

module.exports = router;