const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Cliente = require('./Cliente'); 

const Pago = sequelize.define('Pago', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: Cliente, // Esto establece la llave foránea
        key: 'id'
    }
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  metodo_pago: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  cantidad_meses: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_inicio_cobertura: {
    type: DataTypes.DATEONLY, // Solo fecha
    allowNull: false
  },
  fecha_fin_cobertura: {
    type: DataTypes.DATEONLY, // Solo fecha
    allowNull: false
  },
  // La fecha_pago real (timestamp) se mapea al createdAt
}, {
  tableName: 'pagos',
  timestamps: true, 
  createdAt: 'fecha_pago', // Sequelize usará 'fecha_pago' para guardar cuándo se creó
  updatedAt: false         // No necesitamos saber cuándo se editó un pago
});

Pago.belongsTo(Cliente, { foreignKey: 'cliente_id' });
Cliente.hasMany(Pago, { foreignKey: 'cliente_id' });

module.exports = Pago;