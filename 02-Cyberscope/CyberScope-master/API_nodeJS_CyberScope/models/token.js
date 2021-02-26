/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\models\token.js
 * Created Date: Friday, April 5th 2019, 11:56:08 am
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Request schema and validation for authentification
 * 
 * OpenSource
 */

const Joi = require('joi');
const mongoose = require('mongoose');

const Token = mongoose.model('Token', new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    token: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 1024
    }
}));

function validateToken(token) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        token: Joi.string().min(4).max(1024).required()
    };
    return Joi.validate(token, schema);
}

exports.Token = Token;
exports.validateToken = validateToken;