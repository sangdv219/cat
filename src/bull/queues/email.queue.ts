import { redisConfig } from "../bull.config";

const Queue = require('bull');

export const EmailQueue = new Queue('email-queue', redisConfig)