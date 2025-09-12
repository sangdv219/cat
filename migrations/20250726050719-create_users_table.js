'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(500),
        allowNull: false,
        defaultValue: Sequelize.name
      },

      password_hash: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(500),
        allowNull: true,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: Sequelize.phone
      },
      gender: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: false,
      },
      is_root: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        require: true,
        allowNull: true,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      failed_login_attempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      last_failed_login_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      locked_until: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      }
    });
    await queryInterface.addIndex('users', ['name', 'phone'], {
      unique: true,
      name: 'users_name_phone'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
