'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addConstraint('orders', {
    fields: ['user_id'],
    type: 'unique',
    name: 'unique_userId_orders' // tên constraint
   })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('unique_userId_orders')
  }
};
