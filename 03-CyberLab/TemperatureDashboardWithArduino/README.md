# Arduino Temperature new device installation guide
1. Install the [Arduino IDE](https://www.arduino.cc/en/Main/Software)
2. Download the [MPC9808 library](https://github.com/adafruit/Adafruit_MCP9808_Library/archive/master.zip)
3. More info on the library [here](https://learn.adafruit.com/adafruit-mcp9808-precision-i2c-temperature-sensor-guide/arduino-code)
4. Take your Arduino UNO, pins to connect are : VDD to 3.2V, GND to GND, SCL to A5 and SDA to A4
5. In the Arduino IDE, Sketch > Include library > Add .ZIP library and then choose the .ZIP file you just download
6. Open the Arduino sketch in the Arduino IDE, the sketch is located in `CyberLab/sketch_MCP9808`
7. Upload the sketch to your Arduino
8. Open `dashboard.html` and add a new row to the table like, replace \$YOUR_ARDUINO_ID by an ID of your choice, same for \$YOUR_ARDUINO_LOCATION :   `<tr>
            <th scope="row">$YOUR_ID_ARDUINO</th>
            <td id="$YOUR_ID_ARDUINO-temp">Loading...</td>
            <td id="$YOUR_ID_ARDUINO-location">$YOUR_ARDUINO_LOCATION</td>
            <td id="$YOUR_ID_ARDUINO-status">Loading...</td>
            <td id="$YOUR_ID_ARDUINO-port">Loading...</td>
          </tr>`
9. Install [Node.js](https://nodejs.org/en/),  [Node-RED](https://nodered.org/docs/getting-started/local) and [node-red-node-serialport](https://flows.nodered.org/node/node-red-node-serialport)
10. Create your Node-RED flow by importing the flow located in `Node-RED_flow_for_each_arduino.txt`
11. You just have to configure the right port on the serial node.
12. Then open index.js and in the `get-temperature` route add a new call like : `resp.\$YOUR_ARDUINO_LOCATION  =  requestNodeRed("$NODE_RED_SERVER_IP/arduino-temperature");`
13. Go to `public/js/scriptTemperature.js`
14. In the request success callback add a new statement like : `if (data.room502.status == "OK") {
            $('#$YOUR_ARDUINO_ID-temp').html(data.$YOUR_ARDUINO_LOCATION.temp + '°C');
            $('#$YOUR_ARDUINO_ID-status').html('Online');
            $('#$YOUR_ARDUINO_ID-status').removeClass("text-danger");
              $('#$YOUR_ARDUINO_ID-status').addClass("text-success");
            $('#$YOUR_ARDUINO_ID-port').html(data.$YOUR_ARDUINO_LOCATION.port);
        }
        else {
            $('#$YOUR_ARDUINO_ID-temp').html('Unknown temperature');
            $('#$YOUR_ARDUINO_ID-status').html('Offline');
            $('#$YOUR_ARDUINO_ID-status').removeClass("text-success");
              $('#$YOUR_ARDUINO_ID-status').addClass("text-danger");
            $('#$YOUR_ARDUINO_ID-port').html('Disconnected');
        }`
15. Everything is setup, now just run `node index.js` 
16. Contact pierre-louis.crescitz@epitech.eu for any questions.
