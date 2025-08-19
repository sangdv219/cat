'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'email', {
      type:Sequelize.STRING(500),
      allowNull: false
    }) 
    await queryInterface.changeColumn('users', 'updated_at', {
      type:Sequelize.STRING(100),
      allowNull: true
    }) 
    await queryInterface.changeColumn('users', 'failed_login_attempts', {
      type:Sequelize.STRING(100),
      allowNull: true
    }) 
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'email', {
      type:Sequelize.STRING(500),
      allowNull: true 
    }) 
     await queryInterface.changeColumn('users', 'updated_at', {
      type:Sequelize.STRING(100),
      allowNull: false
    }) 
    await queryInterface.changeColumn('users', 'failed_login_attempts', {
      type:Sequelize.STRING(100),
      allowNull: false
    }) 
  }
};
