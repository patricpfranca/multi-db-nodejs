const Joi = require('joi');
const Boom = require('boom');
const Jwt = require('jsonwebtoken');
const BaseRoute = require('./base/baseRoute');
const PasswordHelper = require('./../helpers/passwordHelper');

const failAction = (request, headers, error) => {
  throw error;
};

class AuthRoutes extends BaseRoute {
  constructor(secret, db) {
    super();
    this.secret = secret;
    this.db = db;
  }

  login() {
    return {
      path: '/login',
      method: 'POST',
      config: {
        auth: false,
        tags: ['api'],
        description: 'Obter token',
        notes: 'faz login com user e senha',
        validate: {
          failAction,
          payload: {
            username: Joi.string().required(),
            password: Joi.string().required()
          }
        }
      },
      handler: async (request) => {
        const { username, password } = request.payload;

        const [usuario] = await this.db.read({
          username: username.toLowerCase()
        });

        if(!usuario) {
          return Boom.unauthorized('Usuário informado não existe!');
        }

        const match = await PasswordHelper.comparePassword(password, usuario.password);

        if(!match) {
          return Boom.unauthorized('O usuário ou senha invalidos!');
        }

        const token = Jwt.sign({
          username: username,
          id: usuario.id
        }, this.secret);

        return {
          token
        }
      }
    }
  }
}

module.exports = AuthRoutes;