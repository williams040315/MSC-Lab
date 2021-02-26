/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\routes\send-notifications.js
 * Created Date: Wednesday, April 10th 2019, 1:50:00 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Functions to send notifications and messages
 * 
 * OpenSource
 */

const express = require('express');
const router = express.Router();
const request = require('sync-request');

function sendMessageToSlack(message) {
  try {
      var resultat = request('POST', 'https://hooks.slack.com/services/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', {
          headers: {
              "Content-type": "application/json"
          },
          timeout: 500,
          json: {
            text: message
          },
        });
      }
      catch (error) {
        console.log(error);
      }
      //console.log(resultat.getBody());
      return ("done");
}

exports.sendMessageToSlack = sendMessageToSlack;