'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('brands', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
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
    await queryInterface.addIndex('brands', ['name'], {
      unique: true,
      name: 'idx_brands_name',
      include: ['is_public', 'image', 'created_at', 'updated_at', 'created_by', 'created_by']
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('brands');
  }
};
