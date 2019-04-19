const assert = require('assert');
const Postgres = require('../db/strategies/postgres');
const Context = require('../db/strategies/base/contextStrategy');

const context = new Context(new Postgres());
const MOCK_HEROES_CADASTRAR = { nome: 'Gavião Negro', poder: 'Flexas' }

describe('Postgres Strategy', function () {
  this.timeout(Infinity);

  it('Postgres SQL Connection', async () => {
    const result = await context.isConnected();
    assert.equal(result, true);
  });

  it('cadastrar', async () => {
    const result = await context.create(MOCK_HEROES_CADASTRAR);

    assert.deepEqual(result, MOCK_HEROES_CADASTRAR);
  });
});