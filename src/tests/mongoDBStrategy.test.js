const assert = require('assert');
const MongoDB = require('../db/strategies/mongodb/mongodb');
const Context = require('../db/strategies/base/contextStrategy');
const HeroesSchema = require('../db/strategies/mongodb/schemas/heroesSchema');

let context = {};

const MOCK_HEROES_CADASTRAR = {
  nome: 'Mulher Maravilha',
  poder: 'laço'
}

const MOCK_HEROES_DEFAULT = {
  nome: `Homem-Aranha-${Date.now()}`,
  poder: 'Super teia'
}

const MOCK_HEROES_ATUALIZAR = {
  nome: `Patolino-${Date.now()}`,
  poder: 'Velocidade'
}

let MOCK_HEROES_ID = '';

describe('MongoDB Suite de testes', function () {
  this.beforeAll(async () => {
    const connection = MongoDB.connect();
    context = new Context(new MongoDB(connection, HeroesSchema));
    
    await context.create(MOCK_HEROES_DEFAULT);
    const result = await context.create(MOCK_HEROES_ATUALIZAR);
    MOCK_HEROES_ID = result._id;
  });

  it('verificar conexão', async () => {
    const result = await context.isConnected();
    const expected = 'Conectado';

    assert.deepEqual(result, expected);
  });

  it('cadastrar', async () => {
    const { nome, poder } = await context.create(MOCK_HEROES_CADASTRAR);
    assert.deepEqual({ nome, poder }, MOCK_HEROES_CADASTRAR);
  });

  it('listar', async () => {
    const [{nome, poder}] = await context.read({ nome: MOCK_HEROES_DEFAULT.nome });
    const result = { nome, poder };
    assert.deepEqual(result, MOCK_HEROES_DEFAULT);
  });

  it('atualizar', async () => {
    const result = await context.update(MOCK_HEROES_ID, {
      nome: 'Pernalonga'
    });
    assert.deepEqual(result.nModified, 1);
  });

  it('remover', async () => {
    const result = await context.delete(MOCK_HEROES_ID);
    assert.deepEqual(result.n, 1);
  });
})