const { DataTypes } = require('query');
const query = require('../config/db');

const Concesionaria = query.define('Concesionaria', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: DataTypes.STRING,
  direccion: DataTypes.STRING
}, { timestamps: false });

module.exports = Concesionaria;
