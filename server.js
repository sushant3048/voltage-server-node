const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Store the connected clients
const clients = new Set();

let currentNumber = '';

// Handle receiving a new number from a client
function handleNewNumber(number) {
    currentNumber = number.toString();

    // Send the new number to all connected clients
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(currentNumber);
        }
    });
}

// WebSocket connection handling
wss.on('connection', ws => {
    clients.add(ws);

    // Send the current number to the newly connected client
    if (currentNumber !== '') {
        ws.send(currentNumber);
    }

    ws.on('message', message => {
        console.log(`Received message: ${message}`);
        handleNewNumber(message);
    });

    ws.on('close', () => {
        clients.delete(ws);
    });
});

// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
