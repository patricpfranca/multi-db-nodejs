// yarn add hapi
// yarn add vision inert hapi-swagger

const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');
const HapiJwt = require('hapi-auth-jwt2');

const JWT_SECRET = 'meusegredao123';

const Context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongodb/mongodb');
const HeroesSchema = require('./db/strategies/mongodb/schemas/heroesSchema');
const HeroesRoute = require('./routes/heroesRoutes');
const AuthRoute = require('./routes/authRoutes');

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
    HapiJwt,
    Vision, Inert, {
      plugin: HapiSwagger, options: swaggerOptions
    }
  ]);

  app.auth.strategy('jwt', 'jwt', {
    key: JWT_SECRET,
    // options: {
    //   expiresIn: 20
    // },
    validate: (dado, request) => {
      return {
        isValid: true
      }
    }
  });

  app.auth.default('jwt');

  app.route([
    ...mapRoutes(new HeroesRoute(context), HeroesRoute.methods()),
    ...mapRoutes(new AuthRoute(JWT_SECRET), AuthRoute.methods())
  ]);

  await app.start();
  console.log('Serevidor rodando na porta', app.info.port);
  
  return app;
}

module.exports = main();
