const assert = require('assert');
const Postgres = require('../db/strategies/postgres');
const Context = require('../db/strategies/base/contextStrategy');

const context = new Context(new Postgres());
const MOCK_HEROES_CADASTRAR = { nome: 'Gavião Negro', poder: 'Flexas' };
const MOCK_HEROES_ATUALIZAR = { nome: 'Batman', poder: 'Dinheiro' }

describe('Postgres Strategy', function () {
  this.timeout(Infinity);
  this.beforeAll(async () => {
    await context.connect();
    await context.delete();
    await context.create(MOCK_HEROES_ATUALIZAR);
  })

  it('Postgres SQL Connection', async () => {
    const result = await context.isConnected();
    assert.equal(result, true);
  });

  it('cadastrar', async () => {
    const result = await context.create(MOCK_HEROES_CADASTRAR);
    delete result.id;
    assert.deepEqual(result, MOCK_HEROES_CADASTRAR);
  });

  it('listar', async () => {
    const [result] = await context.read({ nome: MOCK_HEROES_CADASTRAR.nome });
    delete result.id;
    assert.deepEqual(result, MOCK_HEROES_CADASTRAR);
  });

  it('atualizar', async () => {
    const [itemAtualizar] = await context.read({ nome: MOCK_HEROES_ATUALIZAR.nome });
    const novoItem = {
      ...MOCK_HEROES_ATUALIZAR,
      nome: 'Mulher Maravilha'
    }
    const [result] = await context.update(itemAtualizar.id, novoItem);
    const [itemAtualizado] = await context.read({ id: itemAtualizar.id });

    assert.deepEqual(result, 1);
    assert.deepEqual(itemAtualizado.nome, novoItem.nome);
  });

  it('remover por id', async () => {
    const [item] = await context.read({});
    const result = await context.delete(item.id);
    assert.deepEqual(result, 1);
  })
});