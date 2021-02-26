/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\index.js
 * Created Date: Thursday, April 4th 2019, 2:25:19 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Control API server, export all routes
 * 
 * OpenSource
 */

const config = require('config');
const Joi = require('joi');

/*
** const test_file = require("./config/config.json");
** console.log(test_file);
*/

//Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const users = require('./routes/users');
const auth = require('./routes/auth');
const info = require('./routes/infos');
const equipements = require('./routes/equipements');
//const node_red_info = require('./routes/node_red_com');
const users_settings = require('./routes/users-settings');
const send_notifications = require('./routes/send-notifications'); 
const update_devices = require('./routes/update-devices');
const admin_panel = require('./routes/admin');
const settings_channels = require('./routes/settings-channels');
const mosaic_masks = require('./routes/mosaic-masks');
const mda = require('./routes/mda');
const protocols = require('./routes/protocols');
const cyberscope_summurize = require('./routes/cyberscope-summurize');
const mda_modals = require('./routes/mda-modals');
const node_red_com = require('./routes/node-red-com');
const view = require('./views/views');
const express = require('express');
const app = express();

const helmet = require('helmet');
app.use(helmet());

//const globals = require('./globals');

//console.log(globals.nodeRedIP + " AND " + globals.nodeRedIP);

/*if (!config.get('PrivateKey')) {
    console.error('FATAL ERROR: PrivateKey is not defined.');
    process.exit(1);
}*/

//mongoose.connect('mongodb://localhost/cyber-scope', { useNewUrlParser: true } ) 
mongoose.connect('mongodb://db:27017/cyber-scope', { useNewUrlParser: true } ) 
.then(() => console.log('Now connected to MongoDB!'))
    .catch(err => console.error('Something went wrong', err));

mongoose.set('useCreateIndex', true);

app.use(express.json({limit: '50mb'}));

//send_notifications.sendMessageToSlack("OMG ITS WORKING!!");

app.use('/users/register', users);
app.use('/users/auth', auth);

app.use('/users/infos', info);

//app.use('/node-red', node_red_info);

app.use('/views', view);

app.use('/equipements', equipements);

app.use('/users-settings', users_settings);

app.use('/devices', update_devices);

app.use('/admin', admin_panel);

app.use('/settings-channels', settings_channels);

app.use('/mosaic-masks', mosaic_masks);

app.use('/mda', mda);

app.use('/protocols', protocols);

app.use('/cyberscope-summurize', cyberscope_summurize);

app.use('/mda-modals', mda_modals);

app.use('/node-red-com', node_red_com);

app.use(express.static(__dirname + '/public'));

app.get('/', async (req, res) => {
    res.redirect('/views/welcome');
});


/*async function t() {
const { Devices_html } = require('./models/devices_html');
let test = await Devices_html.findOne( { name: "Evolv512"} );

console.log(test.html)
}
t()*/

app.get('*', function(req, res){
    res.status(404).sendFile(__dirname + "/public/html/404.html");
  });

const port = process.env.PORT || 4000;
app.listen(port, "0.0.0.0");
console.log(`Listening on port ${port}...`);