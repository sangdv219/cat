'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true
    })
    await queryInterface.changeColumn('users', 'failed_login_attempts', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: false
    })
    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING,
      allowNull: true 
    })
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: false 
    })
    await queryInterface.changeColumn('users', 'failed_login_attempts', {
      type: Sequelize.INTEGER,
      allowNull: false 
    })
     await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING,
      allowNull: false 
    })
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
