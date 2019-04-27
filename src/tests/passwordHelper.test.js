const assert = require('assert');

const PasswordHelper = require('../helpers/passwordHelper');

const SENHA = 'Patric@32123123';
const HASH = '$2b$04$bAzD3qSSndyi6/eWG3dgo.QEaGOgI2sqzjFTQPvmw9.eEp/6LMiia';

describe('UserHelper test suite', function () {
  it('deve gerar um hash a partir de uma senha', async () => {
    const result = await PasswordHelper.hashPassword(SENHA);
    
    assert.ok(result.length > 10);
  });

  it('deve comparar uma senha e seu hash', async () => {
    const result = await PasswordHelper.comparePassword(SENHA, HASH);
    
    assert.ok(result);
  });
});