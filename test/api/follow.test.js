const mongoose = require('mongoose');
const request = require('supertest');
const {app, startServer} = require('../../index');
const usersModel = require('../../scr/infrastructure/models/usersModel');

describe('Test Follow Endponits', () => {
  let server;
  beforeAll(async () => {
    server = startServer();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    server.close();
  });

  describe('createFollow', () => {
    beforeAll(async() => {
      const userResponse1 = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Juan',
        email: 'juan@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });

      const userResponse2 = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Maria',
        email: 'maria@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });

      const userResponse3 = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Mateo',
        email: 'mateo@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });

        

      const loginResponse = await request(app)
      .post('/api/v1/auth/logIn')
      .send({
        email: 'juan@gmail.com',
        password: '123456',
      });

      token = loginResponse.body.token;
      idUserResponse2 = userResponse2.body.user.id
      idUserResponse3 = userResponse3.body.user.id

      const followResponse = await request(app)
      .post('/api/v1/follow')
      .set('Authorization', `Bearer ${token}`) // Agregamos el token de autorización al encabezado
      .send({ 
          "followedUserId": idUserResponse3 
      });

    });
    it('should create new follow from one user to another', async () => {
        const response = await request(app)
        .post('/api/v1/follow')
        .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
        .send({ 
            "followedUserId": idUserResponse2
        });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('should return 404 if the user to follow does not exist', async () => {
        const response = await request(app)
        .post('/api/v1/follow')
        .set('Authorization', `Bearer ${token}`) // Agregamos el token de autorización al encabezado
        .send({ 
            "followedUserId": idUserResponse2+"1" //Agregamos un id de un usuario que no existe
        });

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('should return 401 if missing or invalid token', async () => {
        const response = await request(app)
        .post('/api/v1/follow')
        .set('Authorization', `Bearer ${token+"1"}`) // Agregamos un token invalido
        .send({ 
            "followedUserId": idUserResponse2
        });

      expect(response.status).toBe(401);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('should return 409 if the user you already follow the user you are trying to follow', async () => {
        const response = await request(app)
        .post('/api/v1/follow')
        .set('Authorization', `Bearer ${token}`) // Agregamos el token de autorización al encabezado
        .send({ 
            "followedUserId": idUserResponse3 //Seguimos al usuario que ya estabamos siguiendo
        });

      expect(response.status).toBe(409);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    
  });
  describe('deleteFollow', () => {
    beforeAll(async() => {
      const userResponse1 = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Rober',
        email: 'rober@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });

      const userResponse2 = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Josefa',
        email: 'josefa@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });

      const userResponse3 = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Ricardo',
        email: 'ricardo@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });

        

      const loginResponse = await request(app)
      .post('/api/v1/auth/logIn')
      .send({
        email: 'rober@gmail.com',
        password: '123456',
      });

      token = loginResponse.body.token;
      idUserResponse2 = userResponse2.body.user.id
      idUserResponse3 = userResponse3.body.user.id

      const followResponse = await request(app)
      .post('/api/v1/follow')
      .set('Authorization', `Bearer ${token}`) // Agregamos el token de autorización al encabezado
      .send({ 
          "followedUserId": idUserResponse3 
      });

    });
    it('should return 200 if the user stops following', async () => {
        const response = await request(app)
        .delete('/api/v1/unfollow')
        .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
        .send({ 
            "followedUserId": idUserResponse3
        });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('should return 409 if Are you trying to unfollow a person you do not follow', async () => {
        const response = await request(app)
        .delete('/api/v1/unfollow')
        .set('Authorization', `Bearer ${token}`) // Agregamos el token de autorización al encabezado
        .send({ 
            "followedUserId": idUserResponse2 
        });

      expect(response.status).toBe(409);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('should return 401 if the user stops following', async () => {
        const response = await request(app)
        .delete('/api/v1/unfollow')
        .set('Authorization', `Bearer ${token+"1"}`) // Agregamos un token invalido
        .send({ 
            "followedUserId": idUserResponse3
        });

      expect(response.status).toBe(401);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    

    
  });
  describe('getFollowers', () => {
    beforeAll(async() => {
      const userResponse1 = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Madeline',
        email: 'madeline@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });

      const userResponse2 = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Alberto',
        email: 'alberto@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });

      const userResponse3 = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Duban',
        email: 'duban@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });

        

      const loginResponse = await request(app)
      .post('/api/v1/auth/logIn')
      .send({
        email: 'madeline@gmail.com',
        password: '123456',
      });

      token = loginResponse.body.token;
      idUserResponse2 = userResponse2.body.user.id
      idUserResponse3 = userResponse3.body.user.id

      const followResponse = await request(app)
      .post('/api/v1/follow')
      .set('Authorization', `Bearer ${token}`) // Agregamos el token de autorización al encabezado
      .send({ 
          "followedUserId": idUserResponse3 
      });

    });
    it('should get all followers of a user by their id', async () => {
        const response = await request(app)
        .get(`/api/v1/followers/${idUserResponse3}`)
        .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
        .send({});

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
    it('should return 401 if missing or invalid token', async () => {
        const response = await request(app)
        .get(`/api/v1/followers/${idUserResponse3}`)
        .set('Authorization', `Bearer ${token+"1"}`) // Agregamos un token invalido
        .send({});

      expect(response.status).toBe(401);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
    it('should return 404 the user you are trying to search for does not exist', async () => {
        const response = await request(app)
        .get(`/api/v1/followers/${idUserResponse3+"1"}`)
        .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
        .send({});

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
  });
  describe('getFollowings', () => {
    beforeAll(async() => {
      const userResponse1 = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Michael',
        email: 'michael@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });

      const userResponse2 = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Marbel',
        email: 'marbel@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });

      const userResponse3 = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Yajaira',
        email: 'yajaira@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });

        

      const loginResponse = await request(app)
      .post('/api/v1/auth/logIn')
      .send({
        email: 'michael@gmail.com',
        password: '123456',
      });

      token = loginResponse.body.token;
      idUserResponse1 = userResponse1.body.user.id
      idUserResponse2 = userResponse2.body.user.id
      idUserResponse3 = userResponse3.body.user.id

      const followResponse = await request(app)
      .post('/api/v1/follow')
      .set('Authorization', `Bearer ${token}`) // Agregamos el token de autorización al encabezado
      .send({ 
          "followedUserId": idUserResponse3
      });

    });
    it('should get all followings of a user by their id', async () => {
        const response = await request(app)
        .get(`/api/v1/followings/${idUserResponse1}`)
        .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
        .send({});

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
    it('should return 401 if missing or invalid token', async () => {
        const response = await request(app)
        .get(`/api/v1/followings/${idUserResponse1}`)
        .set('Authorization', `Bearer ${token+"1"}`) // Agregamos un token invalido
        .send({});

      expect(response.status).toBe(401);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
    it('should return 404 the user you are trying to search for does not exist', async () => {
        const response = await request(app)
        .get(`/api/v1/followings/${idUserResponse1+"1"}`)
        .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
        .send({});

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
  });
});
