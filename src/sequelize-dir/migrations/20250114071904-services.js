"use strict";

const { FLOAT } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        "services",
        {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          category_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "service_categories",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          garage_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: "garages", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          name: { type: Sequelize.STRING, allowNull: false },
          description: { type: Sequelize.TEXT, allowNull: true },
          price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
          duration: { type: Sequelize.INTEGER, allowNull: true },
          duration_unit: {
            type: Sequelize.ENUM("weeks", "days", "hours", "minutes"),
            allowNull: true,
          },
          status: {
            type: Sequelize.ENUM("available", "unavailable"),
            allowNull: false,
            defaultValue: "available",
          },
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
      await queryInterface.addIndex("services", ["category_id"], {
        transaction: t,
      });
      await queryInterface.addIndex("services", ["garage_id"], {
        transaction: t,
      });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable("services", {
        transaction: t,
        cascade: true,
      });
    });
  },
};
