const Queue = require('bull');
import { redisConfig } from "../bull.config";

export const OrderQueue = new Queue('order-queue', redisConfig)