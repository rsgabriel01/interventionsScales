"use strict";

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable("Scales", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      description: {
        allowNull: false,
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'Scales',
      timestamps: false
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable("Scales");
  }
};
