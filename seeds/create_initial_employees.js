/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> } 
*/
const bcrypt = require('bcrypt');
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('employees').del()
  await knex('employees').insert([
    { id: 1, name: 'Lúcio', email: 'lucio@lucio.com', password: bcrypt.hashSync('lucio', 10), is_admin: true },
    { id: 2, name: 'Lemos', email: 'lemos@lemos.com', password: bcrypt.hashSync('lemos', 10), is_admin: false },
    { id: 3, name: 'Nathan', email: 'nathan@nathan.com', password: bcrypt.hashSync('nathan', 10), is_admin: true },
    { id: 4, name: 'Silvana', email: 'silvana@silvana.com', password: bcrypt.hashSync('silvana', 10), is_admin: false }
  ]);
};
