/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\models\equipement.js
 * Created Date: Monday, April 8th 2019, 2:02:15 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Schema and validation for equipement info request
 * 
 * OpenSource
 */

const Joi = require('joi');
const mongoose = require('mongoose');

const Equipement = mongoose.model('Equipement', new mongoose.Schema({
    equipement_name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
        unique: true
    },
    begin_time: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
    },
    is_available: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
    },
    ip_address: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
    },
    current_user: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    }
}));

function validateEquipement(equipement) {
    const schema = {
        equipement_name: Joi.string().min(2).max(255).required().email(),
        begin_time: Joi.string().min(2).max(255).required(),
        is_available: Joi.string().min(2).max(255).required(),
        ip_address: Joi.string().min(2).max(255).required(),
        current_user: Joi.string().min(2).max(255).required()
    };
    return Joi.validate(equipement, schema);
}

exports.Equipement = Equipement;
exports.validateEquipement = validateEquipement;