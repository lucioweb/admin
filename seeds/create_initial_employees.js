/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> } 
*/
const bcrypt = require('bcrypt');
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('employees').del()
  await knex('employees').insert([
    { id: 1, name: 'Lúcio', email: 'lucio.j7@lucio.com', password: bcrypt.hashSync('123456', 10), is_admin: true },
    { id: 2, name: 'Lemos', email: 'lemos@lucio.com', password: bcrypt.hashSync('654321', 10), is_admin: false },
    { id: 3, name: 'Lúcio', email: 'flavio@lucio.com', password: bcrypt.hashSync('098765', 10), is_admin: true },
    { id: 4, name: 'Lúcio Flávio', email: 'luciolemos@lucio.com', password: bcrypt.hashSync('543210', 10), is_admin: false }
  ]);
};
