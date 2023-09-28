
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('categories').del()
  await knex('categories').insert([
    { name: 'Alimentos' },
    { name: 'Brinquedos' },
    { name: 'Cama e mesa' }
  ]);
};
