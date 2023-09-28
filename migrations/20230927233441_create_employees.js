/**
     * @param { import("knex").Knex } knex
     * @returns { Promise<void> }
     */
exports.up = function (knex) {
    return knex.schema.createTable('employees', function (table) {
        table.increments('id');
        table.string('name');
        table.string('email');
        table.string('password');
        table.boolean('is_admin');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('employees');
};
