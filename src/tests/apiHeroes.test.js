const assert = require('assert');
const api = require('./../api');

let app = {};
const MOCK_HEROES_CADASTRAR = {
  nome: 'Chapolin Colorado',
  poder: 'Marreta Bionica'
};

const MOCK_HEROES_DEFAULT = {
  nome: 'Mulher Maravilha',
  poder: 'laço'
};

let MOCK_ID = '';

describe('Suite de testes da API Heroes', function () {
  this.beforeAll(async () => {
    app = await api;
    const result = await app.inject({
      method: 'POST',
      url: '/heroes',
      payload: JSON.stringify(MOCK_HEROES_DEFAULT)
    });

    const dados = JSON.parse(result.payload);
    MOCK_ID = dados._id;
  });

  it('listar /heroes', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/heroes?skip=0&limit=10'
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.deepEqual(statusCode, 200);
    assert.ok(Array.isArray(dados));
  });

  it('listar /heroes - retornar 3 registros', async () => {
    const TAMANHO_LIMITE = 3;
    const result = await app.inject({
      method: 'GET',
      url: `/heroes?skip=0&limit=${TAMANHO_LIMITE}`
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.deepEqual(statusCode, 200);
    assert.ok(dados.length === TAMANHO_LIMITE);
  });

  it('listar /heroes - retornar um erro com limit incorreto', async () => {
    const TAMANHO_LIMITE = 'AAA';
    const result = await app.inject({
      method: 'GET',
      url: `/heroes?skip=0&limit=${TAMANHO_LIMITE}`
    });

    const errorResult = {"statusCode":400,"error":"Bad Request","message":"child \"limit\" fails because [\"limit\" must be a number]","validation":{"source":"query","keys":["limit"]}};

    assert.deepEqual(result.statusCode, 400);
    assert.deepEqual(result.payload, JSON.stringify(errorResult));
  });

  it('listar GET /heroes - filtrar um item', async () => {
    const NOME = MOCK_HEROES_DEFAULT.nome
    const result = await app.inject({
      method: 'GET',
      url: `/heroes?skip=0&limit=1000&nome=${NOME}`
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.deepEqual(statusCode, 200);
    assert.ok(dados[0].nome === NOME);
  });

  it('cadastrar POST /heroes', async () => {
    const result = await app.inject({
      method: 'POST',
      url: `/heroes`,
      payload: JSON.stringify(MOCK_HEROES_CADASTRAR)
    });

    const statusCode = result.statusCode;
    const { message, _id } = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.notStrictEqual(_id, undefined);
    assert.deepEqual(message, "Heroi cadastrado com sucesso");
  });

  it('atualizar PATCH /heroes/:id', async () => {
    const _id = MOCK_ID;
    const expected = {
      poder: 'laço forte'
    };
    
    const result = await app.inject({
      method: 'PATCH',
      url: `/heroes/${_id}`,
      payload: JSON.stringify(expected)
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(dados.message, 'Heroi atualizado com sucesso');
  });

  it('atualizar PATCH /heroes/:id - não deve atualizar com id incorreto', async () => {
    const _id = `5cc10e46340171728d2e616c`;
    
    const result = await app.inject({
      method: 'PATCH',
      url: `/heroes/${_id}`,
      payload: JSON.stringify({
        poder: 'laço'
      })
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    const expected = { statusCode: 412,
      error: 'Precondition Failed',
      message: 'Id não encontrado no banco!' }    

    assert.ok(statusCode === 412);
    assert.deepEqual(dados, expected);
  });

  it('remover DELETE /heroes/:id', async () => {
    const _id = MOCK_ID;
    const result = await app.inject({
      method: 'DELETE',
      url: `/heroes/${_id}`
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(dados.message, 'Heroi removido com sucesso');
  });

  it('remover DELETE /heroes/:id - não deve remover', async () => {
    const _id = '5cc10e46340171728d2e616c';
    const result = await app.inject({
      method: 'DELETE',
      url: `/heroes/${_id}`
    });
    const expected = { statusCode: 412,
      error: 'Precondition Failed',
      message: 'Id não encontrado no banco!' }

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.ok(statusCode === 412);
    assert.deepEqual(dados, expected);
  });

  it('remover DELETE /heroes/:id - não deve remover com id invalido', async () => {
    const _id = 'ID_INVALIDO';
    const result = await app.inject({
      method: 'DELETE',
      url: `/heroes/${_id}`
    });
    const expected = { statusCode: 500,
      error: 'Internal Server Error',
      message: 'An internal server error occurred' }

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.ok(statusCode === 500);
    assert.deepEqual(dados, expected);
  });
});