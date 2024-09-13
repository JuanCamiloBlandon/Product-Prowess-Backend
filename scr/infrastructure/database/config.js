// Configuración para la base de datos productiva
const mongoose = require('mongoose');


const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI+process.env.DB_NAME);
    console.log('Conexion a '+process.env.DB_NAME+' exitosa');
  } catch (error) {
    console.error(error);
    throw new Error('No fue posible realizar la conexion con MongoDB');
  }
}

module.exports = dbConnection;