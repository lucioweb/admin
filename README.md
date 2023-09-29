## INTRODUÇÃO 
### Apresentação do sistema administrativo que será utilizado como base para a criação da loja virtual `PetTopStore`.
O projeto será modularizado, com plataformas e tecnologias diferentes para cada módulo da aplicação e que terá as seguintes funcionalidades:
* [PAINEL DE ADMINISTRAÇÃO](https://materialpublic.imd.ufrn.br/curso/disciplina/3/77/9): onde o administrador do sistema poderá gerenciar produtos e visualizar relatórios de vendas. Também contempla uma API de acesso seguro aos dados para os outros módulos.
* PDV: ponto de venda (loja física), onde o vendedor poderá cadastrar clientes e realizar vendas.
* LOJA VIRTUAL: um web site de vendas online onde os clientes poderão visualizar e adquirir os produtos da loja.

Tecnologias do módulo administrativo:
* `Node JS`+`Express` no back-end;
* `MySQL` como banco de dados;
* `knex JS` como biblioteca de acesso ao banco de dados;
* `bcrypt` como biblioteca para tratar a criptografia de senhas;
* `multe` como biblioteca de gerenciamento de uploads de arquivos no sistema
* `cookie-session` para quando o usuário estiver logado no sistema, um cookie seguro e criptografado será armazenado no seu navegador;
* `jsonwebtoken` como estratégia de autenticação na API.

O sistema administrativo conterá inicialmente as funcionalidades mais importantes, podendo ser escalado.

### 1ª PARTE - MIGRATIONS
  
#### 1 - CRIAÇÃO DA PASTA QUE ABRIGARÁ TODO O PROJETO
    $ mkdir pettopstore
#### 2 - ALTERNA PARA A PASTA DO PROJETO
    $ cd pettopstore
#### 3 - CRIA UMA APLICAÇÃO DE NOME `admin` UTILIZANDO O [GERADOR DE EXPRESS](https://expressjs.com/pt-br/starter/generator.html) (use a ferramenta geradora de aplicativos, express, para rapidamente criar uma estrutura básica de aplicativo).
O sistema administrativo da loja será a interface da aplicação onde os administradores da loja poderão acessar o cadastro de produtos e dados de vendas, assim como criar funcionários para a loja. Esse módulo irá contemplar também uma API que será utilizada pelos outros módulos.

    $ npx express-generator --view=ejs admin
    
O comando acima criará um aplicativo do Express com suporte a `ejs` chamado `admin` no diretório atualmente em funcionamento a saber, `pettopstore`, que retornará a seguinte estrutura:

    create : admin/ 
    create : admin/public/
    create : admin/public/javascripts/
    create : admin/public/images/
    create : admin/public/stylesheets/
    create : admin/public/stylesheets/style.css
    create : admin/routes/
    create : admin/routes/index.js
    create : admin/routes/users.js
    create : admin/views/
    create : admin/views/error.ejs
    create : admin/views/index.ejs
    create : admin/app.js
    create : admin/package.json
    create : admin/bin/
    create : admin/bin/www
#### 4 - ALTERNANDO PARA O DIRETÓRIO `admin` COM O COMANDO:
    $ cd admin
#### 5 - INSTALL DAS DEPENDÊNCIAS DO NODE:
    $ npm install
#### 6 - SUBINDO A APLICAÇÃO PARA O SERVIDOR: 
    $ DEBUG=admin:* npm start
##### Estrutura inicial do projeto gerado com o comando `$ npx express-generator`:
     ├── app.js
     ├── bin
     │   └── www
     ├── node_modules
     ├── package-lock.json
     ├── package.json
     ├── public
     │   ├── images
     │   ├── javascripts
     │   └── stylesheets
     │       └── style.css
     ├── routes
     │   ├── index.js
     │   └── users.js
     └── views
         ├── error.ejs
         └── index.ejs    


#### 7 - INSTALANDO AS DEMAIS BIBLIOTECAS DO PROJETO
##### AJV - Biblioteca de validação de schema JSON:     
    $ npm install ajv --save
##### AJV-FORMATS - Biblioteca de validação de formato de dados do schema JSON:   
    $ npm install ajv-formats --save
##### NODEMON - Biblioteca que verifica as alteração no código e executa o reload do servidor express:       
    $ npm install --save-dev nodemon
##### Script de inicialização do servidor Express no `package.json` com o `nodemon`:
    ...

    "scripts": {
      "dev": "nodemon app.js"      
     },

##### uuid - Biblioteca que gera `ids` universais e únicos:       
    $ npm install uuid --save
##### [Knex JS](https://knexjs.org/guide/#node-js) e mysql em um só comando    
    $ npm install knex mysql
O knex.js é definido como um "query builder", ou seja, um construtor de consultas para o banco de dados ao qual ele se conecta. Foi pensado para ser flexível e simples de usar, fornecendo um conjunto de funcionalidades básicas para a realização de qualquer tipo de operação que se deseje realizar em um banco de dados. Note que estamos instalando o driver mysql com o knex, que suporta tanto o banco de dados MySQL como o MariaDB.
#### 8 - CRIAÇÃO DO BANCO DE DADOS DA APLICAÇÃO:
     mysql> CREATE DATABASE pettopstore; 

As tabelas que serão implementadas na base de dados `pettopstore` são:
* employees
* clients
* products
* categories
* sales
* items

A tabela `employees` representa os funcionários da loja com os campos email, password, name e um boleano chamado is_admin que determina se esse funcionário tem ou não acesso à área administrativa do sistema.

A tabela `clients` guarda a lista dos clientes da empresa, cadastrados pelo site ou por um funcionário que está operando o PDV (Ponto de Venda) da loja física.

A tabela `products` tem a lista de produtos da loja virtual com o nome, descrição, caminho para uma foto, preço e uma relação com a categoria desse produto pela chave category_id que aponta para o id da tabela categories.

A tabela `categories` armazena as categorias dos produtos e é utilizada no seu cadastro e também na loja virtual para apresentar o menu de produtos separado por categorias.

A tabela `sales` tem as vendas realizadas no site ou na loja física. Ela guarda somente o client_id e o employee_id (campo opcional pois em uma compra pelo site ele não é preenchido). Os itens (ids dos produtos) de uma venda(sales) serão armazenados em uma tabela que relaciona products e sales, chamada items.

A tabela `items` relacionará `products` e `sales` (N-N) e armazenará dois ids (sale_id e product_id) e com ela conseguiremos saber que produtos compôem cada venda.

#### 9 - CRIAÇÃO E CONFIGURAÇÃO DO ARQUIVO DE CONEXÃO DA APLICAÇÃO COM O BANCO DE DADOS:
Criando na estrutura do projeto o arquivo com as [diretivas de conexão com o banco de dados](https://knexjs.org/guide/#configuration-options) da aplicação chamado `knexfile.js`, com o seguinte conteúdo.

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

( * ) Porta de conexão com o servidor do banco de dados (diferente da porta de conexão da aplicação com o servidor web).

Tenha em mente que você já deverá ter um SGBD instalado em seu computador (client); um banco de dados criado (database) e um usuário (user e password) com privilégios no banco de dados (GRANT ALL PRIVILEGES ON * . * TO 'user'@'localhost', FLUSH PRIVILEGIES, etc).

#### 10 - CRIANDO A `migration` de nome `employees`:
Agora vamos testar a configuração do `knexfile.js`, criando tabelas no banco de dados da aplicação, utilizando `migrations`, um recurso de linha de comando presente também no `knex.js`.

Migrations (no caso do Knex) são arquivos Javascript criados por uma ferramenta de linha de comando do knex chamada `knex cli` que tem por objetivo organizar de forma sequencial as alterações no esquema do banco de dados, como a criação e a exclusão de tabelas, alteração de colunas, remoção de colunas, etc.

Para criar a migration `employees` execute a seguinte linha de comando:

    $ npx knex migrate:make create_employees

Esse comando criará uma pasta de nome `migrations`, na estrutura de arquivos do projeto e dentro dela a migração de nome `20230927015523_create_employees.js` com as instruções necessárias à criação da tabela `employees`.

#### 11 - `UP` E `DOWN`:
Migrations podem ser executadas para cima "up" ou para baixo "down", (aplica/desfaz) mudanças no banco de dados, por isso a necessidade de duas funções que devem ser implementadas.

O arquivo de migração é um conjunto de duas funções, uma chamada "up" e uma chamada "down" que vem vazias e você deve preencher com os comandos que desejar, como visto abaixo:

* A função "up" será executada quando a migração for executada e ela deverá nesse caso ter os comandos do knex necessários para criar a tabela "employees".

* A função "down" deve ter os comandos "opostos" aos da função `up`, ou seja, ela deve implementar um código que remova a tabela `employees`. No método `down` simplesmente removemos a tabela criada com o comando `return knex.schema.dropTable('employees')`.

Implementando as funções `up` e `down` no arquivo `20230927015523_create_employees.js`:

    /**
     * @param { import("knex").Knex } knex
     * @returns { Promise<void> }
     */
    exports.up = function (knex) {
        return knex.schema.createTable('employees', function (table) {
            table.increments('id');
            table.string('email');
            table.string('password');
            table.string('name');
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

Repare que na função "up" usamos o comando `knex.schema.createTable`, que recebe o nome da tabela que desejamos criar e uma função recebendo uma variábel chamada `table`. Nessa variável table podemos adicionar campos com os métodos `table.increments('id')` para criar um campo chamado 'id' inteiro e autoincremental, o método `table.string` que recebe o nome do campo de texto que queremos criar e o método `able.boolean` que recebe o nome do campo boleano que estamos criando.

Existem outros métodos para a manipulação do esquema do banco de dados que podem ser conferidos na documentação do knex.

#### 12 - EXECUTANDO A `migration` CRIADA:
Até aqui, apenas criamos a `migration`. Para executá-la devemos rodar no terminal o seguinte comando:

    $ npx knex migrate:up

Isso fará com que o método "up" da próxima migração ainda não executada seja rodado. Como no nosso caso só temos uma, ela será a  `migration` executada. Repare que se você rodar esse comando mais de uma vez, a migração não executará novamente pois o knex guarda a informação de quais migrações foram criadas.

#### 13 - CRIANDO AS DEMAIS `migrations`:
  
    $ npx knex migrate:make create_clients
    $ npx knex migrate:make create_categories
    $ npx knex migrate:make create_products
    $ npx knex migrate:make create_sales
    $ npx knex migrate:make create_items

Após os comandos de criação das migrações acima, teremos dentro da pasta migrations, a seguinte estrutura de arquivos:
  
    └── migrations
       ├── 20230927015523_create_employees.js
       ├── 20230927021523_create_clients.js
       ├── 20230927021536_create_categories.js
       ├── 20230927021810_create_products.js
       ├── 20230927021851_create_sales.js
       └── 20230927021908_create_items.js

Antes de executá-las será necessário implementar em cada uma das `migrations` criadas, as funções `up` e `down`, a exemplo do que foi realizado na migration `20230927015523_create_employees.js`. 

<details>
<summary>20230927021523_create_clients.js :eye: </summary>
    
    /**
     * @param { import("knex").Knex } knex
     * @returns { Promise<void> }
     */
    exports.up = function (knex) {
        return knex.schema.createTable('clients', function (table) {
            table.increments('id');
            table.string('email');
            table.string('password');
            table.string('name');
        })
    };

    /**
     * @param { import("knex").Knex } knex
     * @returns { Promise<void> }
     */
    exports.down = function (knex) {
        return knex.schema.dropTable('clients');
    };
</details>

<details>
<summary>20230927021536_create_categories.js :eye: </summary>
    
    /**
     * @param { import("knex").Knex } knex
     * @returns { Promise<void> }
     */
    exports.up = function (knex) {
        return knex.schema.createTable('categories', function (table) {
            table.increments('id');
            table.string('name');
        })
    };

    /**
     * @param { import("knex").Knex } knex
     * @returns { Promise<void> }
     */
    exports.down = function (knex) {
        return knex.schema.dropTable('categories');
    };
</details>

<details>
<summary>20230927021810_create_products.js :eye: </summary>
    
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
</details>

<details>
<summary>20230927021851_create_sales.js :eye: </summary>
    
    /**
     * @param { import("knex").Knex } knex
     * @returns { Promise<void> }
     */
    exports.up = function (knex) {
        return knex.schema.createTable('sales', function (table) {
            table.increments('id');
            table.integer('client_id').notNullable().unsigned().references('clients.id');
            table.integer('employee_id').nullable().unsigned().references('employees.id');
        })
    };

    /**
     * @param { import("knex").Knex } knex
     * @returns { Promise<void> }
     */
    exports.down = function (knex) {
        return knex.schema.dropTable('sales');
    };
</details>

<details>
<summary>20230927021908_create_items.js :eye: </summary>
    
    /**
     * @param { import("knex").Knex } knex
     * @returns { Promise<void> }
     */
    exports.up = function (knex) {
        return knex.schema.createTable('items', function (table) {
            table.increments('id');
            table.integer('sale_id').notNullable().unsigned().references('sales.id');
            table.integer('product_id').notNullable().unsigned().references('products.id');
        })
    };
    /**
     * @param { import("knex").Knex } knex
     * @returns { Promise<void> }
     */
    exports.down = function (knex) {
        return knex.schema.dropTable('items');
    };
</details>

#### 14 - RODANDO TODAS AS `migrations` CRIADAS:

    $ npx knex migrate:latest

### 2ª PARTE - SEEDS
Antes de iniciar, vamos precisar de uma biblioteca para tratar com criptografia de senhas chamada [bcrypt](https://www.npmjs.com/package/bcrypt). Para instalá-la no projeto admin execute:

    $ npm install bcrypt

Cookies são uma tecnologia já bem conhecida na web, mas se utilizado de forma correta é super seguro e prático de usar.

Usaremos a biblioteca (middleware) [cookie-session](https://www.npmjs.com/package/cookie-session) do Express para, quando o usuário estiver logado no sistema, um cookie seguro e criptografado ser armazenado no seu navegador. Esse cookie é sempre enviado ao servidor a cada nova requisição do navegador, então poderemos verificar se o usuário que está acessando uma determinada rota está ou não com uma sessão ativa (logado) e qual é o seu ID.

    $ npm install cookie-session

Precisaremos de uma biblioteca que gerencie uploads de arquivos no sistema. Vamos usar o [multer](https://www.npmjs.com/package/multer) para essa finalidade. Para instalá-la no projeto admin execute:

    $ npm install multer

#### 1 - CRIANDO `seeds`:
Vamos inicialmente criar alguns usuários na tabela "employees" no banco de dados. Para isso vamos utilizar o recurso chamado de "seeds" do knex.

Seed são similares às migrations, mas são normalmente usadas para se adicionar dados iniciais no banco de dados e não alterar ou criar tabelas.

Crie uma seed para se criar o primeiro administrador com o comando:

    $ npx knex seed:make create_initial_employees

O arquivo criado estará na pasta "seeds" (lembre-se que "seed" foi o nome definido para o diretório do projeto que abrigaria as seeds criadas?) da aplicação, com o nome "create_initial_employees.js". Edite o arquivo e salve-o com o seguinte conteúdo:

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

Repare que o arquivo create_initial_employees.js realiza as ações:

* Para a tabela 'employees' remove todos os registros
* Depois, para a mesma tabela, adiciona 2 employees, um com is_admin = true (Maria) e outro com is_admin = false (João). Note que nesse sistema administrativo não será possível logar como João, pois ele não é administrador.
* Os employees são criados com a senha criptografada usando o comando `bcrypt.hashSync(senha_do_employee, 10)`, que recebe uma senha e retorna uma hash (versão critografada) dela que pode ser armazenada no banco de dados com segurança. Esse número 10, no segundo parâmetro do hashSync serve como configuração do método de criptografia, algo interno do bcrypt.

Para rodar o seed execute no terminal:

    $ npx knex seed:run

CRIANDO A SEED `categories`: 

    $ npx knex seed:make create_initial_categories  

SEED PARA A TABELA `create_initial_categories`: 

    /**
     * @param { import("knex").Knex } knex
     * @returns { Promise<void> } 
     */
    exports.seed = async function (knex) {
      // Deletes ALL existing entries
      await knex('categories').del()
      await knex('categories').insert([
        {name: 'Alimentos' },
        {name: 'Brinquedos' },
        {name: 'Cama e mesa' }
      ]);
    };

EXECUTANDO UMA SEED ESPECÍFICA

    $ npx knex seed:run --specific=create_initial_categories.js

### 3ª PARTE - API
No projeto admin, atualmente temos uma autenticação para os administradores (employees com admin=true) realizada com a estratégia cookie-session. Para a API iremos utilizar uma outra estratégia: JSON Web Tokens (JWT).

É possível criar APIs com outras estratégias de autenticação, inclusive com cookies, porém o uso do JWT tem algumas vantagens e uma grande popularidade hoje em dia, por isso iremos utilizar somente para a parte da API.

#### 1 - JWT (JSON Web Tokens)
É possível criar APIs com outras estratégias de autenticação, inclusive com cookies, porém o uso do JWT tem algumas vantagens e uma grande popularidade hoje em dia, por isso iremos utilizar somente para a parte da API.

Um JWT nada mais é que um token com dados assinado pelo serviço que o criou. Esses dados não podem ser alterados sem que a assinatura se invalide. Para a assinatura ser realizada com sucesso, é necessário que quem o gerou utilize um segredo (como uma senha) que também será utilizado para o decodificar e o verificar no futuro. Esse segredo não pode ser revelado para o mundo externo, devendo somente ficar em posse da aplicação que gera e verifica os tokens JWT (No nosso caso a API no projeto Admin).

A nossa estratégia será simples: No processo de sign_in, a API irá verificar se o e-mail e senha do usuário estão válidos e gerar um JWT assinado com a informação se esse usuário é um cliente ou funcionário, juntos com os dados dele. Sim, iremos autenticar com JWT tanto funcionários (usuários do PDV) como clientes (usuários da loja virtual). Esse JWT será retornado para o sistema correspondente e ele deverá se encarregar de guardar esse token JWT para realizar as operações que precisam que o usuário esteja autenticado, como por exemplo: criar vendas pelo PDV ou pela loja virtual.

A API deverá então, nessas ações que requerem autenticação, verificar se o token JWT enviado, junto com os restantes dos dados, é válido e de um cliente ou funcionário cadastrado no sistema, antes de realizar a operação.

Como estamos usando Node JS, vamos usar uma biblioteca chamada [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) para criar JWTs assinados na autenticação e verificar JWTs enviados para a API nas ações que requerem O usuário logado.

Para instalar a biblioteca digite no terminal:

    $ npm install jsonwebtoken

Vamos criar as rotas para a API. Para isso crie uma pasta chamada "api" dentro de "routes" (`routes/api/index.js`) e lá crie 5 arquivos:

* index.js
* auth.js
* clients.js
* products.js
* sales.js

Cada um desses arquivos irá conter rotas com as ações correspondentes ao seu nome e o arquivo index.js irá basicamente agregar todos os demais para manter o projeto organizado.

* `index.js` - Esse arquivo simplesmente inclui os demais e cria as rotas correspondentes para cada um deles. O index.js é o arquivo padrão que deve ser incluído no app.js para a rota raíz da api: '/api'. Iremos fazer esse procedimento ao final da apresentação dos arquivos restantes da API.
* `auth.js` é responsável pela autenticação da API, utilizando a estratégia de tokens JWT. Existem 3 rotas nesse arquivo:

    - POST /employee/sign_in
    - POST /client/sign_in
    - POST /client/registration

* `client.js` - Como visto nos comentários do código, esse arquivo só tem uma rota que lista todos os clientes da base caso o usuário que a chamou seja um funcionário e tenha passado um token JWT de um funcionário (employee), ou seja, essa rota é restrita para funcionaŕios. Será utilizada exclusivamente pelo PDV.

* `products.js` - Esse arquivo tem uma rota de busca de produtos, com todos os detalhes da implementação com comentários no código. Além disso existe uma rota que busca um produto específico por ID. Em ambas as rotas é retornado, além dos dados do produto, o nome da sua categoria, com o uso do leftJoin.
* `sales.js` - São apenas duas rotas aqui, uma para se buscar uma venda(sale) do banco e a outra para se criar uma nova venda. Todos os detalhes de implementação estão comentados no código e servem como explicação de cada comando. Repare que a rota de criação de uma venda pode ser executada por um usuário do tipo employee ou client. Isso é determinado e verificado pelo seu token JWT. No caso de um employee criando a venda, então é uma venda de balcão pelo PDV e deve ser utilizado o clientID passado para a API para se criar a venda. Caso seja uma venda criada por um cliente, então se trata de uma compra pela loja virtual e então o clientID utilizado nessa venda é o do usuário (client) logado, ou seja, o clientID é obtido a partir do token JWT.
  
<details>
<summary>routes/api/index.js :eye: </summary>
    
    const express = require('express');
    const authRouter = require('./auth');
    const clientsRouter = require('./clients');
    const productsRouter = require('./products');
    const salesRouter = require('./sales');

    const router = express.Router();

    router.use('/auth', authRouter);
    router.use('/clients', clientsRouter);
    router.use('/products', productsRouter);
    router.use('/sales', salesRouter);

    module.exports = router;
</details>

<details>
<summary>routes/api/auth.js :eye: </summary>
    
    var express = require('express');
    var router = express.Router();

    const knexConfig = require('../../knexfile');
    const knex = require('knex')(knexConfig);

    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    const segredoJWT = 'frase segredo para critografia do jwt';

    // employee sign_in
    router.post('/employee/sign_in', async(req, res) => {
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
    router.post('/client/sign_in', async(req, res) => {
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
    router.post('/client/registration', async(req ,res) => {
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
</details>

<details>
<summary>routes/api/client.js :eye: </summary>
    
    var express = require('express');
    var router = express.Router();

    const knexConfig = require('../../knexfile');
    const knex = require('knex')(knexConfig);

    const requireJWT = require('../../middlewares/requireJWT');

    // Retorna uma lista de cliente. Requer que o usuário esteja logado pelo uso do middleware requireJWT
      router.get('/', [requireJWT], async (req, res) => {

    // obtem o JWT decodificado pelo middleware requireJWT e salvo em res.locals.jwt
      const jwt = res.locals.jwt;

    // verifica se não é um JWT de um employee e retorna um erro
      if (!jwt.employee) {
        return res.status(401).json({
         message: 'Não é um funcionário'
       });
    }

     // Obtém a lista de clientes da base de dados e retorna um JSON com ela.
    const clients = await knex.table('clients').select(['id', 'name', 'email']);
      res.json({
       clients
     });
    });

    module.exports = router;
</details>

<details>
<summary>routes/api/products.js :eye: </summary>

    var express = require('express');
    var router = express.Router();

    const knexConfig = require('../../knexfile');
    const knex = require('knex')(knexConfig);

    // Busca de produtos.
    router.get('/search', async(req, res) => {

    // Obtem um query builder do knex da tabela products 
      let productsQuery = knex.table('products');

    // se o "term" de busca foi passado na query string da URL
      if (req.query.term) {

    // adiciona no query builder as restrições da busca por nome e descrição
        productsQuery = productsQuery
          .where('name', 'LIKE', `%${req.query.term}%`)
          .orWhere('description', 'LIKE', `%${req.query.term}%`);
      }

    // se for passado um category_id na query string da URL
      if (req.query.category_id) {

    // adiciona a restrição de buscar produtos somente por uma determinada categoria (category_id)
    // Exemplo; http://localhost:3000/api/products/search?category_id=7
        productsQuery = productsQuery
          .where('category_id', '=', req.query.category_id);
      }

    // Caso tenha sido passado o campo "order", muda a ordenação da busca (name ou price)
    // Exemplo: http://localhost:3000/api/products/search?order=price
      if (req.query.order) {
        if (req.query.order == 'name') {
          productsQuery = productsQuery.orderBy('name');
        } else if (req.query.order == 'price') {
          productsQuery = productsQuery.orderBy('price');
        }
      }

    // faz um left join de products com categories para poder retornar o nome da categoria do produto em uma consulta só.
      productsQuery = productsQuery.leftJoin('categories', 'products.category_id', 'categories.id');
    // informa que além dos campos de produtos, retornar também o nome da categoria dele como categoryName
      productsQuery = productsQuery.select('products.*', 'categories.name as categoryName')
      const products = await productsQuery;

      res.json({ products })
    });

    // Obtém um produto específico por ID
    router.get('/:id', async (req, res) => {

    // busca um único produto, restrito por ID e com o nome da categoria no campo categoryName
      const product = await knex.table('products').where('products.id', '=', req.params.id)
      .leftJoin('categories', 'products.category_id', 'categories.id')
      .select('products.*', 'categories.name as categoryName')
      .first();
      return res.json({ product });
    })

    module.exports = router;

</details>

#### COMENTÁRIOS SOBRE AS ROTAS `/employee/sign_in` e `/client/sign_in`:
As rotas `/employee/sign_in` e `/client/sign_in` são muito parecidas. A a única diferença entre elas é que uma autentica um funcionário e a outra autentica um cliente da loja. Os tokens JWT gerados mudam um pouco, pois retornam campos diferentes (employee para uma rota e client para a outra rota).

Essa diferença do JWT (client/employee), permite que se possa verificar se o JWT gerado pertence a um cliente ou a um funcionário.

* `/employee/sign_in` e `/client/sign_in` são as rotas responsáveis por autenticar um employee (funcionário) ou um client (cliente) por email/senha e gerar um token;
* Inicialmente é buscado o employee no banco pelo email (caso o employee/client não exista ou sua senha criptografada seja diferente da armazenada no banco) retorna um erro;
* É criado um token JWT com e dentro do payload os dados do employee;
* O token é inserido no employee e retornado como JSON;
* Isso cria um campo especial no token chamado "exp" com um valor que representa seu momento de expiração;

Note que a assinatura do token é setada para expirar em 2 dias com o comando:

    const token = jwt.sign(conteudoJWT, segredoJWT, { expiresIn: '2 days' });

#### COMENTÁRIOS SOBRE A ROTA `/client/registration`:
* Essa rota registra um novo cliente no banco de dados;
* É uma rota simples que verifica se um cliente a ser registrado já existe no banco de dados, caso contrário o registra com a senha informada criptografada com o bcrypt.
* Tanto os funcionários logados no PDV poderão usar essa rota para cadastrar clientes na loja física, quanto os próprios clientes poderão usar a loja virtual para se cadastrar através dessa rota na API.