'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_UUID()'),
        allowNull: false,
        primaryKey: true,
      },
      order_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      // user_id: {
      //   type: Sequelize.UUID,
      //   allowNull: false,
      //   references: {
      //     model: 'users', // bảng users
      //     key: 'id',
      //   },
      //   onUpdate: 'CASCADE',
      //   onDelete: 'CASCADE'
      // },
      subtotal: {
        type: Sequelize.DECIMAL(18,2),
        allowNull: true,
      },
      discount_amount: {
        type: Sequelize.DECIMAL(18,2),
        allowNull: true,
      },
      shipping_fee: {
        type: Sequelize.DECIMAL(18,2),
        allowNull: true,
      },
      total_amount: {
        type: Sequelize.DECIMAL(18,2),
        allowNull: true,
      },
      shipping_address: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'CONFIRM', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      payment_method: {
        allowNull: false,
        type: Sequelize.ENUM('CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER', 'CASH_ON_DELIVERY'),
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  },
};
