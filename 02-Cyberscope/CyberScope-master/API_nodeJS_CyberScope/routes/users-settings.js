/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\routes\users-settings.js
 * Created Date: Wednesday, April 10th 2019, 12:26:21 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: All the route for users settings
 * 
 * OpenSource
 */

const bcrypt = require('bcrypt');
const _ = require('lodash');
const { Token, validateToken } = require('../models/token');
const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/update-password', async (req, res) => {
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
    const salt = await bcrypt.genSalt(10);
    var hashedPassword = await bcrypt.hash(req.body.password, salt);
    User.updateOne({
        "email": userToken.email
        }, {
            $set: {
                "name": userInfo.name,
                "email": userInfo.email,
                "password": hashedPassword
            }
        }, function(err, results){
            console.log(results);
             
        });
    return res.status(200).send('{ "message": "password successfully updated", "name": "' + userInfo.name + '" }');
});

module.exports = router;