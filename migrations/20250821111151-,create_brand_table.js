'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('brands', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(500),
        allowNull: false,
        defaultValue: Sequelize.name
      },

      image: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      is_public: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
      },

    });
    await queryInterface.addIndex('brands', ['name'], {
      unique: true,
      name: 'idx_brands_name',
      include: ['is_public', 'image']
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('brands');
  }
};
