const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Cliente = require('./Cliente'); 
const { DateTime } = require('luxon'); 

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
        model: Cliente,
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
    type: DataTypes.DATEONLY, 
    allowNull: false
  },
  fecha_fin_cobertura: {
    type: DataTypes.DATEONLY, 
    allowNull: false
  },

  fecha_pago: {
    type: DataTypes.DATE,
    
    get() {
      const rawValue = this.getDataValue('fecha_pago');
      
      if (!rawValue) return null;

      if (typeof rawValue === 'string') {
      
        return rawValue.split('.')[0].replace('T', ' '); 
      }

      return DateTime.fromJSDate(rawValue).toFormat('yyyy-MM-dd HH:mm:ss');
    }
  }

}, {
  tableName: 'pagos',
  timestamps: true, 
  createdAt: 'fecha_pago', // Sequelize sigue sabiendo que este es el campo de creación
  updatedAt: false         
});

Pago.belongsTo(Cliente, { foreignKey: 'cliente_id' });
Cliente.hasMany(Pago, { foreignKey: 'cliente_id' });

module.exports = Pago;