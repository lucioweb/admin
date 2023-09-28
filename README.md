## INTRODUÇÃO 
### Apresentação do sistema administrativo que será utilizado como base para a criação da loja virtual chamada `PetTopStore`.
O projeto será modular, com plataformas e tecnologias diferentes para cada módulo da aplicação e terá as seguintes funcionalidades:
* [PAINEL DE ADMINISTRAÇÃO](https://materialpublic.imd.ufrn.br/curso/disciplina/3/77/9): onde o administrador do sistema poderá gerenciar produtos e visualizar relatórios de vendas. Também contempla uma API de acesso seguro aos dados para os outros módulos.
* PDV: ponto de venda (loja física), onde o vendedor poderá cadastrar clientes e realizar novas vendas para ele.
* LOJA VIRTUAL: um web site de vendas online onde os clientes poderão visualizar e adquirir os produtos da loja.

Tecnologias do módulo administrativo:
* Node.js+Express como plataforma back-end
* MySQL como banco de dados
* knex.js como biblioteca de acesso ao banco de dados

O sistema administrativo conterá as funcionalidades mais importantes inicialmente, mas poderá ser incrementada à medida que o projeto avança.

### 1ª PARTE
  
#### 1 - CRIAÇÃO DA PASTA QUE ABRIGARÁ TODO O PROJETO
    $ mkdir pettopstore
#### 2 - ALTERNA PARA A PASTA DO PROJETO
    $ cd pettopstore
#### 3 - CRIA UMA APLICAÇÃO DE NOME `admin` UTILIZANDO O [GERADOR DE EXPRESS](https://expressjs.com/pt-br/starter/generator.html) (use a ferramenta geradora de aplicativos, express, para rapidamente criar uma estrutura básica de aplicativo).
O sistema administrativo da loja será a interface da aplicação onde os administradores da loja poderão acessar o cadastro de produtos e dados de vendas, assim como criar funcionários para a loja. Esse módulo irá contemplar também uma API que será utilizada pelos outros módulos.

    $ npx express-generator --view=ejs admin
    
O comando acima criará um aplicativo do Express com suporte a `ejs` chamado `admin` no diretório atualmente em funcionamento, a saber, `pettopstore` que retornará a seguinte estrutura:

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

### 2ª PARTE
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