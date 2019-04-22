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

  it('listar /heroes - returnar 10 registros', async () => {
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

  it('listar /heroes - returnar 10 registros', async () => {
    const TAMANHO_LIMITE = 'AAA';
    const result = await app.inject({
      method: 'GET',
      url: `/heroes?skip=0&limit=${TAMANHO_LIMITE}`
    });

    assert.deepEqual(result.payload, 'Erro interno no servidor');
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