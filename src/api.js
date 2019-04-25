// yarn add hapi
// yarn add vision inert hapi-swagger

const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');

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

  const swaggerOptions = {
    info: {
      title: 'API Heroes - #CursoNodeBR',
      version: 'v1.0'
    },
    lang: 'pt'
  }
  await app.register([
    Vision, Inert, {
      plugin: HapiSwagger, options: swaggerOptions
    }
  ]);

  app.route(mapRoutes(new HeroesRoute(context), HeroesRoute.methods()));

  await app.start();
  console.log('Serevidor rodando na porta', app.info.port);
  
  return app;
}

module.exports = main();
