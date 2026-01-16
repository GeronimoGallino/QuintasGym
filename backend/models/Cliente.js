const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Cliente = sequelize.define('Cliente', {
  // No hace falta definir ID, Sequelize lo hace solo, pero como ya creamos la tabla manual:
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_completo: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  dni: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  telefono: {
    type: DataTypes.STRING(20)
  },
  direccion: {
    type: DataTypes.STRING(255)
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY
  },
  sexo: {
    type: DataTypes.STRING(10)
  },
  mail: {
    type: DataTypes.STRING(100)
  },
  fecha_vencimiento: {
    type: DataTypes.DATEONLY
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  fecha_registro: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  tableName: 'clientes', // Para que coincida con la tabla que creaste en SQL
  timestamps: false
});

module.exports = Cliente;