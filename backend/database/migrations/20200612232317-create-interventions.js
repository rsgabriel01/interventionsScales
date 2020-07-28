"use strict";

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable("Interventions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      userId: {
        allowNull: false,
        type: DataTypes.BIGINT,
        references: {         // user hasmany 1:n
          model: 'Users',
          key: 'id'
        }
      },
      scaleId: {
        allowNull: false,
        type: DataTypes.BIGINT,
        references: {         // scale hasmany  1:n
          model: 'Scales',
          key: 'id'
        }
      },
      date_time_intervention: {
        allowNull: false,
        type: DataTypes.DATE
      },
      counttime_milliseconds: {
        allowNull: false,
        type: DataTypes.BIGINT
      },
      observation: {
        allowNull: true,
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'Interventions',
      timestamps: false
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable("Interventions");
  }
};
