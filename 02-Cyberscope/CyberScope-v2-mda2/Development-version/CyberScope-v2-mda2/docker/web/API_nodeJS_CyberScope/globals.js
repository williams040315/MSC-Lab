/*
 * Filename: c:\Users\Natasha\Desktop\auth-cyberScope\globals.js
 * Created Date: Friday, April 12th 2019, 4:57:56 pm
 * Author: Pierre-Louis CRESCITZ
 * Author email: pierre-louis.crescitz@epitech.eu
 * Description: Globals variables for CyberScope
 * 
 * OpenSource
 */

//IP Node-red
//exports.nodeRedIP = "http://172.27.0.183:1880"; //miss Marple
//exports.nodeRedIP = "http://127.0.0.1:1880"; // localhost
exports.nodeRedIP = "http://node-red:1880"; // docker
exports.nodeRedToken = "Basic YWRtaW46Y2VsZWdhbnM";

exports.nodeRedOlympus = "/test-olympus";
exports.nodeRedLumen = "/test-lumen"; // X-CITE
exports.nodeRedPriorMotionStage = "/test-prior";
exports.nodeRedCoolLed = "/test-coolled";
exports.nodeRedAndorMosaic = "/tmp";
exports.nodeRedAutoFocus = "/test-olympus"

exports.nodeRedRunProtocol = "/run-protocol";

exports.enableSlackNotifications = true;

exports.nodeRedIpCamera = "http://172.27.0.183:5000/video_feed";

const { Equipement } = require('./models/equipement');

exports.getMicroscopeNameFromUserEmail = async function (user_email) {
    let checkStuff = await Equipement.findOne({ current_user: user_email });
    if (!checkStuff) {
        return res.status(400).send({ error: "You are not currently using a microscope." });
    }
    return ({ microscope: checkStuff.equipement_name });
}

