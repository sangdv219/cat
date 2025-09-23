'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('audit_logs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_UUID()'),
        allowNull: false,
        primaryKey: true,
      },
      table_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      record_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      action: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      old_data: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      new_data: {
        allowNull: true,
        type: Sequelize.JSONB,
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
    await queryInterface.sequelize.query(`
      CREATE INDEX idx_audit_log_recent_created_at
      ON audit_logs (created_at DESC)
      INCLUDE (table_name, record_id, action, old_data, new_data, created_at, updated_at, created_by, updated_by)
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('audit_logs');
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS idx_audit_log_recent_created_at;`);
  }
};
