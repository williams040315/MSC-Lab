/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\models\user.js
 * Created Date: Thursday, April 4th 2019, 1:14:00 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Request schema and validation for registration
 * 
 * OpenSource
 */

const Joi = require('joi');
const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 1024
    }
}));

function validateUser(user) {
    const schema = {
        name: Joi.string().min(2).max(100).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(4).max(1024).required()
    };
    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;