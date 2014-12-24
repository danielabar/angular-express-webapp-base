'use strict';

var winston = require('winston');

var consoleOptions = function(label) {
  return {
    level: 'info',
    silent: false,
    colorize: true,
    label: label,
    timestamp: true,
    json: false,
    stringify: false
  };
};

var fileOptions = function(filename) {
  return {
    level: 'info',
    silent: false,
    colorize: false,
    timestamp: true,
    filename: filename,
    maxsize: 10485760,
    maxFiles: 10,
    json: true
  };
};

winston.loggers.add('app', {
  console: consoleOptions('app'),
  file: fileOptions(process.env.APP_LOG_FILE_NAME)
});

winston.loggers.add('db', {
  console: consoleOptions('db'),
  file: fileOptions(process.env.DB_LOG_FILE_NAME)
});

winston.loggers.add('resource', {
  console: consoleOptions('resource'),
  file: fileOptions(process.env.RESOURCE_LOG_FILE_NAME)
});
