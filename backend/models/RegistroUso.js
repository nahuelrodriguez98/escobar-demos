const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Empleado = require('./Empleado');
const Vehiculo = require('./Vehiculo');

const RegistroUso = sequelize.define('RegistroUso', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  empleadoId: DataTypes.INTEGER,
  vehiculoId: DataTypes.INTEGER,
  fechaSalida: DataTypes.DATE,
  fechaRetorno: DataTypes.DATE,
  kilometrajeSalida: DataTypes.INTEGER,
  kilometrajeRetorno: DataTypes.INTEGER,
  destino: DataTypes.STRING,
  combustibleCargado: DataTypes.FLOAT,
  observaciones: DataTypes.STRING
}, { timestamps: false });

RegistroUso.belongsTo(Empleado, { foreignKey: 'empleadoId' });
RegistroUso.belongsTo(Vehiculo, { foreignKey: 'vehiculoId' });

module.exports = RegistroUso;
