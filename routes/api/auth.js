var express = require('express');
var router = express.Router();

const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig);

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const segredoJWT = 'frase segredo para critografia do jwt';

// employee sign_in
router.post('/employee/sign_in', async (req, res) => {
    // busca employee no banco com esse email
    const employee = await knex.table('employees').where({ email: req.body.email }).first();

    // Caso o employee não exista ou sua senha criptografada seja diferente da armazenada no banco, retorna um erro:
    if (!employee || !bcrypt.compareSync(req.body.password, employee.password)) {
        return res.status(401).json({
            message: 'Funcionário não existe'
        });
    }

    // criação do conteúdo (payload) do token JWT com o employee encontrado e com senha correta
    const conteudoJWT = {
        employee: employee
    };

    // gera um token com o conteúdo (payload) e assinado com o segredoJWT. É atribuído uma expiração de 2 dias para o token.
    const token = jwt.sign(conteudoJWT, segredoJWT, { expiresIn: '2 days' });

    // o token é adicionado ao employee, que é retornado no JSON
    employee.token = token;
    return res.json({ employee });
});

// client sign_in
router.post('/client/sign_in', async (req, res) => {
    // busca client no banco com esse email
    const client = await knex.table('clients').where({ email: req.body.email }).first();

    // Caso o client não exista ou sua senha criptografada seja diferente da armazenada no banco, retorna um erro:
    if (!client || !bcrypt.compareSync(req.body.password, client.password)) {
        return res.status(401).json({
            message: 'Cliente não existe'
        });
    }

    // criação do conteúdo (payload) do token JWT com o employee encontrado e com senha correta
    const conteudoJWT = {
        client: client
    };

    // gera um token com o conteúdo (payload) e assinado com o segredoJWT. É atribuído uma expiração de 2 dias para o token.
    const token = jwt.sign(conteudoJWT, segredoJWT, { expiresIn: '2 days' });

    // o token é adicionado ao client, que é retornado no JSON
    client.token = token;
    return res.json({ client });
});

// client registration (from website)
router.post('/client/registration', async (req, res) => {
    // busca client no banco com esse email
    const existingClient = await knex.table('clients').where({ email: req.body.email }).first();

    // Se o client já existe, retorna um erro pois não pode cadastrar dois com o mesmo e-mail
    if (existingClient) {
        return res.status(401).json({
            message: 'Cliente já existe com esse e-mail'
        });
    }

    // constroi o objeto com os dados do novo client(incluindo a senha critograda com o bcrypt)
    let newClientData = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    };

    // insere o client no banco e recebe um array que deve conter só um elemento (o id do cliente inserido)
    let clientIDs = await knex.table('clients').insert(newClientData);

    // retorna uma mensagem de sucesso e o ID do client inserido no banco (primeiro elemento do array retornado pelo comando insert)
    return res.json({
        message: 'Cliente registrado com sucesso',
        clienteID: clientIDs[0]
    });
});

module.exports = router;