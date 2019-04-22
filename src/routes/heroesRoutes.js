const Joi = require('joi');
const BaseRoute = require('./base/baseRoute');

class HeroesRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      path: '/heroes',
      method: 'GET',
      config: {
        validate: {
          failAction: (request, headers, error) => {
            throw error;
          },
          //payload -> body
          //headers -> header
          //params -> na URL :id
          //query -> ?skip&limit
          query: {
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
            nome: Joi.string().min(3).max(100)
          }
        }
      },
      handler: (request, headers) => {
        try {
          const { skip, limit, nome } = request.query;
          const query = nome ? { nome: {$regex: `.*${nome}*.`} } : {};

          return this.db.read(query, skip, limit);
        } catch (error) {
          console.log('Deu ruim!', error);
          return 'Erro interno no servidor';
        }
      }
    }
  }
}

module.exports = HeroesRoutes;