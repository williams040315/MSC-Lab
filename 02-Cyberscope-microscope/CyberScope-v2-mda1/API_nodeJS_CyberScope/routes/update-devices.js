/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\routes\update-devices.js
 * Created Date: Friday, April 12th 2019, 3:36:39 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: routes for request nodered to update device config
 * 
 * OpenSource
 */

const { Token, validateToken } = require('../models/token');
const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();
const request = require('sync-request');

const globals = require('../globals');

router.post('/update/mosaic', async (req, res) => {
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
    var mname = await globals.getMicroscopeNameFromUserEmail(userToken.email);
    try {
        var resp = request('POST', globals.nodeRedIP + globals.nodeRedAndorMosaic, {
            timeout: 10000,
            headers: { 'Authorization': globals.nodeRedToken },
            json: { microscope: mname.microscope, mask: req.body.mask, device: "Andor-Mosaic-3", mode: "manual" },
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(' { "error": "' + error + '" } ');
    }
    console.log(resp.getBody('utf8'));
    return res.status(200).send(' { "status": "ok" } ');
});

router.post('/update/olympusix81', async (req, res) => {
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
    var mname = await globals.getMicroscopeNameFromUserEmail(userToken.email);
    try {
        var resp = request('POST', globals.nodeRedIP + globals.nodeRedOlympus, {
            timeout: 10000,
            headers: { 'Authorization': globals.nodeRedToken },
            json: { microscope: mname.microscope, action: req.body.action, shutter: req.body.shutter, intensity: req.body.intensity, lamp: req.body.lamp, wheel_filter: req.body.wheel_filter, device: "Olympus-IX81", mode: "manual"},
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(' { "error": "' + error + '" } ');
    }
    return res.status(200).send(resp.getBody('utf8'));
});

router.post('/update/xcite', async (req, res) => {
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
    var mname = await globals.getMicroscopeNameFromUserEmail(userToken.email);
    try {
        var resp = request('POST', globals.nodeRedIP + globals.nodeRedLumen, {
            timeout: 10000,
            headers: { 'Authorization': globals.nodeRedToken },
            json: { microscope: mname.microscope, action: req.body.action, shutter: req.body.shutter, intensity: req.body.intensity, device: req.body.device, mode: "manual" },
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(' { "error": "' + error + '" } ');
    }
//    console.log(resp.getBody('utf8')); resp.statusCode == 404
    return res.status(200).send(resp.getBody('utf8'));
});

router.post('/update/z-axis', async (req, res) => { //TODO IMPORTANT !!
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
    var mname = await globals.getMicroscopeNameFromUserEmail(userToken.email);
    try {
        var resp = request('POST', globals.nodeRedIP + globals.nodeRedOlympus, {
            timeout: 10000,
            headers: { 'Authorization': globals.nodeRedToken },
            json: { microscope: mname.microscope, action: req.body.action, mode: "manual", type: req.body.type, zValue: req.body.zValue },
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(' { "error": "' + error + '" } ');
    }
    return res.status(200).send(' { "status": "ok" } ');
});

router.post('/update/priormotionstage', async (req, res) => {
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
    var mname = await globals.getMicroscopeNameFromUserEmail(userToken.email);
    try {
        var resp = request('POST', globals.nodeRedIP + globals.nodeRedPriorMotionStage, {
            timeout: 10000,
            headers: { 'Authorization': globals.nodeRedToken },
            json: { microscope: mname.microscope, action: req.body.action, "X": req.body.x, "Y": req.body.y, device: "PriorScientific_V31XYZE", mode: "manual"},
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(' { "error": "' + error + '" } ');
    }
    //console.log(resp.getBody('utf8'));
    return res.status(200).send(resp.getBody('utf8'));
});

router.post('/update/coolledpe4000', async (req, res) => {
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

    if (!req.body.Ia || parseInt(req.body.Ia) < 0 || parseInt(req.body.Ia) > 100) {
        return res.status(400).send('{ "error": "Bad value for Intensity A." }');
    }
    if (!req.body.Ib || parseInt(req.body.Ib) < 0 || parseInt(req.body.Ib) > 100) {
        return res.status(400).send('{ "error": "Bad value for Intensity B." }');
    }
    if (!req.body.Ic || parseInt(req.body.Ic) < 0 || parseInt(req.body.Ic) > 100) {
        return res.status(400).send('{ "error": "Bad value for Intensity C." }');
    }
    if (!req.body.Id || parseInt(req.body.Id) < 0 || parseInt(req.body.Id) > 100) {
        return res.status(400).send('{ "error": "Bad value for Intensity D." }');
    }
    if (!req.body.auto_close) {
        return res.status(400).send('{ "error": "Bad value for Auto Close. -1 disable AutoClose." }');
    }
    if (parseInt(req.body.auto_close) < -1 || parseInt(req.body.auto_close) > 60000) {
        return res.status(400).send('{ "error": "Bad value for AutoClose. The value must be in range -1 <=> 60000." }');
    }
    var mname = await globals.getMicroscopeNameFromUserEmail(userToken.email);
    try {
        var resp = request('POST', globals.nodeRedIP + globals.nodeRedCoolLed, {
            timeout: 10000,
            headers: { 'Authorization': globals.nodeRedToken },
            json: { microscope: mname.microscope, device: req.body.device, auto_close: req.body.auto_close, action: req.body.action, mode: req.body.mode, "La": req.body.La, "Lb": req.body.Lb, "Lc": req.body.Lc, "Ld": req.body.Ld, "Ia": req.body.Ia, "Ib": req.body.Ib, "Ic": req.body.Ic, "Id": req.body.Id, "Sa": req.body.Sa, "Sb": req.body.Sb, "Sc": req.body.Sc, "Sd": req.body.Sd},
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(' { "error": "' + error + '" } ');
    }
    if (req.body.action && req.body.action == "getChannelsValues") {
        return res.status(200).send(resp.getBody('utf8'));
    }
    return res.status(200).send(' { "status": "ok" } ');
});

router.post('/update/xcite', async (req, res) => {
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
    var mname = await globals.getMicroscopeNameFromUserEmail(userToken.email);
    try {
        var resp = request('POST', globals.nodeRedIP + globals.nodeRedLumen, {
            timeout: 10000,
            headers: { 'Authorization': globals.nodeRedToken },
            json: { microscope: mname.microscope, action: req.body.action, shutter: req.body.shutter, intensity: req.body.intensity, device: req.body.device, mode: "manual" },
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(' { "error": "' + error + '" } ');
    }
//    console.log(resp.getBody('utf8')); resp.statusCode == 404
    return res.status(200).send(resp.getBody('utf8'));
});

router.post('/update/z-axis', async (req, res) => { //TODO IMPORTANT !!
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
    var mname = await globals.getMicroscopeNameFromUserEmail(userToken.email);
    try {
        var resp = request('POST', globals.nodeRedIP + globals.nodeRedOlympus, {
            timeout: 10000,
            headers: { 'Authorization': globals.nodeRedToken },
            json: { microscope: mname.microscope, action: req.body.action, mode: "manual", type: req.body.type, zValue: req.body.zValue },
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(' { "error": "' + error + '" } ');
    }
    return res.status(200).send(' { "status": "ok" } ');
});

router.post('/update/autofocus', async (req, res) => {
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
    var mname = await globals.getMicroscopeNameFromUserEmail(userToken.email);
    try {
        var resp = request('POST', globals.nodeRedIP + globals.nodeRedAutoFocus, {
            timeout: 18000,
            headers: { 'Authorization': globals.nodeRedToken },
            json: { microscope: mname.microscope, action: req.body.action, obj: req.body.obj, afnlmtValue: req.body.afnlmtValue, afflmtValue: req.body.afflmtValue, offset: req.body.offset, mode: "manual" },
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(' { "error": "' + error + '" } ');
    }
//    console.log(resp.getBody('utf8')); resp.statusCode == 404
    return res.status(200).send(resp.getBody('utf8'));
});


module.exports = router;