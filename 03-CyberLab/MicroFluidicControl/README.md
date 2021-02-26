Installation / start-up
----------------------------
1. Install the recommended version of nodeJS (https://nodejs.org/en/)
2. Install node-red (https://nodered.org/docs/getting-started/)
3. Install the node-red-node-serialport, node-red-dashboard, node-red-contrib-sequencer node: to do this, open a command terminal and move to the node-red folder; usually ./node-red and then run the following installation command: npm install [full path where the node is located] / node-red-contrib-sequencer. For example, if the node is in c: / desktop, you need to run the "npm install c: / desktop / node-red-contrib-sequencer" command (https://nodered.org/docs/creating-nodes/first-node section: Testing your node in Node-RED)
4. Connect the arduino that controls the micro-valves to your computer; launch the device manager to note the communication port of the arduino 
5. Start node-red with the node-red command; if it does not work check that node-red is set as environment variable on your system
6. Once node-red is launched, import a sample code in the flows folder (just drag and drop) from http://127.0.0.1:1880
7. Set up the serial-port node and fill in the communication port of step 4. Do the same for the sequencer node, signifying the times you want to clock the valves (see document in the docs file).
8. Deploy the server by clicking on 'deploy'
9. Go to the node-red dashboard page using the shortcut in the dashboard tab again from http://127.0.0.1:1880
10. Once the dashboard is open, start the sequencer by clicking on 'START'


Note
----
An output file will be created for each sequencing. It will be in the file where you started node-red

Airtable
--------
In this version, airTable is disabled. If you wish to activate it you have to remove the lines of comments n ° 78, and n ° 178 of the file sequencer.js. You will also need to create three airTable tables that have the following characteristics:

Table 'sequencer': "Name", "Duration (in minuts)", "key_rules"   ----> link to rules table, "key_output"   ----> link to output table, "Timestamp (start)", "Timestamp (stop)", "Attachments"

Table 'rules': "key_rules", "Name", "Enable", "Establishment time (in minuts)", "Establishment state", "Time (high state) (in minuts)", "Time (low state) (in minuts)", "State (start)", "State (stop)"

Table 'output': "key_output", "data"
                  
Then, you have to signify in the node sequencer the token of the API airTable and the token of the table


------------------------------------------------------------------------------------------------------------------------------------------
Williams BRETT | Lab513 | wllmsbrtt@gmail.com for any questions
