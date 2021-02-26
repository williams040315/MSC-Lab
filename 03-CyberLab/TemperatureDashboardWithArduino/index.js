/*
 * Filename: c:\Users\Natasha\Desktop\arduino\index.js
 * Created Date: Thursday, July 30th 2019, 2:25:19 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Arduino temp
 * 
 * OpenSource
 */

const express = require('express');
const app = express();
var request = require('sync-request');
const path = require('path');


app.use(express.static(__dirname + '/public'));

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname + '/dashboard.html'));
});

function requestNodeRed(Url) {
    try {
       var resp = request('GET', Url, {
            timeout: 3000,
        });
    }
    catch (error) {
        var my_error = {};
        my_error.status = "Offline";
        return (my_error)
    }
    return (JSON.parse(resp.getBody('utf8')));
}

app.get('/get-temperature', async (req, res) => {
    var resp = {};

    resp.missMarpleOutside = requestNodeRed("http://172.27.0.183:1880/arduino-temperature-outside");
    resp.missMarpleInside = requestNodeRed("http://172.27.0.183:1880/arduino-temperature-inside");
    resp.pcEvolver = requestNodeRed("http://172.27.0.29:1880/arduino-temperature");
    resp.room502 = requestNodeRed("http://172.27.1.58:1880/arduino-temperature");

    return res.status(200).send(resp);
});


const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0");
console.log(`Listening on port ${port}...`);