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
const { Token, validateToken } = require('../models/token');
const { User } = require('../models/user');
const { Equipement } = require('../models/equipement');
const { Settings_channel } = require('../models/settings_channel');
const { Devices_html } = require('../models/devices_html');

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

async function buildCreateForm(option, channel_name) {
    let device = {};
    
    var res = '<div class="form-group"><label for="'+channel_name+'scName">Setting channel name</label><input type="text" class="form-control" id="'+channel_name+'scName" placeholder="Setting channel name"></div>';


  
  

    res += '<div onclick="setAccordionVisibility(\'' + channel_name + '\')">';
    res += '<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="'+channel_name+'cbCoolLedpE4000fluo" value="option1"><label class="form-check-label" for="'+channel_name+'cbCoolLedpE4000fluo">CoolLed-pE4000 - Fluo</label></div>';
    res += '<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="'+channel_name+'cbCoolLedpE4000mosaic" value="option1"><label class="form-check-label" for="'+channel_name+'cbCoolLedpE4000mosaic">CoolLed-pE4000 - Mosaic</label></div>';
    res += '<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="'+channel_name+'cbCoolLedpE100fluo" value="option1"><label class="form-check-label" for="'+channel_name+'cbCoolLedpE100fluo">CoolLed-pE100 - Fluo</label></div>';
    res += '<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="'+channel_name+'cbCoolLedpE100mosaic" value="option1"><label class="form-check-label" for="'+channel_name+'cbCoolLedpE100mosaic">CoolLed-pE100 - Mosaïc</label></div>';
    res += '<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="'+channel_name+'cbCoolLedpE300fluo" value="option1"><label class="form-check-label" for="'+channel_name+'cbCoolLedpE300fluo">CoolLed-pE300 - Fluo</label></div>';
    res += '<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="'+channel_name+'cbCoolLedpE300mosaic" value="option1"><label class="form-check-label" for="'+channel_name+'cbCoolLedpE300mosaic">CoolLed-pE300 - Mosaïc</label></div>';
    res += '<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="'+channel_name+'cbXCite120PCfluo" value="option1"><label class="form-check-label" for="'+channel_name+'cbXCite120PCfluo">X-Cite-120PC - Fluo</label></div>';
    res += '<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="'+channel_name+'cbXCite120PCmosaic" value="option1"><label class="form-check-label" for="'+channel_name+'cbXCite120PCmosaic">X-Cite-120PC - Mosaïc</label></div>';
    res += '<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="'+channel_name+'cbOlympusIX81" value="option1"><label class="form-check-label" for="'+channel_name+'OlympusIX81">Olympus-IX81</label></div>';
    res += '<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="'+channel_name+'cbOlympusIX83" value="option1"><label class="form-check-label" for="'+channel_name+'OlympusIX83">Olympus-IX83</label></div>';
    res += '<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="'+channel_name+'cbOlympusIX71" value="option1"><label class="form-check-label" for="'+channel_name+'OlympusIX71">Olympus-IX71</label></div>';

    res += '</div>';


    res += '<div id="'+channel_name+'accordion" class="mt-4">';


    device = await Devices_html.findOne( { name: "CoolLed_pE4000_fluorescence" } );
    res += '<div id="'+channel_name+'a-coolledpe4000fluo" class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#'+channel_name+'coolLedPe4000Fluo">CoolLed-pE4000 - Fluo</a></div><div id="'+channel_name+'coolLedPe4000Fluo" class="collapse" data-parent="#'+channel_name+'accordion"><div class="card-body">';
    res += device.html_sc;
    res += '</div></div></div>';

    device = await Devices_html.findOne( { name: "CoolLed_pE4000_mosaic" } );
    res += '<div id="'+channel_name+'a-coolledpe4000mosaic" class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#'+channel_name+'coolLedPe4000Mosaic">CoolLed-pE4000 - Mosaïc</a></div><div id="'+channel_name+'coolLedPe4000Mosaic" class="collapse" data-parent="#'+channel_name+'accordion"><div class="card-body">';
    res += device.html_sc;
    res += '</div></div></div>';

    device = await Devices_html.findOne( { name: "CoolLed_pE100_fluorescence" } );
    res += '<div id="'+channel_name+'a-coolledpe100fluo" class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#'+channel_name+'coolLedPe100fluo">CoolLed-pE100 - Fluo</a></div><div id="'+channel_name+'coolLedPe100fluo" class="collapse" data-parent="#'+channel_name+'accordion"><div class="card-body">';
    res += device.html_sc;
    res += '</div></div></div>';

    device = await Devices_html.findOne( { name: "CoolLed_pE100_mosaic" } );
    res += '<div id="'+channel_name+'a-coolledpe100mosaic" class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#'+channel_name+'coolLedPe100mosaic">CoolLed-pE100 - Mosaïc</a></div><div id="'+channel_name+'coolLedPe100mosaic" class="collapse" data-parent="#'+channel_name+'accordion"><div class="card-body">';
    res += device.html_sc;
    res += '</div></div></div>';

    device = await Devices_html.findOne( { name: "CoolLed_pE300_fluorescence" } );
    res += '<div id="'+channel_name+'a-coolledpe300fluo" class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#'+channel_name+'coolLedPe300fluo">CoolLed-pE300 - Fluo</a></div><div id="'+channel_name+'coolLedPe300fluo" class="collapse" data-parent="#'+channel_name+'accordion"><div class="card-body">';
    res += device.html_sc;
    res += '</div></div></div>';

    device = await Devices_html.findOne( { name: "CoolLed_pE300_mosaic" } );
    res += '<div id="'+channel_name+'a-coolledpe300mosaic" class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#'+channel_name+'coolLedPe300mosaic">CoolLed-pE300 - Mosaïc</a></div><div id="'+channel_name+'coolLedPe300mosaic" class="collapse" data-parent="#'+channel_name+'accordion"><div class="card-body">';
    res += device.html_sc;
    res += '</div></div></div>';

    device = await Devices_html.findOne( { name: "X_Cite_120PC_fluorescence" } );
    res += '<div id="'+channel_name+'a-xcite120pc-fluo" class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#'+channel_name+'xcite120pcfluo">X-Cite-120PC - Fluo</a></div><div id="'+channel_name+'xcite120pcfluo" class="collapse" data-parent="#'+channel_name+'accordion"><div class="card-body">';
    res += device.html_sc;
    res += '</div></div></div>';

    device = await Devices_html.findOne( { name: "X_Cite_120PC_mosaic" } );
    res += '<div id="'+channel_name+'a-xcite120pc-mosaic" class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#'+channel_name+'xcite120pcmosaic">X-Cite-120PC - Mosaïc</a></div><div id="'+channel_name+'xcite120pcmosaic" class="collapse" data-parent="#'+channel_name+'accordion"><div class="card-body">';
    res += device.html_sc;
    res += '</div></div></div>';

    device = await Devices_html.findOne( { name: "Olympus_IX81" } );
    res += '<div id="'+channel_name+'a-olympusix81" class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#'+channel_name+'olympusix81">Olympus-IX81</a></div><div id="'+channel_name+'olympusix81" class="collapse" data-parent="#'+channel_name+'accordion"><div class="card-body">';
    res += device.html_sc;
    res += '</div></div></div>';

    device = await Devices_html.findOne( { name: "Olympus_IX83" } );
    res += '<div id="'+channel_name+'a-olympusix83" class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#'+channel_name+'olympusix83">Olympus-IX83</a></div><div id="'+channel_name+'olympusix83" class="collapse" data-parent="#'+channel_name+'accordion"><div class="card-body">';
    res += device.html_sc;
    res += '</div></div></div>';

    device = await Devices_html.findOne( { name: "Olympus_IX71" } );
    res += '<div id="'+channel_name+'a-olympusix71" class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#'+channel_name+'olympusix71">Olympus-IX71</a></div><div id="'+channel_name+'olympusix71" class="collapse" data-parent="#'+channel_name+'accordion"><div class="card-body">';
    res += device.html_sc;
    res += '</div></div></div>';



    res += '</div>';

    if (option == 1) {
        res += '<button type="button" class="btn btn-success mt-4" onclick="createSettingChannel()">Create</button>';
    }
    else if (option == 2) {
        var dataTarget = "#" + channel_name + "cdeletionmodal";
        var modalID = channel_name + "cdeletionmodal";
        res += '<button type="button" class="btn btn-primary mt-4" onclick="updateSettingChannel(\'' + channel_name + '\')">Update</button>';
        res += '<button type="button" data-toggle="modal" data-target="'+dataTarget+'" class="btn btn-danger mt-4 ml-2">Remove</button>';
        res += '<div class="modal fade" id="'+modalID+'" tabindex="-1" role="dialog" aria-labelledby="'+modalID+'Title" aria-hidden="true">';
        res += '<div class="modal-dialog modal-dialog-centered" role="document"><div class="modal-content"><div class="modal-header">';
        res += '<h5 class="modal-title" id="exampleModalLongTitle">Delete '+channel_name+'</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close">';
        res += '<span aria-hidden="true">&times;</span></button></div><div class="modal-body">Are you sure you want to delete '+channel_name+' ?</div><div class="modal-footer">';
        res += '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button><button type="button" class="btn btn-danger" data-dismiss="modal" onclick="removeSettingChannel(\'' + channel_name + '\')">Delete</button>';
        res += '</div></div></div></div>';
    }
    return (res);
}

