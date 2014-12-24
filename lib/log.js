'use strict';

var winston = require('winston');

var consoleOptions = {
  level: 'info',
  silent: false,
  colorize: true,
  timestamp: true,
  json: false,
  stringify: false
};

var fileOptions = {
  level: 'info',
  silent: false,
  colorize: false,
  timestamp: true,
  filename: process.env.LOG_FILE_NAME,
  maxsize: 10485760,
  maxFiles: 10,
  json: true
};

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, consoleOptions);
winston.add(winston.transports.File, fileOptions);