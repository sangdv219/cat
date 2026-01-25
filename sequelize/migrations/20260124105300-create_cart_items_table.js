'use strict';

const { type } = require('os');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cart_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      sku_id: {
        type: Sequelize.JSONB(),
        allowNull: true,
      },

      quanlity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      price_snapshot:{
        type: Sequelize.DECIMAL(18,2),
        allowNull: false,
      },

      metadata: {
        type: Sequelize.JSONB,
        allowNull: true 
      },
      
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
    await queryInterface.addConstraint('cart_items', {
      fields: ['quanlity'],
      type: 'check',
      where: {
        quanlity: {
          [Sequelize.Op.gt]: 0
        }
      },
      name: 'ck_cart_items_quanlity_gt_0'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cart_items');
  }
};
