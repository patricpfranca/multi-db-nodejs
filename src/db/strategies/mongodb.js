const Mongoose = require('mongoose');
const ICrud = require('./interfaces/interfaceCrud');
const STATUS = {
  0: 'Desconectado', 1: 'Conectado', 2: 'Conectando', 3: 'Disconectando'
}

class MongoDB extends ICrud {
  constructor() {
    super();
    this._heroes = null;
    this._driver = null;
  }

  async isConnected() {
    const state = STATUS[this._driver.readyState];
    if(state === 'Conectado') return state;

    if(state !== 'Conectando') return state;

    await new Promise(resolve => setTimeout(resolve, 1000));

    return STATUS[this._driver.readyState];
  }

  connect() {
    Mongoose.connect('mongodb://patric:root@localhost:27017/heroes',
      { useNewUrlParser: true }, (error) => {
        if(!error) return ;
        console.log('Falha conexão', error);
      });
    
    const connection = Mongoose.connection;
    
    this._driver = connection;
    connection.once('open', () => console.log('Database running!'));
    this.defineModel();
  }

  defineModel() {
    const HeroesSchema = new Mongoose.Schema({
      nome: {
        type: String,
        required: true,
      },
      poder: {
        type: String,
        required: true
      },
      insertedAt: {
        type: Date,
        default: new Date()
      }
    });
    
    this._heroes = Mongoose.model('heroes', HeroesSchema);
  }

  create(item) {
    return this._heroes.create(item);
  }

  read(item, skip=0, limit=10) {
    return this._heroes.find(item).skip(skip).limit(limit);
  }
}

module.exports = MongoDB;