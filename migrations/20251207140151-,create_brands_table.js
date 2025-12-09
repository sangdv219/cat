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

      ascii_name: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      banner_link: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      total_rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },

      avg_rating: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: true,
        defaultValue: 0.0,
      },

      is_app_visible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      image_link: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      is_public: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.addIndex('brands', ['ascii_name'], {
      unique: true,
      name: 'idx_brands_ascii_name',
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('brands');
  }
};