async function buildUpdateForms(upschannel) {
    var res = '<div class="form-group"><label for="scName">Setting channel name</label><input type="text" class="form-control" id="scName" placeholder="Setting channel name"></div>';


  
  

    res += '<div onclick="setAccordionVisibility()">';
    res += '<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="cbCoolLedpE4000fluo" value="option1" checked><label class="form-check-label" for="cbCoolLedpE4000fluo">CoolLed-pE4000 - Fluo</label></div>';
    res += '<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="cbCoolLedpE4000mosaic" value="option1" checked><label class="form-check-label" for="cbCoolLedpE4000mosaic">CoolLed-pE4000 - Mosaic</label></div>';
    res += '<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="cbCoolLedpE100fluo" value="option1" checked><label class="form-check-label" for="cbCoolLedpE100fluo">CoolLed-pE100 - Fluo</label></div>';
    res += '<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="cbCoolLedpE100mosaic" value="option1" checked><label class="form-check-label" for="cbCoolLedpE100mosaic">CoolLed-pE100 - Mosaïc</label></div>';
    res += '<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="cbCoolLedpE300fluo" value="option1" checked><label class="form-check-label" for="cbCoolLedpE300fluo">CoolLed-pE300 - Fluo</label></div>';
    res += '<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="cbCoolLedpE300mosaic" value="option1" checked><label class="form-check-label" for="cbCoolLedpE300mosaic">CoolLed-pE300 - Mosaïc</label></div>';
    res += '<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="cbXCite120PCfluo" value="option1" checked><label class="form-check-label" for="cbXCite120PCfluo">X-Cite-120PC - Fluo</label></div>';
    res += '<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" id="cbXCite120PCmosaic" value="option1" checked><label class="form-check-label" for="cbXCite120PCmosaic">X-Cite-120PC - Mosaïc</label></div>';
  
    res += '</div>';
    return res;
}

