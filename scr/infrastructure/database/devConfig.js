// Configuración para la base de datos desarrollo
const mongoose = require('mongoose');


const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DEV_MONGODB_URI+process.env.DEV_DB_NAME);
    console.log('Conexion a '+process.env.DEV_DB_NAME+' exitosa');
  } catch (error) {
    console.error(error);
    throw new Error('No fue posible realizar la conexion con MongoDB');
  }
}

module.exports = dbConnection;