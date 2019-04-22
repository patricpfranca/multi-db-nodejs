const assert = require('assert');
const api = require('./../api');

let app = {};

describe('Suite de testes da API Heroes', function () {
  this.beforeAll(async () => {
    app = await api;
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

  it('listar /heroes - filtrar um item', async () => {
    const NOME = 'Homem-Aranha-1555860707579'
    const result = await app.inject({
      method: 'GET',
      url: `/heroes?skip=0&limit=1000&nome=${NOME}`
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.deepEqual(statusCode, 200);
    assert.ok(dados[0].nome === NOME);
  });
});