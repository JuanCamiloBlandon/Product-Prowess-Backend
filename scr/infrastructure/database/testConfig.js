// Configuración para la base de datos de prueba
const mongoose = require('mongoose');


const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.TEST_MONGODB_URI+process.env.TEST_DB_NAME);
    console.log('Conexion a '+process.env.TEST_DB_NAME+' exitosa');
  } catch (error) {
    console.error(error);
    throw new Error('No fue posible realizar la conexion con MongoDB');
  }
}

module.exports = dbConnection;