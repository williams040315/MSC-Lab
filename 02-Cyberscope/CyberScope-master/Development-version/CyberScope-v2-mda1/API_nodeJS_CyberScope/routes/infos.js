/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\routes\infos.js
 * Created Date: Friday, April 5th 2019, 2:28:13 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Get all user information from a token
 * 
 * OpenSource
 */

 const express = require('express');
const { Token, validateToken } = require('../models/token');
const { User } = require('../models/user');
const router = express.Router();

router.post('/', async (req, res) => {
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

    return res.status(200).send('{ "email": "' + userInfo.email + '", "name": "' + userInfo.name + '" }');
});

module.exports = router;