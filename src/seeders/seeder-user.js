'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      firstName: 'John',
      lastName: 'Doe',
      email: 'admin@gmail.com',
      password: '$2b$10$9OrChnYlw99IZA14DpSj3ejW2XdH6uF5f6ew8Gdi.SRwZecAS5tsy',//1234
      isAdmin: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
