import winston from 'winston';
import mongoose from 'mongoose';

import { db } from '../config';
import { connect, disconnect } from './db';
import twitter from './twitter';

mongoose.connection.on('error', winston.error);

connect(db).then(function() {
  twitter.streamTweets();
}).catch(function(err) {
  throw new Error(err);
});

module.exports = {};

