const { DataTypes } = require('sequelize');
const query = require('../config/db');
const Concesionaria = require('./Concesionaria');

const Vehiculo = query.define('Vehiculo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patente: DataTypes.STRING,
  modelo: DataTypes.STRING,
  concesionariaId: DataTypes.INTEGER,
  activo: DataTypes.BOOLEAN
}, { timestamps: false });

Vehiculo.belongsTo(Concesionaria, { foreignKey: 'concesionariaId' });

module.exports = Vehiculo;
