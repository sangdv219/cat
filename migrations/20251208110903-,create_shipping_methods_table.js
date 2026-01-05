'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('shipping_methods', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_UUID()'),
        allowNull: false,
        primaryKey: true,
      },
      name: { // GHTK - Tiêu chuẩn
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      code: { // ghtk_standard
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      min_free_shipping_amount: { //free ship from 300k
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },
      base_cost: { // 30k, 50k
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },
      cost_per_kg: { // 10k/kg
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },
      area: { // urban, suburban, rural
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      max_weight: { // 5kg, 10kg
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },
      tracking_url_template: { // https://shipping.com/track/{tracking_number}
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      estimated_days: { // 3-5 days
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('shipping_methods');
  }
};
