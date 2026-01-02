const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Empleado = sequelize.define('Empleado', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: DataTypes.STRING,
  usuario: DataTypes.STRING,
  contraseña: DataTypes.STRING,
  rol: DataTypes.STRING,
  azure_id: {type: DataTypes.STRING,
    allowNull:true
  }
}, { timestamps: false });

module.exports = Empleado;
