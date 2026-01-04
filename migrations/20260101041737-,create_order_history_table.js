/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_history', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_UUID()'),
        allowNull: false,
        primaryKey: true,
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'orders', // bảng orders
          key: 'id',
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users', // bảng users
          key: 'id',
        },
        onUpdate: 'RESTRICT',
        onDelete: 'RESTRICT'
      },
      order_total: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
      },
      items_json: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_history');
  },
};
