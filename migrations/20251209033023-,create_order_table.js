module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_UUID()'),
        allowNull: false,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users', // bảng users
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      subtotal: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true,
      },
      discount_amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true,
      },
      provisional_amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true,
      },
      shipping_amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true,
      },
      total_amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true,
      },
      payment_method_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'payment_methods',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      shipping_method_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'shipping_methods',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      shipping_address: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      warehouse_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'warehouses',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      note: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      channel: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      voucher_applied: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      extra_data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      cancel_reason_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'cancel_reasons',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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

    await queryInterface.sequelize.query(`
          CREATE INDEX idx_orders_extra_data_gin
          ON orders
          USING GIN (extra_data jsonb_path_ops);
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  },
};
