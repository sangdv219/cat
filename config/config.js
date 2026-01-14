require('dotenv').config();

const schemaConfig = require(__dirname + '/schema.js');

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    schema: schemaConfig.name,
    migrationStorageTableSchema: schemaConfig.name,
    seederStorage: 'sequelize',
  },
  staging: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    schema: schemaConfig.name,
    migrationStorageTableSchema: schemaConfig.name,
    seederStorage: 'sequelize',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    schema: schemaConfig.name,
    migrationStorageTableSchema: schemaConfig.name,
    seederStorage: 'sequelize',
  },
};
