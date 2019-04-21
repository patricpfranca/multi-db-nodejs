const assert = require('assert');
const MongoDB = require('../db/strategies/mongodb');
const Context = require('../db/strategies/base/contextStrategy');

const context = new Context(new MongoDB());

const MOCK_HEROES_CADASTRAR = {
  nome: 'Mulher Maravilha',
  poder: 'laço'
}

const MOCK_HEROES_DEFAULT = {
  nome: `Homem-Aranha-${Date.now()}`,
  poder: 'Super teia'
}

describe('MongoDB Suite de testes', function () {
  this.beforeAll(async () => {
    await context.connect();
    await context.create(MOCK_HEROES_DEFAULT);
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
})