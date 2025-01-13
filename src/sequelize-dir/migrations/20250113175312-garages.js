"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        "garages",
        {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          owner_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "users",
              key: "id",
            },
          },
          name: { type: Sequelize.STRING, allowNull: false },
          description: { type: Sequelize.TEXT, allowNull: true },
          contact_no: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: { is: /^[0-9]{10}$/ },
          },
          email: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: { isEmail: true },
          },
          address: { type: Sequelize.TEXT, allowNull: false },
          city_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: "cities", key: "id" },
          },
          pincode: {
            type: Sequelize.STRING(6),
            allowNull: false,
            validate: { len: [6, 6] },
          },
          start_time: { type: Sequelize.TIME, allowNull: false },
          end_time: { type: Sequelize.TIME, allowNull: false },
          status: {
            type: Sequelize.ENUM("active", "inactive"),
            allowNull: false,
            defaultValue: "active",
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
      await queryInterface.addIndex("garages", ["city_id"], { transaction: t });
      await queryInterface.addIndex("garages", ["owner_id"], {
        transaction: t,
      });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable("garages", {
        transaction: t,
        cascade: true,
      });
    });
  },
};
