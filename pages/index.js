import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { io } from 'socket.io-client';
import styles from '../styles.module.css';

const Home = () => {
    const [socket, setSocket] = useState()
    const [light, setLight] = useState(false)
    const [led, setLed] = useState(false)
    const [fan, setFan] = useState(false)
    const [sound, setSound] = useState(false)
    const [lidar, setLidar] = useState('0 (default)')
    const [humidity, setHumidity] = useState('10 (default)');
    const [temperature, setTemperature] = useState('10 (default)');
    
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        const clientSocket = io();

        clientSocket.on('connect', () => {
            console.log('Connected to the server');
        });

        clientSocket.on('disconnect', () => {
            console.log('Disconnected from the server');
        });

        clientSocket.on('smart-grid/light', (newLight) => {
            console.log('new light')
            setLight(newLight.toString() == 'true' ? true : false)
        })

        clientSocket.on('smart-grid/fan', (newFan) => {
            console.log('new fan')
            setFan(newFan.toString() == 'true' ? true : false)
        })

        clientSocket.on('smart-grid/led', (newLed) => {
            console.log('new led')
            setLed(newLed.toString() == 'true' ? true : false)
        })

	clientSocket.on('smart-grid/DIST', (newLidar) => {
            console.log('new lidar')
            setLidar(newLidar)
        })

        clientSocket.on('smart-grid/humidity', (newHumidity) => {
            console.log('new humidity')
            setHumidity(newHumidity)
        })

        clientSocket.on('smart-grid/temperature', (newTemperature) => {
            console.log('new temperature')
            setTemperature(newTemperature)
        })

        clientSocket.on('smart-grid/lidar', (newLidar) => {
            console.log('new lidar')
            setLidar(newLidar)
        })

        clientSocket.on('smart-grid/sound', (newSound) => {
            console.log('new sound')
            setSound(newSound.toString() == 'true' ? true : false)
        })

        setSocket(clientSocket)

        // Clean up the effect
        return () => {
            clientSocket.disconnect();
        };
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        socket.emit('humidity', inputText)
    }

    function handleInputChange(event) {
        setInputText(event.target.value);
    }

    const publishLight = () => {
        console.log('publishing message...' + !light)
        socket.emit('light', !light)
        setLight(!light)
    }

    const publishFan = () => {
        console.log('publishing message...')
        socket.emit('fan', !fan)
        setFan(!fan)
    }

    const publishLed = () => {
        console.log('publishing message...')
        socket.emit('led', !led)
        setLed(!led)
    }

    const publishSound = () => {
        console.log('publishing message...')
        socket.emit('sound', !sound)
        setSound(!sound)
    }

    let prompt = require('password-prompt')
    let password = prompt('password: ')

    return (
        <>
            <Head>
                <title>Smartgrid App</title>
            </Head>

            <div className={styles.container}>
                <h1>Smartgrid Interface</h1>
                <div id="desc">
                    <p>Automatically updating temperature, humidity, and lidar distance sensors, as well as a controllable LED light, incandescent bulb, fan, and speaker attached to the module.</p>
                    <p>Here's some info:</p>
	            </div>
               <hr />
                
            <div className="flex1">
		    <div className="boxstyle">
			<p>LED State: {led ? 'on' : 'off'}</p>
			<button onClick={publishLed}> Turn led {led ? 'off' : 'on'}</button>
		    </div>

                    <div className="boxstyle">
                        <p>Light State: {light ? 'on' : 'off'}</p>
                        <button onClick={publishLight}>Turn light {light ? 'off' : 'on'}</button>
                    </div>

                    <div className="boxstyle">
                        <p>Fan State: {fan ? 'on' : 'off'}</p>
                        <button onClick={publishFan}>Turn fan {fan ? 'off' : 'on'}</button>
                    </div>

		    <div className="boxstyle">
                        <p>Sound State: {sound ? 'on' : 'off'}</p>
                        <button onClick={publishSound}>Turn sound {sound ? 'off' : 'on'}</button>
                    </div>
                    
                    <div className="boxstyle">
                        <form onSubmit={handleSubmit}>
                            <p id="humidity">Humidity: {humidity}%</p>
                            <p id="temperature">Temperature: {temperature}°F</p>
			    <p id="lidar">Distance: {lidar} cm</p>
                            {/* <input placeholder='Humidity' type="text" id="input-text" value={inputText} onChange={handleInputChange} />
                            <button type="submit">Submit</button> */}
                        </form>
                    </div>

                    {/* <div className="boxstyle">
                        <form onSubmit={handleSubmit}>
                            <p id="lidar">Distance: {lidar}</p>
                        </form>
                    </div> */}
                </div>
            </div>
        </>
    );
};

export default Home;
