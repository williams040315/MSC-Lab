/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\routes\auth.js
 * Created Date: Thursday, April 4th 2019, 2:37:22 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Authentification request, deliver a token if sucess
 * 
 * OpenSource
 */

const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user');
const { Token, validateToken } = require('../models/token');
const express = require('express');
const router = express.Router();
 
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
     //  Now find the user by their email address
     let user = await User.findOne({ email: req.body.email });
     if (!user) {
         return res.status(400).send('{ "error": "Incorrect email or password." }');
     }
  
     // Then validate the Credentials in MongoDB match
     // those provided in the request
     const validPassword = await bcrypt.compare(req.body.password, user.password);
     if (!validPassword) {
         return res.status(400).send('{ "error": "Incorrect email or password."}');
     }
     const token = jwt.sign({ _id: user._id }, /*config.get('PrivateKey')*/"PrivateKey"); // <== config.get take the private key in the env/config file. export PrivateKey=$YOUR_KEY
     
     let tokenInsert = await Token.findOne({ email: req.body.email });
     if (!tokenInsert) {
         //new entry
         tokenInsert = new Token({
            email: req.body.email,
            token: token
        });
        await tokenInsert.save();
     }
     else if (tokenInsert) {
        Token.updateOne({
            "email": req.body.email
            }, {
                $set: {
                    "token": token
                }
            }, function(err, results){
                console.log(results);
            });
     }

     res.send('{ "access_token": "' + token + '" }');
});

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(4).max(1024).required()
    };
 
    return Joi.validate(req, schema);
}
 
module.exports = router;