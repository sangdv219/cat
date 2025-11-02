"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSequelizeInstance = createSequelizeInstance;
const config_1 = require("@nestjs/config");
const postgres_1 = require("@sequelize/postgres");
const core_1 = require("@sequelize/core");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const configService = new config_1.ConfigService();
function createSequelizeInstance() {
    const sequelize = new core_1.Sequelize({
        dialect: postgres_1.PostgresDialect,
        database: configService.getOrThrow('DB_DATABASE'),
        user: configService.getOrThrow('DB_USER'),
        password: configService.getOrThrow('DB_PASSWORD'),
        host: configService.getOrThrow('DB_HOST') || 'localhost',
        port: parseInt(configService.getOrThrow('DB_PORT'), 10),
        clientMinMessages: 'notice',
    });
    sequelize.authenticate()
        .then(() => {
        console.log(`✅ Database ${configService.getOrThrow('DB_DATABASE')} connection established successfully.`);
    })
    .catch((err) => {
       console.error(`🛑 Unable to connect to the database: ${configService.getOrThrow('DB_DATABASE')}`, err);
    });
}
//# sourceMappingURL=connect.js.map