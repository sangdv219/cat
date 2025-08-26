'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('products', 'category_id', {
      type:Sequelize.STRING(500),
      allowNull: false 
    }) 
    await queryInterface.changeColumn('products', 'brand_id', {
      type:Sequelize.STRING(100),
      allowNull: false
    }) 
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('products', 'category_id', {
      type:Sequelize.STRING(500),
      allowNull: true 
    }) 
    await queryInterface.changeColumn('products', 'brand_id', {
      type:Sequelize.STRING(100),
      allowNull: true
    }) 
  }
};
