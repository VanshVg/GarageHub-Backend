"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        "users",
        {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          first_name: { type: Sequelize.STRING, allowNull: false },
          last_name: { type: Sequelize.STRING, allowNull: false },
          email: { type: Sequelize.STRING, allowNull: false },
          password: { type: Sequelize.TEXT },
          role: {
            type: Sequelize.ENUM("Customer", "Owner"),
            allowNull: true,
          },
          verified: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          reset_pass_token: { type: Sequelize.TEXT },
          last_login_date: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: Sequelize.NOW,
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
      await queryInterface.addIndex("users", {
        name: "unique_email_uk",
        fields: ["email"],
        unique: true,
        where: {
          deleted_at: null,
        },
        transaction: t,
      });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable("users", {
        transaction: t,
        cascade: true,
      });
    });
  },
};
