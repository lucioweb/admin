/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('products', function (table) {
        table.increments('id');
        table.string('name');
        table.text('description');
        table.string('photo', 2000);
        table.decimal('price', 10, 2);
        table.integer('category_id').unsigned().references('categories.id');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('products');
};


