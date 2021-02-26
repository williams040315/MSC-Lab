/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\views\views.js
 * Created Date: Thursday, April 4th 2019, 4:02:20 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: All the routes for the GUI
 * 
 * OpenSource
 */

const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/welcome', async (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/html/welcome.html'));
});

router.get('/dashboard', async (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/html/dashboard.html'));
});

router.get('/mda', async (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/html/mda.html'));
    //res.sendFile(path.join(__dirname + '/../public/html/protocole.html'));
});

router.get('/protocole', async (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/html/protocole.html'));
});

router.get('/user-settings', async (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/html/user-settings.html'));
});

router.get('/admin-panel', async (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/html/admin-panel.html'));
});

router.get('/credits', async (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/html/credits.html'));
});

router.get('/cyberscope-summurize', async (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/html/cyberscope-summurize.html'));
});

module.exports = router;