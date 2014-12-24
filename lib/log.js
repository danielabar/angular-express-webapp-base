'use strict';

var winston = require('winston');

winston.loggers.add('app', {
  console: {
    level: 'info',
    silent: false,
    colorize: true,
    label: 'app',
    timestamp: true,
    json: false,
    stringify: false
  },
  file: {
    level: 'info',
    silent: false,
    colorize: false,
    timestamp: true,
    filename: process.env.APP_LOG_FILE_NAME,
    maxsize: 10485760,
    maxFiles: 10,
    json: true
  }
});

winston.loggers.add('db', {
  console: {
    level: 'info',
    silent: false,
    colorize: true,
    label: 'db',
    timestamp: true,
    json: false,
    stringify: false
  },
  file: {
    level: 'info',
    silent: false,
    colorize: false,
    timestamp: true,
    filename: process.env.DB_LOG_FILE_NAME,
    maxsize: 10485760,
    maxFiles: 10,
    json: true
  }
});

winston.loggers.add('resource', {
  console: {
    level: 'info',
    silent: false,
    colorize: true,
    label: 'resource',
    timestamp: true,
    json: false,
    stringify: false
  },
  file: {
    level: 'info',
    silent: false,
    colorize: false,
    timestamp: true,
    filename: process.env.RESOURCE_LOG_FILE_NAME,
    maxsize: 10485760,
    maxFiles: 10,
    json: true
  }
});
