
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('categories').del()
  await knex('categories').insert([
    { name: 'Petiscos' },
    { name: 'Coleiras' },
    { name: 'Ração animal' },
    { name: 'Medicamentos' },
    { name: 'Brinquedos' },
    { name: 'Cama e mesa' },
    { name: 'Outras categorias' }
  ]);
};
