const mongoose = require('mongoose');
const request = require('supertest');
const {app, startServer} = require('../../index');
const usersModel = require('../../scr/infrastructure/models/usersModel');

describe('Test Users Endponits', () => {
  let server;
  beforeAll(async () => {
    server = startServer();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    server.close();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        "username": "Miguel",
        "email": "Miguel@gmail.com",
        "password": "123456",
        "bio": "Descripción del perfil de usuario"
      };

      const response = await request(app)
        .post('/api/v1/users')
        .send(userData);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
    it('It should return 409 because the user already exists', async () => {
      const userData = {
        "username": "Mario",
        "email": "mario@gmail.com",
        "password": "123456",
        "bio": "Descripción del perfil de usuario"
      };

      await request(app)
        .post('/api/v1/users')
        .send(userData);

      const response = await request(app)
      .post('/api/v1/users')
      .send(userData);

      expect(response.status).toBe(409);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('It should return 400 because the json body is poorly structured', async () => {
      const userData = {
        "uusername": "Mario",
        "eemail": "mario@gmail.com",
        "password": "123456",
        "bio": "Descripción del perfil de usuario"
      };

      await request(app)
        .post('/api/v1/users')
        .send(userData);

      const response = await request(app)
      .post('/api/v1/users')
      .send(userData);

      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
  });
  describe('updateUser', () => {
    beforeAll(async() => {
      const userResponse = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Samuel',
        email: 'samuel@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });
      userId = userResponse.body.user.id;

      const loginResponse = await request(app)
      .post('/api/v1/auth/logIn')
      .send({
        email: 'samuel@gmail.com',
        password: '123456',
      });

      token = loginResponse.body.token;
    });
    it('should update an existing user', async () => {
      const response = await request(app)
      .put(`/api/v1/users/${userId}`) // Utiliza el ID del usuario creado
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({ username: 'Samuel', bio: 'Descripción del perfil de usuario actualizada', avatar: 'https://url.png'});
      

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('should return 404 if id parameter is missing', async () => {
      const response = await request(app)
        .put('/api/v1/users') // No proporcionamos el Id
        .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
        .send({ username: 'Samuel', bio: 'Descripción del perfil de usuario actualizada', avatar: 'https://url.png'});
  
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('should return 401 if token is missing', async () => {
      const response = await request(app)
        .put(`/api/v1/users/${userId}`)
        // no agregamos el token de autorización al encabezado
        .send({ username: 'Samuel', bio: 'Descripción del perfil de usuario actualizada', avatar: 'https://url.png'});
  
      expect(response.status).toBe(401);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body.error.message).toBe('Missing Token');
    });

    it('should return 401 if token is invalid', async () => {
      const response = await request(app)
        .put(`/api/v1/users/${userId}`) // Utiliza el ID del usuario creado
        .set('Authorization', `Bearer ${token+"1"}`) // Ponemos un token invalido
        .send({ username: 'Samuel', bio: 'Descripción del perfil de usuario actualizada', avatar: 'https://url.png'});
  
      expect(response.status).toBe(401);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body.error.message).toBe('Invalid Token');
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app)
        .put(`/api/v1/users/${userId+"1"}`) // Utilizamos un Id que no existe
        .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
        .send({ username: 'Samuel', bio: 'Descripción del perfil de usuario actualizada', avatar: 'https://url.png'});
  
      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body.error.message).toBe('User not found');
    });

    it('should return 400 the json body is poorly structured', async () => {
      const response = await request(app)
        .put(`/api/v1/users/${userId}`) // Utiliza el ID del usuario creado
        .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
        // Podemos mal el nombre de los campos que irán en el body
        .send({ uusername: 'Samuel', bbio: 'Descripción del perfil de usuario actualizada', aavatar: 'https://url.png'});
  
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
  });
  describe('loginUser', () => {
    beforeAll(async() => {
      const userResponse = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Manuel',
        email: 'manuel@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });
      userId = userResponse.body.user.id;
    });
    it('should login a user already registered', async () => {
      const response = await request(app)
      .post('/api/v1/auth/logIn')
      .send({
        email: 'manuel@gmail.com',
        password: '123456',
      });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app)
      .post('/api/v1/auth/logIn')
      .send({
        email: 'manuel2@gmail.com',
        password: '123456',
      });

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body.error.message).toBe('You are not registered');
    });

    it('should return 401 if wrong credentials', async () => {
      const response = await request(app)
      .post('/api/v1/auth/logIn')
      .send({
        email: 'manuel@gmail.com',
        password: '1234567',
      });

      expect(response.status).toBe(500);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body.error.message).toBe('Something went wrong, please contact the admin');
    });

    it('should return 400 if the json body is poorly structured', async () => {
      const response = await request(app)
      .post('/api/v1/auth/logIn')
      //Enviamos el mal la estructura del cuerpo del body
      .send({
        eemail: 'manuel@gmail.com',
        password: '1234567',
      });

      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('should return 500 if something went wrong, please contact the administrator', async () => {
      const response = await request(app)
      .post('/api/v1/auth/logIn')
      //Enviamos el password como un entero en ves de un string ""
      .send({
        email: 'manuel@gmail.com',
        password: 1234567
      });

      expect(response.status).toBe(500);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body.error.message).toBe('Something went wrong, please contact the admin');
    });
  });
});
