/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\routes\protocols.js
 * Created Date: Wednesday, April 10th 2019, 1:50:00 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Protocol route
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

const send_notifications = require('./send-notifications');
const globals = require('../globals');

router.post('/get-protocol', async (req, res) => {
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
     let my_protocol = await Protocol.findOne({ protocol_name: req.body.protocol_name });
    return res.status(200).send(my_protocol);
});

router.post('/create-protocol', async (req, res) => {
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
     
     let my_protocol = await Protocol.findOne({ protocol_name: req.body.protocol_name });
     if (!my_protocol) {
         //new entry
         var protocolString = JSON.stringify(req.body.protocol_data);
         my_protocol = new Protocol({
            email: userInfo.email,
            protocol_name: req.body.protocol_name,
            protocol_data: protocolString
        });
        await my_protocol.save();
        return res.status(200).send('{ "success": "' + req.body.protocol_name + ' has been added." }');
     }
    return res.status(400).send('{ "error": "This protocol already exist." }');
});

router.post('/update-protocol', async (req, res) => {
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
     let my_protocol = await Protocol.findOne({ protocol_name: req.body.protocol_name });
     if (!my_protocol) {
        return res.status(400).send('{ "error": "Cannot find a protocol with this name." }');
     }
     else if (my_protocol) {
        Protocol.updateOne({
            "protocol_name": req.body.protocol_name
            }, {
                $set: {
                    "protocol_data": JSON.stringify(req.body.protocol_data)
                }
            }, function(err, results){
                console.log(results);
            });
     }
    return res.status(200).send('{ "success": "' + req.body.protocol_name + ' has been updated." }');
});

router.post('/remove-protocol', async (req, res) => {
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
     await Protocol.deleteOne( { protocol_name: req.body.protocol_name } );
    return res.status(200).send('{ "success": "' + req.body.protocol_name + ' has been removed." }');
});

module.exports = router;