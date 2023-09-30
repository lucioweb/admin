/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> } 
*/
const bcrypt = require('bcrypt');
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('employees').del()
  await knex('employees').insert([
    { id: 1, name: 'funcionario1', email: 'func1@func1.com', password: bcrypt.hashSync('func1', 10), is_admin: true },
    { id: 2, name: 'funcionario2', email: 'func2@func2.com', password: bcrypt.hashSync('func2', 10), is_admin: false },
    { id: 3, name: 'funcionario3', email: 'func3@func3.com', password: bcrypt.hashSync('func3', 10), is_admin: true },
    { id: 4, name: 'funcionario4', email: 'func4@func4.com', password: bcrypt.hashSync('func4', 10), is_admin: false },
    { id: 5, name: 'funcionario5', email: 'func5@func5.com', password: bcrypt.hashSync('func5', 10), is_admin: true },
    { id: 6, name: 'funcionario6', email: 'func6@func6.com', password: bcrypt.hashSync('func6', 10), is_admin: false }
  ]);
};
