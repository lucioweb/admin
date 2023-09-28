module.exports = {
    client: 'mysql2',

    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'pettopstore'
    },


    migrations: {
        directory: 'migrations',
        tableName: 'knex_migrations'
    },
    seeds: {
        directory: 'seeds'
    }

};




