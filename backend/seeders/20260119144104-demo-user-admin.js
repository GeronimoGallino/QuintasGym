'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    // 1. Encriptamos la contraseña "gero123"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('gero123', salt);

    // 2. Insertamos el usuario
    await queryInterface.bulkInsert('usuarios', [{
      username: 'gero',
      password: hashedPassword, // Guardamos la encriptada
      rol: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};