/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\routes\infos.js
 * Created Date: Friday, April 5th 2019, 2:28:13 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Mosaic masks routes
 * 
 * OpenSource
 */

const express = require('express');
const { Token, validateToken } = require('../models/token');
const { User } = require('../models/user');
const { Equipement } = require('../models/equipement');
const { Mosaic_mask } = require('../models/mosaic_mask');
const globals = require('../globals');
const router = express.Router();

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

function buildRawWPaint(userMasks) {
    var response = '<div class="row mt-4"><div class="col">';
    response += '<div class="form-group"><label for="newMaskName">Setting channel name</label><input type="text" class="form-control" id="newMaskName" placeholder="Mask name"></div>';
    response += '<div class="border border-danger" id="wPaint-creation" style="background-image: url(' + globals.nodeRedIpCamera + ');width: 512px !important; height: 512px !important;position:relative;background-size: auto 100% !important;"></div>';
    response += '<button type="button" class="btn btn-success mt-3" onclick="createMask()">Create</button>';
    response += '<button type="button" class="btn btn-primary mt-3 ml-2" data-toggle="modal" data-target="#loadb64creationmask">Load from Base64</button>';
    response += '<div class="modal fade" id="loadb64creationmask" tabindex="-1" role="dialog" aria-labelledby="loadb64creationmaskTitle" aria-hidden="true">';
    response += '<div class="modal-dialog modal-dialog-centered" role="document"><div class="modal-content"><div class="modal-header">';
    response += '<h5 class="modal-title" id="loadb64creationmaskLongTitle">Load mask from Base64</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    response += '</div><div class="modal-body">Only 512x512 PNG converted in Base64 are accepted.<br > You can click <a href="https://www.base64-image.de/" target="_blank">here</a> to convert your PNG in Base64.<br >Upload your mask and then click on "copy image", then just CTRL-V in the text area below<br >';
    response += '<div class="input-group"><textarea class="form-control" aria-label="With textarea" id="B64_Mask" placeholder="data:image/png;base64,..." ></textarea></div></div>';
    response += '<div class="modal-footer"><button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button><button type="button" class="btn btn-success" onclick="loadFromB64Mask()" data-dismiss="modal">Apply</button></div>'
    response += '</div></div></div>';

    response += '</div>';
    var nbCol = 1; // set directement a 1 car create prend 1, set à 0 dans la boucle au reset de la row
    for (var i = 0; i < userMasks.length; i++) {
        if (nbCol != 2) {
            response += '<div class="col"><div class="form-group"><label for="' + userMasks[i].mask_name + 'MaskName">Setting channel name</label><input type="text" class="form-control" id="' + userMasks[i].mask_name + 'MaskName" placeholder="Mask name"></div>';
            response += '<div class="border border-danger" id="wPaint-' + userMasks[i].mask_name + '" style="background-image: url(' + globals.nodeRedIpCamera + ');width: 512px !important; height: 512px !important;position:relative;background-size: auto 100% !important;"></div>';
            response += '<button type="button" class="btn btn-primary mt-3" onclick="updateMask(\'' + userMasks[i].mask_name + '\')">Update</button><button type="button" class="btn btn-secondary mt-3 ml-2" onclick="exportMask(\'' + userMasks[i].mask_name + '\')">Export</button><button type="button" class="btn btn-danger mt-3 ml-2" onclick="deleteMask(\'' + userMasks[i].mask_name + '\')">Delete</button></div>';
            nbCol++;
        }
        if (nbCol == 2 && i + 1 < userMasks.length) {
            response += '</div><div class="row mt-4">';
            nbCol = 0;
        }
        else if (nbCol == 2) {
            response += '</div>';
        }
    }
    if (nbCol != 2) {
        response += '</div>';
    }
    return response;
}

async function optionMosaic(user_email, select_option = null)
{
    var res = "";
    console.log("selec_option\n", select_option);
    let userMasks = await Mosaic_mask.find( { author: user_email } );

    for (var i = 0; i < userMasks.length; i++) {
        console.log(userMasks[i]._id);
        res += "<option name='"+ userMasks[i].mask_name  + "' value='" + userMasks[i]._id + "' " + (select_option == userMasks[i]._id ? "selected" : "") + ">"
        res += userMasks[i].mask_name
        res += "</option>"
    }

    return res;
}

router.post('/get-mosaic-masks', async (req, res) => {
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
    let userMasks = await Mosaic_mask.find( { author: userToken.email } );
    var otherResponse = listOption(checkStuff);
    otherResponse += buildRawWPaint(userMasks);
    return res.status(200).send(otherResponse);
});

router.post('/get-user-mosaic-masks', async (req, res) => {
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
    let userMasks = await Mosaic_mask.find( { author: userToken.email } );
    return res.status(200).send(userMasks);
});

router.get('/get-user-mosaic-masks', async (req, res) => {
    if (!req.headers.access_token) {
        return res.status(400).send('{ "error": "You need to provide an access_token" }');
    }
    let userToken = await Token.findOne({ token: req.headers.access_token });
     if (!userToken) {
         return res.status(400).send('{ "error": "Incorrect access_token." }');
     }
     let userInfo = await User.findOne({ email: userToken.email });
     if (!userInfo) {
        return res.status(400).send('{ "error": "Cannot find a user with this token." }');
    }
    //let userMasks = await Mosaic_mask.find( { author: userToken.email } );
    let result = await optionMosaic(userToken.email, req.headers.select_option);
    return res.status(200).send(result);
});


router.post('/get-mosaic-mask-from-name', async (req, res) => {
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
    let userMasks = await Mosaic_mask.find( { mask_name: req.body.mask_name } );
    return res.status(200).send(userMasks);
});

router.post('/create-mosaic-masks', async (req, res) => {
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
    let maskInsert = await Mosaic_mask.findOne({ mask_name: req.body.mask_name });
     if (!maskInsert) {
         //new entry
         maskInsert = new Mosaic_mask({
            author: userToken.email,
            mask_name: req.body.mask_name,
            b64_mask: req.body.b64_mask
        });
        await maskInsert.save();
        return res.status(200).send('{ "status": "Mask ' + req.body.mask_name + ' created." }');
     }
    return res.status(400).send('{ "error": "This mask already exist." }');
    
});

router.post('/delete-mosaic-mask', async (req, res) => {
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
    await Mosaic_mask.deleteOne( { mask_name: req.body.mask_name } );
    return res.status(200).send('{ "success": "Mask ' + req.body.mask_name + ' successfully deleted." }');
});

router.post('/update-mosaic-mask', async (req, res) => {
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
    let userMosaicMask = await Mosaic_mask.findOne({ mask_name: req.body.mask_name });
     if (!userMosaicMask) {
        return res.status(400).send('{ "error": "Mask ' + req.body.mask_name + ' not found." }');
     }
     Mosaic_mask.updateOne({
        "mask_name": req.body.mask_name
        }, {
            $set: {
                "mask_name": req.body.mask_name_new,
                "b64_mask": req.body.b64_mask
            }
        }, function(err, results){
            console.log(results);
        });
    return res.status(200).send('{ "success": "Mask ' + req.body.mask_name + ' successfully updated." }');
});

module.exports = router;