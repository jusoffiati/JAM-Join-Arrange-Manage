import { Sequelize } from 'sequelize';
const { __HEROKU__ } = process.env;

const sequelize = __HEROKU__ 
  ? new Sequelize(process.env.DB!)
  : new Sequelize(process.env.DB_NAME || 'grouptesting', process.env.DB_USER || 'alejandro', process.env.PW || '', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false,
  });

(async () => {
  try {
    await sequelize.sync();
    console.log(`Connected to database '${process.env.DB_NAME}'`);
  } catch (error) {
    console.error('Failed to connect with Database =(', error);
  }
})();

export default sequelize;
