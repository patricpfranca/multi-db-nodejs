const Sequelize = require('sequelize');
const ICrud = require('./interfaces/interfaceCrud');

class Postgres extends ICrud {
  constructor() {
    super();
    this.driver = null;
    this._heroes = null;
    this._connect();
  }

  async isConnected() {
    try {
      await this._driver.authenticate();
      return true;
    } catch (error) {
      console.log('Fail!', error);
      return false;
    }
  }

  async defineModel() {
    this._heroes = driver.define('heroes', {
      id: {
        type: Sequelize.INTEGER,
        required: true,
        primaryKey: true,
        autoIncrement: true
      },
      nome: {
        type: Sequelize.STRING,
        required: true
      },
      poder: {
        type: Sequelize.STRING,
        required: true
      }
    }, {
      tableName: 'TB_HEROES',
      freezeTableName: false,
      timestamps: false
    });
  }

  _connect() {
    this._driver = new Sequelize(
      'heroes',
      'root',
      'root',
      {
        host: 'localhost',
        dialect: 'postgres',
        quoteIdentifiers: false,
        operatorsAliases: false
      }
    );
  }

  create(item) {
    return this._heroes.create(item);
  }
}

module.exports = Postgres;