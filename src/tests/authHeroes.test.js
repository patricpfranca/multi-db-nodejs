const assert = require('assert');
const api = require('./../api');
const Context = require('./../db/strategies/base/contextStrategy');
const Postgres = require('./../db/strategies/postgres/postgres');
const UsersSchema = require('./../db/strategies/postgres/schemas/userSchema');

let app = {};
const USER = {
  username: 'xuxadasilva',
  password: '123'
}

const USER_DB = {
  ...USER,
  password: '$2b$04$cluM44RTImp0Mr.eQyGxtOnwfQ6PaJyerddSJMi7BAE9YN3zAWpCy'
}

describe('Auth test suite', function () {
  this.beforeAll(async () => {
    app = await api;

    const connectionPostgres = await Postgres.connect();
    const model = await Postgres.defineModel(connectionPostgres, UsersSchema);
    const postgres = new Context(new Postgres(connectionPostgres, model));
    await postgres.update(null, USER_DB, true);
  });

  it('deve obter um token', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: USER
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.deepEqual(statusCode, 200);
    assert.ok(dados.token.length > 10);
  });

  it('deve retornar não autorizado ao tentar obter login errado', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'patric',
        password: '123'
      }
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.deepEqual(statusCode, 401);
    assert.deepEqual(dados.error, 'Unauthorized');
  })
});