"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        "cities",
        {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
          },
          name: { type: Sequelize.STRING, allowNull: false },
          state_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "states",
              key: "id",
            },
          },
          latitude: { type: Sequelize.FLOAT, allowNull: false },
          longitude: { type: Sequelize.FLOAT, allowNull: false },
        },
        { transaction: t }
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable("cities", {
        transaction: t,
        cascade: true,
      });
    });
  },
};
