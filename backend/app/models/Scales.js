'use strict';

module.exports = (sequelize, DataTypes) => {
  const Scales = sequelize.define('Scales', {
    description: DataTypes.STRING
  }, 
  {
    timestamps: false
  });
  Scales.associate = function(models) {
    Scales.hasMany(models.Interventions, {foreignKey: 'scaleId'});
  };
  return Scales;
};