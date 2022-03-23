const Sequelize = require('sequelize');
const config = new Sequelize("task-manager", "bobby", "password", {dialect: 'mysql'});

module.exports = config;