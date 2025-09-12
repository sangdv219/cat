'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stock_unit', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV,
        allowNull: false,
        primaryKey: true
      },

      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products',   // 👈 tên bảng mà nó tham chiếu tới
          key: 'id'         // 👈 khóa chính của bảng stock_unit
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      name: {
        type: Sequelize.STRING(500),
        allowNull: false,
        defaultValue: Sequelize.name
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
    await queryInterface.addIndex('stock_unit', ['name'], {
      unique: true,
      name: 'users_name',
      include: ['is_public']
    });
    await queryInterface.addIndex('stock_unit', ['product_id'], {
      unique: true,
      name: 'idx_stock_unit_product_id',
      include: ['is_public']
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('stock_unit');
  }
};