async function listSettingsChannel(stuff, user_email)
{
    //    var res = '<div class="row mt-4"><p>You are in settings channel</p></div>';
    var res = '<ul class="nav nav-pills mt-4"><li class="nav-item"><a class="nav-link active" data-toggle="pill" href="#create">Create a Setting Channel</a></li>';
    let userSettingsChannels = await Settings_channel.find( { channel_author: user_email } );
    
    for (var i = 0; i < userSettingsChannels.length; i++) {
        res += '<li class="nav-item">';
        res += '<a class="nav-link" data-toggle="pill" href="#' + userSettingsChannels[i].channel_name + '">' + userSettingsChannels[i].channel_name + '</a>';
        res += '</li>';
    }

    res += '</ul><div class="tab-content">';
    res += '<div class="tab-pane container active mt-3" id="create">'
    res += await buildCreateForm(1, "create42");
    res += '</div>';

    for (var i = 0; i < userSettingsChannels.length; i++) {
        res += '<div class="tab-pane container mt-3" id="' + userSettingsChannels[i].channel_name + '">';
        res += await buildCreateForm(2, userSettingsChannels[i].channel_name);
        res += '</div>';
    }

    res += '</div>';

    return res;
}

router.post('/add-settings-channels', async (req, res) => {
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
    let newSettingChannel = await Settings_channel.findOne({ channel_name: req.body.channel_name });
    if (newSettingChannel) {
        return res.status(400).send('{ "error": "Channel ' + req.body.channel_name + ' already exist." }');
    }

    newSettingChannel = new Settings_channel({
        channel_author: userToken.email,
        channel_name: req.body.channel_name,
        is_cl_4000_fluo: req.body.is4000f,
        is_cl_4000_mosaic: req.body.is4000m,
        is_cl_100_fluo: req.body.is100f,
        is_cl_100_mosaic: req.body.is100m,
        is_cl_300_fluo: req.body.is300f,
        is_cl_300_mosaic: req.body.is300m,
        is_xc_120_pc_fluo: req.body.isxc120pcf,
        is_xc_120_pc_mosaic: req.body.isxc120pcm,
        is_olympus_ix81: req.body.isix81,
        is_olympus_ix83: req.body.isix83,
        is_olympus_ix71: req.body.isix71,
        cl_4000_fluo_la: req.body.cl4000fla,
        cl_4000_fluo_lb: req.body.cl4000flb,
        cl_4000_fluo_lc: req.body.cl4000flc,
        cl_4000_fluo_ld: req.body.cl4000fld,
        cl_4000_fluo_ia: req.body.cl4000fia,
        cl_4000_fluo_ib: req.body.cl4000fib,
        cl_4000_fluo_ic: req.body.cl4000fic,
        cl_4000_fluo_id: req.body.cl4000fid,
        cl_4000_fluo_sa: req.body.cl4000fsa,
        cl_4000_fluo_sb: req.body.cl4000fsb,
        cl_4000_fluo_sc: req.body.cl4000fsc,
        cl_4000_fluo_sd: req.body.cl4000fsd,
        cl_4000_mosaic_la: req.body.cl4000mla,
        cl_4000_mosaic_lb: req.body.cl4000mlb,
        cl_4000_mosaic_lc: req.body.cl4000mlc,
        cl_4000_mosaic_ld: req.body.cl4000mld,
        cl_4000_mosaic_ia: req.body.cl4000mia,
        cl_4000_mosaic_ib: req.body.cl4000mib,
        cl_4000_mosaic_ic: req.body.cl4000mic,
        cl_4000_mosaic_id: req.body.cl4000mid,
        cl_4000_mosaic_sa: req.body.cl4000msa,
        cl_4000_mosaic_sb: req.body.cl4000msb,
        cl_4000_mosaic_sc: req.body.cl4000msc,
        cl_4000_mosaic_sd: req.body.cl4000msd,
        cl_100_fluo_b: req.body.cl100fb,
        cl_100_fluo_s: req.body.cl100fs,
        cl_100_fluo_i: req.body.cl100fi,
        cl_100_mosaic_b: req.body.cl100mb,
        cl_100_mosaic_s: req.body.cl100ms,
        cl_100_mosaic_i: req.body.cl100mi,
        cl_300_fluo_ba: req.body.cl300fba,
        cl_300_fluo_bb: req.body.cl300fbb,
        cl_300_fluo_bc: req.body.cl300fbc,
        cl_300_fluo_s: req.body.cl300fs,
        cl_300_fluo_i: req.body.cl300fi,
        cl_300_mosaic_ba: req.body.cl300mba,
        cl_300_mosaic_bb: req.body.cl300mbb,
        cl_300_mosaic_bc: req.body.cl300mbc,
        cl_300_mosaic_s: req.body.cl300ms,
        cl_300_mosaic_i: req.body.cl300mi,
        xc_120_pc_fluo_s: req.body.xc120pcfs,
        xc_120_pc_fluo_i: req.body.xc120pcfi,
        xc_120_pc_mosaic_s: req.body.xc120pcms,
        xc_120_pc_mosaic_i: req.body.xc120pcmi,
        olix81_i: req.body.olix81i,
        olix81_s: req.body.olix81s,
        olix81_l: req.body.olix81l,
        olix81_w: req.body.olix81w,
        olix83_i: req.body.olix83i,
        olix83_s: req.body.olix83s,
        olix83_l: req.body.olix83l,
        olix83_w: req.body.olix83w,
        olix71_i: req.body.olix71i,
        olix71_s: req.body.olix71s,
        olix71_l: req.body.olix71l,
        olix71_w: req.body.olix71w
    });

    await newSettingChannel.save();
    return res.status(200).send(JSON.parse('{"status": "Channel ' + req.body.channel_name + ' has been created."}'));
});


