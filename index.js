const express = require('express');
const dbConnection = require('./scr/infrastructure/database/config');
const Dev_dbConnection = require('./scr/infrastructure/database/devConfig');
const Test_dbConnection = require('./scr/infrastructure/database/testConfig');
require('dotenv').config();
const path = require("path");

// Env VARS
const { APP_PORT, NODE_ENV } = process.env


// Swagger
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerSpec = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Product-Prowess API",
      version: "1.0.0"
    },
    servers: [
      {
        url: "http://localhost:"+APP_PORT
      }
    ]
  },
  apis: [`${path.join(__dirname, "./scr/infrastructure/routes/*.js")}`]
};


const app = express();

// Parsing body payload
app.use(express.json());

// DB CONNECTION
const startServer = () => {
  if (NODE_ENV === "production") {
    dbConnection();
  } else if (NODE_ENV === "development") {
    Dev_dbConnection();
  } else if (NODE_ENV === "test") {
    Test_dbConnection();
  }

  const server = app.listen(APP_PORT, () => {
    console.log(`Servidor corriendo en puerto: ${APP_PORT}`);
  });

  return server;
};

if(NODE_ENV != "test"){
  startServer();
}


// CORS
app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  next();
});


// app routes
app.use('/api/v1', require('./scr/infrastructure/routes/usersRoute') );
app.use('/api/v1', require('./scr/infrastructure/routes/publicProductsRoute'));
app.use('/api/v1', require('./scr/infrastructure/routes/productsRoute'));
app.use('/api/v1', require('./scr/infrastructure/routes/commentsRoute'));
app.use('/api/v1', require('./scr/infrastructure/routes/followRoute'));
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)));


module.exports = { app, startServer };
