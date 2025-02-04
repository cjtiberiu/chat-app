const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');


const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/uploads'));

// routes
const router = require('./routes');
app.use(router);

const server = http.createServer(app);
const socketServer = require('./socket');
socketServer(server);


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})