'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('inventory', {
      fields: ['stock'],
      type: 'check',
      where: {
        stock: {
          [Sequelize.Op.gt]: 0
        }
      },
      name: 'ck_inventory_stock_gt_0'
    });
  },
};
