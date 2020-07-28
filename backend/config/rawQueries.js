const Sequelize = require('sequelize')
const db = {}
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USERNAME, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
  }
});

// db.sequelize = sequelize
// db.Sequelize = Sequelize

module.exports = sequelize