// var createError = require('http-errors');
var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

var deviceRouter = require('./routes/device');
var usersRouter = require('./routes/users');
var sensorRouter = require('./routes/sensor');
var connectionRouter = require('./routes/connection');
var ownsRouter = require('./routes/ownership');

const pool = require('./server/db');
var app = express();
const PORT = process.env.PORT || 3001;


//change for deployment
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  })
);


app.get('/test',async (req, res) => {
  try{
    const device = await pool.query('SELECT * FROM device;');
    console.log(device.rows);
    res.json(device.rows);
  }catch (e) {
    console.log(e.message);
  }
});


app.use('/device', deviceRouter);
app.use('/users', usersRouter);
app.use('/sensors', sensorRouter);
app.use('/connections', connectionRouter);
app.use('/owns', ownsRouter);



// app.listen(PORT, () => {
//   console.log(`Server Listening on ${PORT}`)
// });



module.exports = app;
