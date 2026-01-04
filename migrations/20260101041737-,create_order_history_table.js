/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_history', {
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
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
      order_total: {
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: false,
      },
      items_json: {
        type: Sequelize.DataTypes.JSONB,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    );
    await queryInterface.addConstraint('order_history', {
      fields: ['order_total'],
      type: 'check',
      where: {
        order_total: { [Sequelize.Op.gt]: 0 } // order_total > 0
      },
      name: 'check_order_total_positive' // Tên của constraint
    });


    await queryInterface.addIndex('order_history', {
      name: 'order_history_user_id_created_at_idx', // Tên index
      fields: [
        { name: 'user_id', order: 'ASC' },
        { name: 'created_at', order: 'DESC' }
      ],
      unique: false, // Nếu là true thì nó vừa là Index vừa là UNIQUE constraint
      using: 'BTREE', // Loại index, mặc định là BTREE
    });

    await queryInterface.addIndex('order_history', ['items_json'], {
      name: 'order_history_items_json_idx', // Tên index
      using: 'GIN', // Loại index, mặc định là BTREE
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_history');
  },
};
