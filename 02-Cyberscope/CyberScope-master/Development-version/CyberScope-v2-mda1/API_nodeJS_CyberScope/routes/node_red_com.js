/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\routes\node_red_com.js
 * Created Date: Friday, April 5th 2019, 2:55:22 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Communication with node-red API
 * 
 * OpenSource
 */

 const express = require('express');
const { Token, validateToken } = require('../models/token');
const { User } = require('../models/user');
const router = express.Router();
const request = require('sync-request');

const nodeRedIP = "http://172.27.0.24:1880";
const nodeRedToken = "Basic YWRtaW46Y2VsZWdhbnM";

router.get('/test', async (req, res) => {
    var resultat = request('POST', nodeRedIP + '/simple-test', {
        json: {
          action: "move:1,2,3"
        },
      });
      console.log(resultat.getBody());
      return res.status(200).send(resultat.getBody());
});

router.post('/arduino', async (req, res) => {
  var resp = request('POST', nodeRedIP + '/test-arduino', {
    headers: { 'Authorization': nodeRedToken },
    json: { microscope: "Miss Marple", action: req.body.action},
  });
  return res.status(200).send("OKOKOKK");
});

module.exports = router;