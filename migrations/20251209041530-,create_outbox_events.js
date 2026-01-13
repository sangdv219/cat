'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('outbox_events', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_UUID()'),
        allowNull: false,
        primaryKey: true,
      },
      aggregate_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      aggregate_id: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      event_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      payload: {
        type: Sequelize.JSONB,
        allowNull: false, 
      },
      published: {
        type: Sequelize.BOOLEAN,
        allowNull: false, 
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('outbox_events');
  },
};
