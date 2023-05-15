const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const mqtt = require('mqtt');
require('dotenv').config()
// TODO: Encrypt
const mqttUri = process.env.MQTTURI;


// serverside 

app.prepare().then(() => {
    const server = express();
    const httpServer = createServer(server);
    const io = new Server(httpServer);

    // TODO: Encrypt
    const client = mqtt.connect(mqttUri, {
        username: process.env.MQTTUSERNAME,
        password: process.env.MQTTPASSWORD
    });
    client.on('connect', function () {
        client.subscribe('smart-grid/#');
        client.on('message', function (topic, message) {
            // console.log('mqtt: ' + topic.toString())
            switch(message.toString()) {
                case '1':
                    io.emit(topic.toString(), 'true')
                    break;
                case '0':
                    io.emit(topic.toString(), 'false')
                    break;
                default:
                    // io.emit(topic.toString(), message.toString())
            }
	    if(topic.toString() == 'smart-grid/temperature' || topic.toString() == 'smart-grid/humidity' || topic.toString() == 'smart-grid/DIST')
		io.emit(topic.toString(), message.toString())
        });
    });

    io.on('connection', (socket) => {
        // if(false) {
        //     socket.disconnect();
        // }

        console.log('Client connected');

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });

        socket.on('light', (lightState) => {
            console.log('Light state: ', lightState)
            //io.emit('light', lightState)
            client.publish('smart-grid/bulb', lightState.toString() == 'true' ? '1' : '0')
        })

        socket.on('led', (ledState) => {
            console.log('Led state: ', ledState)
            //io.emit('led', ledState)
            client.publish('smart-grid/led', ledState.toString() == 'true' ? '1' : '0')
        })

        socket.on('sound', (soundState) => {
            console.log('Sound state: ', soundState)
            //io.emit('sound', soundState)
            client.publish('smart-grid/sound', soundState.toString() == 'true' ? '1' : '0')
        })

        socket.on('fan', (fanState) => {
            console.log('Fan state: ', fanState)
            //io.emit('fan', fanState)
            client.publish('smart-grid/fan', fanState.toString() == 'true' ? '1' : '0')
        })
    });

    server.all('*', (req, res) => {
        return handle(req, res, parse(req.url, true));
    });

    const port = process.env.PORT || 3000;

    httpServer.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });

    /*
    export async function post(topic, message) {
        client.publish(topic, message);
    }
    */
    // export let temp = '0';
});
