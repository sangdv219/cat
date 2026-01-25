'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up (queryInterface, Sequelize) {
     await queryInterface.createTable('vouchers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_UUID()'),
        allowNull: false,
        primaryKey: true,
      },
      name: { 
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      code: { 
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      description: { 
        type: Sequelize.TEXT,
        allowNull: true,
      },
      voucher_type: { 
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      discount_value: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      min_order_value: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      max_discount_value: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      total_apply: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      max_apply_per_user: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      created_by: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      updated_by: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('vouchers');
  }
};
