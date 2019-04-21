// yarn add hapi

const Hapi = require('hapi');

const Context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongodb/mongodb');
const HeroesSchema = require('./db/strategies/mongodb/schemas/heroesSchema');
const HeroesRoute = require('./routes/heroesRoutes');

const app = new Hapi.Server({
  port: 5000
});

function mapRoutes(instance, methods) {
  return methods.map(method => instance[method]());
}

async function main() {
  const connection = MongoDB.connect();
  const context = new Context(new MongoDB(connection, HeroesSchema));

  app.route([
    ...mapRoutes(new HeroesRoute(context), HeroesRoute.methods())
  ]);

  await app.start();
  console.log('Serevidor rodando na porta', app.info.port);
  
  return app;
}

module.exports = main();
