const mongoose = require('mongoose');
const request = require('supertest');
const {app, startServer} = require('../../index');
const usersModel = require('../../scr/infrastructure/models/usersModel');

describe('Test Comments Endponits', () => {
  let server;
  beforeAll(async () => {
    server = startServer();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    server.close();
  });

  describe('createComment', () => {
    beforeAll(async() => {
      const userResponse = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Maicol',
        email: 'maicol@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });

      const loginResponse = await request(app)
      .post('/api/v1/auth/logIn')
      .send({
        email: 'maicol@gmail.com',
        password: '123456',
      });

      token = loginResponse.body.token;

      const productResponse = await request(app)
      .post('/api/v1/products/')
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({ 
        productName: 'Cafetera portatil',
        description: 'Hermosa cafetera portatil, ligera y facil de usar',
        url: 'https://example.com/product',
        tags: ['Hogar', 'Electrodomesticos']
      });
      productId = productResponse.body.product.id;

    });
    it('should create new comment for an existing product', async () => {
      const response = await request(app)
      .post(`/api/v1/comments/${productId}`) // Utiliza el ID del producto creado
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({
        content: 'Excelente producto',
        rate: 5
      });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('should return 401 if token is invalid', async () => {
      const response = await request(app)
      .post(`/api/v1/comments/${productId}`) // Utiliza el ID del producto creado
      .set('Authorization', `Bearer ${token+"1"}`) // Se agrega un token invalido
      .send({
        content: 'Excelente producto',
        rate: 5
      });

      expect(response.status).toBe(401);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('should return 404 if the product to comment does not exist', async () => {
      const response = await request(app)
      .post(`/api/v1/comments/${productId+"1"}`) // Utilizamos un productId invalido
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({
        content: 'Excelente producto',
        rate: 5
      });

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
    it('should return 400 the json body is poorly structured', async () => {
      const response = await request(app)
      .post(`/api/v1/comments/${productId}`) // Utiliza el ID del producto creado
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({
        ccontent: 'Excelente producto',  //Colocamos mal la estructura del Body
        rate: 5
      });
  
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
  });
  describe('getComment', () => {
    beforeAll(async() => {
      const userResponse = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Maicol',
        email: 'maicol@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });

      const loginResponse = await request(app)
      .post('/api/v1/auth/logIn')
      .send({
        email: 'maicol@gmail.com',
        password: '123456',
      });

      token = loginResponse.body.token;

      const productResponse = await request(app)
      .post('/api/v1/products/')
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({ 
        productName: 'Televisor 4K',
        description: 'Hermoso televisor 4K ligero y facil de usar',
        url: 'https://example.com/product',
        tags: ['Hogar', 'Electrodomesticos']
      });
      productId = productResponse.body.product.id;

      const commentResponse = await request(app)
      .post(`/api/v1/comments/${productId}`) // Utiliza el ID del producto creado
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({
        content: 'Excelente producto',
        rate: 5
      });

      const commentResponse2 = await request(app)
      .post(`/api/v1/comments/${productId}`) // Utiliza el ID del producto creado
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({
        content: 'No cumplio las espectativas',
        rate: 2
      });

    });
    it('should get comments for a product by ID product', async () => {
      const response = await request(app)
      .get(`/api/v1/comments/${productId}`) // Utiliza el ID del producto creado
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({});

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
    it('should return 401 if token is invalid', async () => {
      const response = await request(app)
      .get(`/api/v1/comments/${productId}`) // Utiliza el ID del producto creado
      .set('Authorization', `Bearer ${token+"1"}`) // Se agrega un token invalido
      .send({});

      expect(response.status).toBe(401);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
    it('should return 404 if the product to search does not exist', async () => {
      const response = await request(app)
      .get(`/api/v1/comments/${productId+"1"}`) // Utilizamos un productId invalido
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({});

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
  });
});
