const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");

require("dotenv").config();
const { globSync } = require('glob');
const path = require('path');
const fileUpload = require("express-fileupload");
const { socketAuth } = require("./app/middleware/fetchuser.js");
const cron = require('node-cron');


const app = express();


var corsOptions = {
  origin: "*",
};


app.use(cors(corsOptions));

app.use(fileUpload());

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({ extended: true })
); /* bodyParser.urlencoded() is deprecated */



const modelsFiles = globSync('./app/routes/*.js');

for (const filePath of modelsFiles) {
  // console.log('filePath :>> ', path.resolve(filePath));
  require(path.resolve(filePath))(app);
}



const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
        origin: "*"
      }
});

cron.schedule('0 6 * * *', () => {
  console.log('daily scripts');
  leaseNotification.leaseExpirationNotificationScript();
})

io.use(socketAuth)
io.on("connection", (socket) => {
  console.log(`%s User Connected: ${socket.id}`, io.engine.clientsCount);
  io.on('connect', (data) => {
    console.log('new user connected :>> ');
  })
  socket.on('disconnect', (data)=> {
    console.log('User disconnected :>> ', data);
  })
});

// set port, listen for requests
const PORT = process.env.PORT || 3004;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

app.set("socket", io)


