'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: Sequelize.name
      },

      sku: {
        type: Sequelize.STRING(100),
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

     await queryInterface.addIndex('products', ['name'], {
      unique: true,
      name: 'idx_products_name',
      include: ['is_public', 'price', 'evaluate', 'is_public', 'promotion_price', 'sku', 'created_at', 'updated_at', 'created_by', 'created_by']
    });
     await queryInterface.addIndex('products', ['brand_id'], {
      name: 'idx_products_brand_id',
      include: ['is_public', 'price', 'evaluate', 'is_public', 'promotion_price', 'sku', 'name', 'created_at', 'updated_at', 'created_by', 'created_by']
    });
     await queryInterface.addIndex('products', ['category_id'], {
      name: 'idx_products_category_id',
      include: ['is_public', 'price', 'evaluate', 'is_public', 'promotion_price', 'sku', 'name', 'created_at', 'updated_at', 'created_by', 'created_by']
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};
