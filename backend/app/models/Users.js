'use strict';

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    completeName: DataTypes.STRING,
    email: DataTypes.STRING,
    login: DataTypes.STRING,
    password: DataTypes.STRING
  }, 
  {
    timestamps: false
  });
  Users.associate = function(models) {
    Users.hasMany(models.Interventions, {foreignKey: 'userId'});
  };
  return Users;
};