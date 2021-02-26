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

router.post('/', async (req, res) => {
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

    return res.status(200).send('{ "email": "' + userInfo.email + '", "name": "' + userInfo.name + '" }');
});

module.exports = router;