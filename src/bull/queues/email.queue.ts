const Queue = require('bull');
import { redisConfig } from "../bull.config";

export const EmailQueue = new Queue('email-queue', redisConfig)