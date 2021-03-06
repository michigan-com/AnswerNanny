'use strict';

import mongoose from 'mongoose';
import debug from 'debug';

import { db } from '../config';

if (typeof db === 'undefined') {
  throw new Error("`db` key in config.js is required to connect to mongodb, ex: db: 'mongodb://localhost:27017/db'");
}

var logger = debug('AnswerNanny:db');

var Schema = mongoose.Schema;

const defaults = {
  server: {
    socketOptions: { keepAlive: 1 }
  }
};

function connect(dbString=db, options=defaults) {
  logger(`[DATABASE] Connceting to: ${dbString}...`);
  return new Promise(function(resolve, reject) {
    mongoose.connect(dbString, options, function(err) {
      if (err) reject(err);
      logger('[DATABASE] Successfully connected!');
      resolve(true);
    });
  });
}

function disconnect() {
  logger('[DATABASE] Disconnecting from mongo...')
  return new Promise(function(resolve, reject) {
    mongoose.disconnect(function(err) {
      if (err) reject(err);
      logger('[DATABASE] Disconnected from mongodb!');
      resolve(true);
    });
  });
}

var NannyAnswerSchema = new Schema({
  tweet: { type: Object },
  wolfram: { type: Object },
  response: { type: Object },
  created_at: { type: Date, default: Date.now }
});

module.exports = {
  NannyAnswer: mongoose.model('NannyAnswer', NannyAnswerSchema),
  connect,
  disconnect
};
