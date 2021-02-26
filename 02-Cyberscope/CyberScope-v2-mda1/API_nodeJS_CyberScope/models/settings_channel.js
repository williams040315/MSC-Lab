/*
 * Filename: c:\Users\Natasha\Desktop\cyber-scope\models\settings_channel.js
 * Created Date: Monday, May 6th 2019, 2:59:17 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Request schema and validation for settings channels
 * 
 * OpenSource
 */

const Joi = require('joi');
const mongoose = require('mongoose');

const Settings_channel = mongoose.model('Settings_channel', new mongoose.Schema({
    channel_author: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255
    },
    
    channel_name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255
    },

    is_cl_4000_fluo: { type: String, required: true, minlength: 1, maxlength: 255 },
    is_cl_4000_mosaic: { type: String, required: true, minlength: 1, maxlength: 255 },
    is_cl_100_fluo: { type: String, required: true, minlength: 1, maxlength: 255 },
    is_cl_100_mosaic: { type: String, required: true, minlength: 1, maxlength: 255 },
    is_cl_300_fluo: { type: String, required: true, minlength: 1, maxlength: 255 },
    is_cl_300_mosaic: { type: String, required: true, minlength: 1, maxlength: 255 },
    is_xc_120_pc_fluo: { type: String, required: true, minlength: 1, maxlength: 255 },
    is_xc_120_pc_mosaic: { type: String, required: true, minlength: 1, maxlength: 255 },
    is_olympus_ix81: { type: String, required: true, minlength: 1, maxlength: 255 },
    is_olympus_ix83: { type: String, required: true, minlength: 1, maxlength: 255 },
    is_olympus_ix71: { type: String, required: true, minlength: 1, maxlength: 255 },

    cl_4000_fluo_la: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_fluo_lb: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_fluo_lc: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_fluo_ld: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_fluo_ia: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_fluo_ib: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_fluo_ic: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_fluo_id: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_fluo_sa: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_fluo_sb: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_fluo_sc: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_fluo_sd: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_mosaic_la: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_mosaic_lb: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_mosaic_lc: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_mosaic_ld: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_mosaic_ia: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_mosaic_ib: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_mosaic_ic: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_mosaic_id: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_mosaic_sa: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_mosaic_sb: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_mosaic_sc: { type:  String, minlength: 0, maxlength: 255 },
    cl_4000_mosaic_sd: { type:  String, minlength: 0, maxlength: 255 },
    cl_100_fluo_b: { type:  String, minlength: 0, maxlength: 255 },
    cl_100_fluo_s: { type:  String, minlength: 0, maxlength: 255 },
    cl_100_fluo_i: { type:  String, minlength: 0, maxlength: 255 },
    cl_100_mosaic_b: { type:  String, minlength: 0, maxlength: 255 },
    cl_100_mosaic_s: { type:  String, minlength: 0, maxlength: 255 },
    cl_100_mosaic_i: { type:  String, minlength: 0, maxlength: 255 },
    cl_300_fluo_ba: { type:  String, minlength: 0, maxlength: 255 },
    cl_300_fluo_bb: { type:  String, minlength: 0, maxlength: 255 },
    cl_300_fluo_bc: { type:  String, minlength: 0, maxlength: 255 },
    cl_300_fluo_s: { type:  String, minlength: 0, maxlength: 255 },
    cl_300_fluo_i: { type:  String, minlength: 0, maxlength: 255 },
    cl_300_mosaic_ba: { type:  String, minlength: 0, maxlength: 255 },
    cl_300_mosaic_bb: { type:  String, minlength: 0, maxlength: 255 },
    cl_300_mosaic_bc: { type:  String, minlength: 0, maxlength: 255 },
    cl_300_mosaic_s: { type:  String, minlength: 0, maxlength: 255 },
    cl_300_mosaic_i: { type:  String, minlength: 0, maxlength: 255 },
    xc_120_pc_fluo_s: { type:  String, minlength: 0, maxlength: 255 },
    xc_120_pc_fluo_i: { type:  String, minlength: 0, maxlength: 255 },
    xc_120_pc_mosaic_s: { type:  String, minlength: 0, maxlength: 255 },
    xc_120_pc_mosaic_i: { type:  String, minlength: 0, maxlength: 255 },
    olix81_s: { type:  String, minlength: 0, maxlength: 255 },
    olix81_i: { type:  String, minlength: 0, maxlength: 255 },
    olix81_l: { type:  String, minlength: 0, maxlength: 255 },
    olix81_w: { type:  String, minlength: 0, maxlength: 255 },
    olix83_s: { type:  String, minlength: 0, maxlength: 255 },
    olix83_i: { type:  String, minlength: 0, maxlength: 255 },
    olix83_l: { type:  String, minlength: 0, maxlength: 255 },
    olix83_w: { type:  String, minlength: 0, maxlength: 255 },
    olix71_s: { type:  String, minlength: 0, maxlength: 255 },
    olix71_i: { type:  String, minlength: 0, maxlength: 255 },
    olix71_l: { type:  String, minlength: 0, maxlength: 255 },
    olix71_w: { type:  String, minlength: 0, maxlength: 255 }
}));

function validateSettingsChannels(settingsChannels) {
    const schema = {
        name: Joi.string().min(2).max(255).required().email(),
        html: Joi.string().min(2).max(4096).required()
    };
    return Joi.validate(settingsChannels, schema);
}

exports.Settings_channel = Settings_channel;
exports.validateDeviceSettingsChannels = validateSettingsChannels;