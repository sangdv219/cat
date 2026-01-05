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

      ascii_name: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      sku: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: Sequelize.name,
        unique: true,
      },

      barcode: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },

      price: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },

      promotion_price: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true,
      },

      flashsale_start_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      flashsale_end_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      percent_discount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      is_available_quantity: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      total_promotion: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      total_sold: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      is_freeship: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      is_campaign: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      total_promotion_sold: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      quantity_promotion_sold: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      b2b_price: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true,
      },

      vat: {
        type: Sequelize.INTEGER(),
        allowNull: true,
      },

      weight: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true,
      },

      avg_rating: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: true,
      },

      total_rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      html_content: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      image_link: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      is_published: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      attributes: {
        type: Sequelize.JSONB,
        allowNull: true,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      evaluate: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      goods_id: {
        type: Sequelize.UUID,
        allowNull: false,
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

      parent_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'products',   // 👈 tên bảng mà nó tham chiếu tới
          key: 'id'         // 👈 khóa chính của bảng products
        }
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

      created_by: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
    });

    await queryInterface.addIndex('products', ['brand_id'], {
      name: 'idx_products_brand_id',
    });
    await queryInterface.addIndex('products', ['category_id'], {
      name: 'idx_products_category_id',
    });
    await queryInterface.addIndex('products', ['goods_id'], {
      name: 'idx_products_goods_id',
    });
    await queryInterface.addIndex('products', ['name'], {
      unique: true,
      name: 'idx_products_name',
    });
    await queryInterface.addIndex('products', ['barcode'], {
      name: 'idx_products_barcode',
    });
    await queryInterface.addIndex('products', ['sku'], {
      name: 'idx_products_sku',
    });

    await queryInterface.sequelize.query(`
      CREATE INDEX idx_products_attributes_gin
      ON products
      USING GIN (attributes jsonb_path_ops);
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};
