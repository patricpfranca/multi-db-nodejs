// yarn add sequelize pg-hstore pg
const Sequelize = require('sequelize');
const drive = new Sequelize(
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

async function main() {
  const Heroes = drive.define('heroes', {
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

  await Heroes.sync();
  // await Heroes.create({
  //   nome: 'Lanterna Verde',
  //   poder: 'Anel'
  // });
  const result = await Heroes.findAll({ raw: true });

  console.log('result', result);
}

main();