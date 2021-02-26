/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\models\protocol.js
 * Created Date: Friday, April 5th 2019, 11:56:08 am
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Request schema and validation for protocol
 * 
 * OpenSource
 */

const Joi = require('joi');
const mongoose = require('mongoose');

const Protocol = mongoose.model('Protocol', new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    protocol_name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 256
    },
    protocol_data: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 20000000
    }
}));

function validateProtocol(protocol) {
    const schema = {
        email: Joi.string().min(5).max(255).email(),
        protocol_name: Joi.string().min(1).max(256).required(),
        protocol_data: Joi.string().min(4).max(20000000).required()
    };
    return Joi.validate(protocol, schema);
}

exports.Protocol = Protocol;
exports.validateProtocol = validateProtocol;