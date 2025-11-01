'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addConstraint('order_items', {
    fields: ['product_id'],
    type: 'unique',
    name: 'unique_product' // tên constraint
   })
   await queryInterface.addConstraint('order_items', {
    fields: ['order_id'],
    type: 'unique',
    name: 'unique_order' // tên constraint
   })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('order_items', 'unique_product')
  }
};
