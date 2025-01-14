"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        "service_categories",
        {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          name: { type: Sequelize.STRING, allowNull: false, unique: true },
          label: { type: Sequelize.STRING, allowNull: false },
        },
        { transaction: t }
      );
      await queryInterface.addIndex("service_categories", ["name"], {
        transaction: t,
      });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable("service_categories", {
        transaction: t,
        cascade: true,
      });
    });
  },
};
