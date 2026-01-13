'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_UUID()'),
        allowNull: false,
        primaryKey: true,
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },
      original_price: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },
      promotion_price: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      discount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },
      note: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      vat: {
        type: Sequelize.INTEGER(),
        allowNull: true,
      },
      tax_code: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      created_by: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_items');
  },
};
