const j5 = require('johnny-five');
const board = new j5.Board();
const convert = require('./util/convert');
const io = require('socket.io')(8081);
const CONSTANTS = require('./constants');

const sensorConfig = {
  pin: 'A0',
  freq: 25
};

board.on('ready', function(){
  var thermistor = new j5.Sensor(sensorConfig);
  var currentTemp = 0;

  console.log('board ready');.

  thermistor.on('change', function onChange(err, thmVoltage) {
    if (err) {
      console.error(err);
    }

    currentTemp = convert.convertVoltToTemp(thmVoltage);
    console.log('Current TempF: ', currentTemp.tempF);

    io.sockets.emit(CONSTANTS.TEMP_UPDATE, currentTemp);
  });
});

io.on('connection', function(socket) {
  socket.emit(CONSTANTS.CONNECTED, {
    connected: true
  });
});
