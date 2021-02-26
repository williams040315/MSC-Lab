/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\routes\send-notifications.js
 * Created Date: Wednesday, April 10th 2019, 1:50:00 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Admin panel
 * 
 * OpenSource
 */

const express = require('express');
const router = express.Router();
const request = require('sync-request');
const { Token, validateToken } = require('../models/token');
const { User } = require('../models/user');
const { Equipement } = require('../models/equipement');

const send_notifications = require('./send-notifications');
const globals = require('../globals');

function buildResponse(finalResponse) {
    var res = '<table class="table table-striped table-dark"><thead><tr><th scope="col">#</th><th scope="col">Name</th><th scope="col">IP address</th><th scope="col">Delete</th></tr></thead><tbody>';

    for (var i = 0; i < finalResponse.length; i++) {
        var j = i + 1;
        res += '<tr><th scope="row">'+ j + '</th>';
        res += '<td>' + finalResponse[i].equipement_name + '</td>';
        res += '<td>' + finalResponse[i].ip_address + '</td>';
        res += '<td>' + '<button class="btn btn-outline-danger my-2 my-sm-0 btn-sm" type="submit" onclick="removeMicroscope(\'' + finalResponse[i].equipement_name + '\')">Delete</button>' + '</td>';
        res += "</tr>";
    }
    res += '</tbody></table>';

    //add the modal

    res += '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addMicroscopeModal">Add a new microscope</button>';
    res += '<div class="modal fade" id="addMicroscopeModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">';
    res += '<div class="modal-dialog modal-dialog-centered" role="document">';
    res += '<div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="exampleModalLongTitle">New microscope</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close">';
    res += '<span aria-hidden="true">&times;</span></button></div>';
    
    res += '<div class="modal-body">';
    
    res += '<div class="form-group"><label for="microscope-name">Microscope name</label><input type="text" class="form-control" id="microscope-name" placeholder="Microscope name"></div>';
    res += '<div class="form-group"><label for="microscope-IP">Microscope IP</label><input type="text" class="form-control" id="microscope-IP" placeholder="Microscope IP"></div>';
    res += '</div>'

    res += '<div class="modal-footer"><button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>';
    res += '<button type="button" class="btn btn-success" onclick="addMicroscope()" data-dismiss="modal">Add microscope</button>';
    res += '</div></div></div></div>';
    return (res);
}

router.post('/list-microscope', async (req, res) => {
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
    let equipementInfo = await Equipement.find();
    var toReturn = buildResponse(equipementInfo);
    return res.status(200).send(toReturn);
});

router.post('/add-microscope', async (req, res) => {
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
    let microscopeInsert = await Equipement.findOne({ equipement_name: req.body.microscope_name });
     if (!microscopeInsert) {
         //new entry
         microscopeInsert = new Equipement({
            equipement_name: req.body.microscope_name,
            begin_time: " - ",
            is_available: "true",
            current_user: " - ",
            ip_address: req.body.microscope_ip
        });
        await microscopeInsert.save();
        if (globals.enableSlackNotifications) {
            send_notifications.sendMessageToSlack("Microscope " + req.body.microscope_name + " with IP: " + req.body.microscope_ip + " has been successfully added by " + userInfo.name + ".");
        }
        return res.status(200).send('{ "success": "' + req.body.microscope_name + ' has been added." }');
     }
    return res.status(400).send('{ "error": "This microscope already exist." }');
});

router.post('/remove-microscope', async (req, res) => {
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
    await Equipement.deleteOne( { equipement_name: req.body.microscope_name } );
    if (globals.enableSlackNotifications) {
        send_notifications.sendMessageToSlack("Microscope " + req.body.microscope_name + " has been successfully deleted by " + userInfo.name + ".");
    }
    return res.status(200).send('{ "success": "' + req.body.microscope_name + ' has been removed." }');
});

module.exports = router;