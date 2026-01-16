'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryRunner, Sequelize) {
    // 1. CREAR TABLA CLIENTES
    await queryRunner.createTable('clientes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre_completo: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      dni: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      telefono: {
        type: Sequelize.STRING(20)
      },
      direccion: {
        type: Sequelize.STRING(255)
      },
      fecha_nacimiento: {
        type: Sequelize.DATEONLY
      },
      sexo: {
        type: Sequelize.STRING(10)
      },
      mail: {
        type: Sequelize.STRING(100)
      },
      fecha_vencimiento: {
        type: Sequelize.DATEONLY
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      fecha_registro: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.fn('NOW'), // SQL standard para 'ahora'
        allowNull: false
      }
    });

    // 2. CREAR TABLA PAGOS
    await queryRunner.createTable('pagos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cliente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'clientes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      monto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      metodo_pago: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      cantidad_meses: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      fecha_inicio_cobertura: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      fecha_fin_cobertura: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      fecha_pago: {
        type: 'TIMESTAMP', // Tu tipo personalizado
        allowNull: false
      }
    });
  },

  async down (queryRunner, Sequelize) {
    // EL ROLLBACK (ORDEN INVERSO: Primero borramos la hija, luego la madre)
    await queryRunner.dropTable('pagos');
    await queryRunner.dropTable('clientes');
  }
};