"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        "appointments",
        {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          garage_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "garages",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          customer_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "users",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          service_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "services",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          date: { type: Sequelize.DATE, allowNull: false },
          start_time: { type: Sequelize.TIME, allowNull: false },
          end_time: { type: Sequelize.TIME, allowNull: true },
          status: {
            type: Sequelize.ENUM(
              "pending",
              "confirmed",
              "completed",
              "cancelled"
            ),
            allowNull: false,
            defaultValue: "pending",
          },
          notes: { type: Sequelize.TEXT, allowNull: true },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          deleted_at: { type: Sequelize.DATE },
        },
        { transaction: t }
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable("appointments", {
        transaction: t,
        cascade: true,
      });
    });
  },
};
