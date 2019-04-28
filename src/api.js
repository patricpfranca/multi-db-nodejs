// yarn add hapi
// yarn add vision inert hapi-swagger
const { config } = require('dotenv');
const { join } = require('path');
const { ok } = require('assert');

const env = process.env.NODE_ENV || 'dev';
ok(env == 'prod' || env === 'dev', 'env inválida, DEV ou PROD');

const configPath = join(__dirname, './config', `.env.${env}`);

config({
  path: configPath
});

const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');
const HapiJwt = require('hapi-auth-jwt2');

const JWT_SECRET = process.env.JWT_KEY;

const Context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongodb/mongodb');
const PostgresDB = require('./db/strategies/postgres/postgres');
const HeroesSchema = require('./db/strategies/mongodb/schemas/heroesSchema');
const UserSchema = require('./db/strategies/postgres/schemas/userSchema');

const HeroesRoute = require('./routes/heroesRoutes');
const AuthRoute = require('./routes/authRoutes');
const UtilRoute = require('./routes/utilRoutes');

const app = new Hapi.Server({
  port: process.env.PORT
});

function mapRoutes(instance, methods) {
  return methods.map(method => instance[method]());
}

async function main() {
  const connection = MongoDB.connect();
  const context = new Context(new MongoDB(connection, HeroesSchema));
  const connectionPostgres = await PostgresDB.connect();
  const model = await PostgresDB.defineModel(connectionPostgres, UserSchema);

  const contextPostgres = new Context(new PostgresDB(connectionPostgres, model));

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
    validate: async (dado, request) => {
      const [result] = await contextPostgres.read({
        username: dado.username.toLowerCase(),
        id: dado.id
      });

      if(!result) {
        return {
          isValid: false
        }  
      }

      return {
        isValid: true
      }
    }
  });

  app.auth.default('jwt');

  app.route([
    ...mapRoutes(new HeroesRoute(context), HeroesRoute.methods()),
    ...mapRoutes(new AuthRoute(JWT_SECRET, contextPostgres), AuthRoute.methods()),
    ...mapRoutes(new UtilRoute(), UtilRoute.methods())
  ]);

  await app.start();
  console.log('Serevidor rodando na porta', app.info.port);
  
  return app;
}

module.exports = main();
