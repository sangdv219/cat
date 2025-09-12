'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
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

      price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },

      promotion_price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      },
      evaluate: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'categories',   // 👈 tên bảng mà nó tham chiếu tới
          key: 'id'         // 👈 khóa chính của bảng categories
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      brand_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'brands',   // 👈 tên bảng mà nó tham chiếu tới
          key: 'id'         // 👈 khóa chính của bảng brands
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
     await queryInterface.addIndex('products', ['name'], {
      unique: true,
      name: 'idx_products_name',
      include: ['is_public', 'price']
    });
     await queryInterface.addIndex('products', ['brand_id'], {
      name: 'idx_products_name_brand_id',
      include: ['is_public', 'price']
    });
     await queryInterface.addIndex('products', ['category_id'], {
      name: 'idx_products_name_category_id',
      include: ['is_public', 'price']
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};
