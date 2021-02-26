/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\models\devices_html.js
 * Created Date: Friday, April 5th 2019, 11:56:08 am
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Request schema and validation for device html
 * 
 * OpenSource
 */

const Joi = require('joi');
const mongoose = require('mongoose');

const Devices_html = mongoose.model('Devices_html', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
        unique: true
    },
    html: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 4096
    },
    html_sc: {
        type: String,
        required: false,
        minlength: 2,
        maxlength: 4096
    },
}));

function validateDevice(token) {
    const schema = {
        name: Joi.string().min(2).max(255).required().email(),
        html: Joi.string().min(2).max(4096).required(),
        html_sc: Joi.string().min(2).max(4096).required()
    };
    return Joi.validate(token, schema);
}

exports.Devices_html = Devices_html;
exports.validateDevice = validateDevice;