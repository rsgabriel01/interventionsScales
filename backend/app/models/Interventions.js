'use strict';

module.exports = (sequelize, DataTypes) => {
  const Interventions = sequelize.define('Interventions', {
    userId: DataTypes.BIGINT,
    scaleId: DataTypes.BIGINT,
    date_time_intervention: DataTypes.DATE,
    counttime_milliseconds: DataTypes.BIGINT,
    observation: DataTypes.STRING
  }, 
  {
    timestamps: false
  });
  Interventions.associate = (models) => {
    Interventions.belongsTo(models.Users, {foreignKey: 'id'});
    Interventions.belongsTo(models.Scales, {foreignKey: 'id'});
  };

  return Interventions;
};