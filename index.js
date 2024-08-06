import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const clients = {};

app.get('/', (req, res) => {
  res.send('hello world');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});

wss.on("connection", (ws) => {
  const userId = uuidv4().split('-')[0];
  clients[userId] = ws;

  console.log(`Received a new connection: ${userId}`);

  ws.on("message", (message) => {
    console.log(`Received message ${message} from user ${userId}`);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log(`${userId} disconnected`);
    delete clients[userId];
  });
});