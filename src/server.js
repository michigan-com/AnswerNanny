'use strict';
import app from './app';
import winston from 'winston';
import mongoose from 'mongoose';
import { db } from '../config';
import twitter from './twitter';
import { connect, disconnect } from './db';

mongoose.connection.on('error', winston.error);

connect(db).then(function() {
  twitter.streamTweets();
}).catch(function(err) {
  throw new Error(err);
});

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

winston.info(`[SERVER] Environment: ${app.get('env')}`);
var server = app.listen(port, '0.0.0.0', function(err) {
  if (err) throw new Error(err);

  let host = this.address();
  winston.info(`[SERVER] Started on ${host.address}:${host.port}`);
});

server.on('close', function() {
  winston.info("[SERVER] Closed nodejs application ...");
  disconnect();
});

process.on('SIGTERM', function () {
  server.close();
});

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

module.exports = server;
