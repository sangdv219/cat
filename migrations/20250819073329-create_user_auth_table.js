'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_auth', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',   // 👈 tên bảng mà nó tham chiếu tới
          key: 'id'         // 👈 khóa chính của bảng users
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      email: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      provider: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      provider_user_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      last_login_at: {
        type: Sequelize.DATE,
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
        allowNull: true,
        defaultValue: Sequelize.NOW
      },
    });
    await queryInterface.addIndex('user_auth', ['user_id', 'email'], {
      unique: true,
      name: 'idx_user_auth_user_id_email'
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('user_auth')
  }
};
