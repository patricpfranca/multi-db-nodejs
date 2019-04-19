// yarn add mongoose
const Mongoose = require('mongoose');
Mongoose.connect('mongodb://patric:root@localhost:27017/heroes',
  { useNewUrlParser: true }, (error) => {
    if(!error) return ;
    console.log('Falha conexão', error);
  });

const connection = Mongoose.connection;

connection.once('open', () => console.log('Database running!'));
// const state = connection.readyState;
// console.log('state', state);
/* STATES MONGODB
  0: Desconectado, 1: Conectado, 2: Conectando, 3: Disconectando
*/
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

const model = Mongoose.model('heroes', HeroesSchema);

async function main() {
  const resultCadastrar = await model.create({
    nome: 'Batman',
    poder: 'Dinheiro'
  });
  console.log('result', resultCadastrar);

  const listItems = await model.find();
  console.log('items', listItems);

  
};
main();