router.post('/update-settings-channels', async (req, res) => {
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
    Settings_channel.updateOne({
        "channel_name": req.body.old_channel_name
        }, {
            $set: {
                channel_name: req.body.new_channel_name,
                is_cl_4000_fluo: req.body.is4000f,
                is_cl_4000_mosaic: req.body.is4000m,
                is_cl_100_fluo: req.body.is100f,
                is_cl_100_mosaic: req.body.is100m,
                is_cl_300_fluo: req.body.is300f,
                is_cl_300_mosaic: req.body.is300m,
                is_xc_120_pc_fluo: req.body.isxc120pcf,
                is_xc_120_pc_mosaic: req.body.isxc120pcm,
                is_olympus_ix81: req.body.isix81,
                is_olympus_ix83: req.body.isix83,
                is_olympus_ix71: req.body.isix71,
                cl_4000_fluo_la: req.body.cl4000fla,
                cl_4000_fluo_lb: req.body.cl4000flb,
                cl_4000_fluo_lc: req.body.cl4000flc,
                cl_4000_fluo_ld: req.body.cl4000fld,
                cl_4000_fluo_ia: req.body.cl4000fia,
                cl_4000_fluo_ib: req.body.cl4000fib,
                cl_4000_fluo_ic: req.body.cl4000fic,
                cl_4000_fluo_id: req.body.cl4000fid,
                cl_4000_fluo_sa: req.body.cl4000fsa,
                cl_4000_fluo_sb: req.body.cl4000fsb,
                cl_4000_fluo_sc: req.body.cl4000fsc,
                cl_4000_fluo_sd: req.body.cl4000fsd,
                cl_4000_mosaic_la: req.body.cl4000mla,
                cl_4000_mosaic_lb: req.body.cl4000mlb,
                cl_4000_mosaic_lc: req.body.cl4000mlc,
                cl_4000_mosaic_ld: req.body.cl4000mld,
                cl_4000_mosaic_ia: req.body.cl4000mia,
                cl_4000_mosaic_ib: req.body.cl4000mib,
                cl_4000_mosaic_ic: req.body.cl4000mic,
                cl_4000_mosaic_id: req.body.cl4000mid,
                cl_4000_mosaic_sa: req.body.cl4000msa,
                cl_4000_mosaic_sb: req.body.cl4000msb,
                cl_4000_mosaic_sc: req.body.cl4000msc,
                cl_4000_mosaic_sd: req.body.cl4000msd,
                cl_100_fluo_b: req.body.cl100fb,
                cl_100_fluo_s: req.body.cl100fs,
                cl_100_fluo_i: req.body.cl100fi,
                cl_100_mosaic_b: req.body.cl100mb,
                cl_100_mosaic_s: req.body.cl100ms,
                cl_100_mosaic_i: req.body.cl100mi,
                cl_300_fluo_ba: req.body.cl300fba,
                cl_300_fluo_bb: req.body.cl300fbb,
                cl_300_fluo_bc: req.body.cl300fbc,
                cl_300_fluo_s: req.body.cl300fs,
                cl_300_fluo_i: req.body.cl300fi,
                cl_300_mosaic_ba: req.body.cl300mba,
                cl_300_mosaic_bb: req.body.cl300mbb,
                cl_300_mosaic_bc: req.body.cl300mbc,
                cl_300_mosaic_s: req.body.cl300ms,
                cl_300_mosaic_i: req.body.cl300mi,
                xc_120_pc_fluo_s: req.body.xc120pcfs,
                xc_120_pc_fluo_i: req.body.xc120pcfi,
                xc_120_pc_mosaic_s: req.body.xc120pcms,
                xc_120_pc_mosaic_i: req.body.xc120pcmi,
                olix81_i: req.body.olix81i,
                olix81_s: req.body.olix81s,
                olix81_l: req.body.olix81l,
                olix81_w: req.body.olix81w,
                olix83_i: req.body.olix83i,
                olix83_s: req.body.olix83s,
                olix83_l: req.body.olix83l,
                olix83_w: req.body.olix83w,
                olix71_i: req.body.olix71i,
                olix71_s: req.body.olix71s,
                olix71_l: req.body.olix71l,
                olix71_w: req.body.olix71w
            }
        }, function(err, results){
            console.log(results);
        });
    if (req.body.new_channel_name == req.body.old_channel_name) {
        return res.status(200).send(JSON.parse('{"status": "Channel ' + req.body.new_channel_name + ' has been updated."}'));
    }
    return res.status(200).send(JSON.parse('{"status": "Channel ' + req.body.new_channel_name + ' has been updated and renamed."}'));
});

router.post('/get-settings-channels', async (req, res) => {
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
    otherResponse += await listSettingsChannel(checkStuff, userToken.email);
    return res.status(200).send(otherResponse);
});

router.post('/remove-settings-channels', async (req, res) => {
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
    await Settings_channel.deleteOne( { channel_name: req.body.channel_name } );
    var response = '{ "success": "Setting channel ' + req.body.channel_name + ' successfully removed." }';
    return res.status(200).send(response);
});

router.post('/get-settings-channels-from-db', async (req, res) => {
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
    var response = await Settings_channel.find();
    return res.status(200).send(response);
});

module.exports = router;