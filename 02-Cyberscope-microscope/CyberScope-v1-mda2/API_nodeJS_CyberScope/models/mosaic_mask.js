/*
 * Filename: c:\Users\Natasha\Desktop\cyber-scope\models\mosaic_mask.js
 * Created Date: Monday, May 20th 2019, 5:49:43 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Mosaic's masks model
 * 
 * OpenSource
 */

const Joi = require('joi');
const mongoose = require('mongoose');

const Mosaic_mask = mongoose.model('Mosaic_mask', new mongoose.Schema({
    author: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    mask_name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    b64_mask: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 265536
    }
}));

function validateMM(mask) {
    const schema = {
        author: Joi.string().min(2).max(100).required(),
        mask_name: Joi.string().min(2).max(100).required(),
        b64_mask: Joi.string().min(4).max(265536).required()
    };
    return Joi.validate(mask, schema);
}

exports.Mosaic_mask = Mosaic_mask;
exports.validate = validateMM;