const mongoose = require('mongoose');
const request = require('supertest');
const {app, startServer} = require('../../index');
const usersModel = require('../../scr/infrastructure/models/usersModel');

describe('Test Products Endponits', () => {
  let server;
  beforeAll(async () => {
    server = startServer();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    server.close();
  });

  describe('createProduct', () => {
    beforeAll(async() => {
      const userResponse = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Matias',
        email: 'matias@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });

      const loginResponse = await request(app)
      .post('/api/v1/auth/logIn')
      .send({
        email: 'matias@gmail.com',
        password: '123456',
      });

      token = loginResponse.body.token;

    });
    it('should create new product', async () => {
      const response = await request(app)
      .post('/api/v1/products/')
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({ 
        productName: 'Lavadora Industrial',
        description: 'Hermosa cafetera lavadora Industrial, muy potente y facil de usar',
        url: 'https://example.com/product',
        tags: ['Hogar', 'Electrodomesticos']
      });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('should return 401 if token is invalid', async () => {
      const response = await request(app)
      .post('/api/v1/products/')
      .set('Authorization', `Bearer ${token+"1"}`) // Agrega el token invalido
      .send({ 
        productName: 'Lavadora Portatil',
        description: 'Hermosa cafetera lavadora portatil, ligera y facil de usar',
        url: 'https://example.com/product',
        tags: ['Hogar', 'Electrodomesticos']
      });

      expect(response.status).toBe(401);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('should return 409 if product already exists', async () => {
      const response = await request(app)
      .post('/api/v1/products/')
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({ 
        productName: 'Lavadora Industrial',
        description: 'Hermosa cafetera lavadora Industrial, muy potente y facil de usar',
        url: 'https://example.com/product',
        tags: ['Hogar', 'Electrodomesticos']
      });

      expect(response.status).toBe(409);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('should return 400 the json body is poorly structured', async () => {
      const response = await request(app)
      .post('/api/v1/products/')
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      //Enviamos un Body mal estructurado
      .send({ 
        pproductName: 'Lavadora Industrial',
        ddescription: 'Hermosa cafetera lavadora Industrial, muy potente y facil de usar',
        url: 'https://example.com/product',
        tags: ['Hogar', 'Electrodomesticos']
      });

      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe('updateProduct', () => {
    beforeAll(async() => {
      const userResponse = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Nicol',
        email: 'nicol@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });

      const loginResponse = await request(app)
      .post('/api/v1/auth/logIn')
      .send({
        email: 'nicol@gmail.com',
        password: '123456',
      });

      token = loginResponse.body.token;

      const productResponse = await request(app)
      .post('/api/v1/products/')
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({ 
        productName: 'Secadora Industrial',
        description: 'Hermosa secadora industrial, muy potente y facil de usar',
        url: 'https://example.com/product',
        tags: ['Hogar', 'Electrodomesticos']
      });
      productId = productResponse.body.product.id;

    });
    it('should update an existing product', async () => {
      const response = await request(app)
      .put(`/api/v1/products/${productId}`) // Utilizamos el ID del producto creado
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({ 
        productName: 'Secadora portatil',
        description: 'Hermosa secadora portatil, muy ligera y facil de usar',
        url: 'https://example.com/product',
        tags: ['Hogar', 'Electrodomesticos']
      });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('should return 404 if the product you want to modify is not in your product list', async () => {
      const response = await request(app)
      .put(`/api/v1/products/${productId+"1"}`) // Utilizamos el ID diferente
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({ 
        productName: 'Secadora portatil',
        description: 'Hermosa secadora portatil, muy ligera y facil de usar',
        url: 'https://example.com/product',
        tags: ['Hogar', 'Electrodomesticos']
      });

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('should return 401 if token is invalid', async () => {
      const response = await request(app)
      .put(`/api/v1/products/${productId}`) // Utilizamos el ID del producto creado
      .set('Authorization', `Bearer ${token+"1"}`) // Agrega el token invalido
      .send({ 
        productName: 'Secadora portatil',
        description: 'Hermosa secadora portatil, muy ligera y facil de usar',
        url: 'https://example.com/product',
        tags: ['Hogar', 'Electrodomesticos']
      });

      expect(response.status).toBe(401);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
    it('should return 400 the json body is poorly structured', async () => {
      const response = await request(app)
      .put(`/api/v1/products/${productId}`) // Utilizamos el ID del producto creado
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({ 
        pproductName: 'Secadora portatil',
        ddescription: 'Hermosa secadora portatil, muy ligera y facil de usar',
        url: 'https://example.com/product',
        tags: ['Hogar', 'Electrodomesticos']
      });

      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe('deleteProduct', () => {
    beforeAll(async() => {
      const userResponse = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Antonia',
        email: 'antonia@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });

      const loginResponse = await request(app)
      .post('/api/v1/auth/logIn')
      .send({
        email: 'antonia@gmail.com',
        password: '123456',
      });

      token = loginResponse.body.token;

      const productResponse = await request(app)
      .post('/api/v1/products/')
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({ 
        productName: 'Secadora Industrial',
        description: 'Hermosa secadora industrial, muy potente y facil de usar',
        url: 'https://example.com/product',
        tags: ['Hogar', 'Electrodomesticos']
      });
      productId = productResponse.body.product.id;

    });
    it('should delete an existing product', async () => {
      const response = await request(app)
      .delete(`/api/v1/products/${productId}`) // Utilizamos el ID del producto creado
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({});

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('should return 404 if the product you want to delete is not in your product list', async () => {
      const response = await request(app)
      .delete(`/api/v1/products/${productId+"1"}`) // Utilizamos el ID diferente
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({});

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('should return 401 if token is invalid', async () => {
      const response = await request(app)
      .delete(`/api/v1/products/${productId}`) // Utilizamos el ID del producto creado
      .set('Authorization', `Bearer ${token+"1"}`) // Agrega el token invalido
      .send({});

      expect(response.status).toBe(401);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
    
  });
  
  describe('getProductById', () => {
    beforeAll(async() => {
      const userResponse = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Marlon',
        email: 'marlon@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });

      const loginResponse = await request(app)
      .post('/api/v1/auth/logIn')
      .send({
        email: 'marlon@gmail.com',
        password: '123456',
      });

      token = loginResponse.body.token;

      const productResponse = await request(app)
      .post('/api/v1/products/')
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({ 
        productName: 'Lampara Industrial',
        description: 'Hermosa lampara industrial, muy potente y facil de usar',
        url: 'https://example.com/product',
        tags: ['Hogar', 'Electrodomesticos']
      });
      productId = productResponse.body.product.id;

    });
    it('should get product by productId', async () => {
      const response = await request(app)
      .get(`/api/v1/products/${productId}`) // Utilizamos el ID del producto creado
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({});

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('should return 404 if the product you want to get is not in your product list', async () => {
      const response = await request(app)
      .get(`/api/v1/products/${productId+"1"}`) // Utilizamos el ID diferente
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({});

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('should return 401 if token is invalid', async () => {
      const response = await request(app)
      .get(`/api/v1/products/${productId}`) // Utilizamos el ID del producto creado
      .set('Authorization', `Bearer ${token+"1"}`) // Agrega el token invalido
      .send({});

      expect(response.status).toBe(401);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe('searchProductsByTagOrName', () => {
    beforeAll(async() => {
      const userResponse = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Marlon',
        email: 'marlon@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });

      const loginResponse = await request(app)
      .post('/api/v1/auth/logIn')
      .send({
        email: 'marlon@gmail.com',
        password: '123456',
      });

      token = loginResponse.body.token;

      const productResponse = await request(app)
      .post('/api/v1/products/')
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({ 
        productName: 'Camara Industrial',
        description: 'Hermosa lampara industrial, muy potente y facil de usar',
        url: 'https://example.com/product',
        tags: ['Hogar', 'Electrodomesticos']
      });
      productId = productResponse.body.product.id;
      productName = productResponse.body.product.productName;
      productRateAverage = productResponse.body.product.rateAverage;
      productTag = productResponse.body.product.tags[1];

    });
    it('should get product by name', async () => {
      const response = await request(app)
      .get(`/api/v1/searchProducts?searchKey=${productTag}`) // Utilizamos el tag del producto creado
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({});

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
    it('should get product by tag', async () => {
      const response = await request(app)
      .get(`/api/v1/searchProducts?searchKey=${productName}`) // Utilizamos el nombre del producto creado
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({});

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
    it('should get product by rateAverage', async () => {
      const response = await request(app)
      .get(`/api/v1/searchProducts?searchKey=${productRateAverage}`) // Utilizamos la calificaciòn promedio producto creado
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({});

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
    it('should return 401 if token is invalid', async () => {
      const response = await request(app)
      .get(`/api/v1/searchProducts?searchKey=${productRateAverage}`) // Utilizamos la calificaciòn promedio producto creado
      .set('Authorization', `Bearer ${token+"1"}`) // Agrega el token invalido
      .send({});

      expect(response.status).toBe(401);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
    it('should return 404 if no products found matching the search criteria', async () => {
      const response = await request(app)
      .get('/api/v1/searchProducts?searchKey=Licuadora') // Utilizamos el nombre que no existe
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({});

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe('getProducts', () => {
    beforeAll(async() => {
      const userResponse = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Marlon',
        email: 'marlon@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });

      const loginResponse = await request(app)
      .post('/api/v1/auth/logIn')
      .send({
        email: 'marlon@gmail.com',
        password: '123456',
      });

      token = loginResponse.body.token;

      const productResponse = await request(app)
      .post('/api/v1/products/')
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({ 
        productName: 'Grua Industrial',
        description: 'Hermosa grua industrial, muy potente y facil de usar',
        url: 'https://example.com/product',
        tags: ['Hogar', 'Electrodomesticos']
      });
    });
    it('should get all product', async () => {
      const response = await request(app)
      .get('/api/v1/products/')
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({});

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
    it('should return 401 if token is invalidd', async () => {
      const response = await request(app)
      .get('/api/v1/products/')
      .send({});

      expect(response.status).toBe(401);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe('searchRateAverageByProductId', () => {
    beforeAll(async() => {
      const userResponse = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Marlon',
        email: 'marlon@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });

      const loginResponse = await request(app)
      .post('/api/v1/auth/logIn')
      .send({
        email: 'marlon@gmail.com',
        password: '123456',
      });

      token = loginResponse.body.token;

      const productResponse = await request(app)
      .post('/api/v1/products/')
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({ 
        productName: 'Equipo Industrial',
        description: 'Hermosa equipo industrial, muy potente y facil de usar',
        url: 'https://example.com/product',
        tags: ['Hogar', 'Electrodomesticos']
      });
      productId = productResponse.body.product.id;
      console.log(productId);
    });
    it('should get rateAverage by productId', async () => {
      const response = await request(app)
      .get(`/api/v1/products/searchRateAverage/${productId}`) // Utilizamos el id del producto creado
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({});

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
    it('should return 401 if token is invalid', async () => {
      const response = await request(app)
      .get(`/api/v1/products/searchRateAverage/${productId}`) // Utilizamos el id del producto creado
      .set('Authorization', `Bearer ${token+"1"}`) // Agrega el token invalido
      .send({});

      expect(response.status).toBe(401);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
    it('should return 404 if no products found matching the search criteria', async () => {
      const response = await request(app)
      .get(`/api/v1/products/searchRateAverage/${productId+"1"}`) // Utilizamos un id que no existe
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({});

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
  });
  describe('getProductsWithFilters', () => {
    beforeAll(async() => {
      const userResponse = await request(app)
      .post('/api/v1/users')
      .send({
        username: 'Angie',
        email: 'angie@gmail.com',
        password: '123456',
        bio: "Descripción del perfil de usuario"
      });

      const loginResponse = await request(app)
      .post('/api/v1/auth/logIn')
      .send({
        email: 'angie@gmail.com',
        password: '123456',
      });

      token = loginResponse.body.token;

      const productResponse = await request(app)
      .post('/api/v1/products/')
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({ 
        productName: 'Laptop Industrial',
        description: 'Hermosa Laptop industrial, muy potente y facil de usar',
        url: 'https://example.com/product',
        tags: ['Hogar', 'Electrodomesticos']
      });
      productId = productResponse.body.product.id;
      productName = productResponse.body.product.productName;
      productTag = productResponse.body.product.tags[1];

    });
    it('should get product with filter', async () => {
      const response = await request(app)
      .post('/api/v1/product/getProductsWithFilters')
      .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización al encabezado
      .send({
        "name": "Laptop Industrial",
        "tags": "Hogar",
        "minRating": 0,
        "startDate": "2024-05-10",
        "endDate": "2029-05-19"
      });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });

    it('should return 401 if token is invalid', async () => {
      const response = await request(app)
      .post('/api/v1/product/getProductsWithFilters')
      .set('Authorization', `Bearer ${token+"1"}`) // Agrega el token invalido
      .send({
        "name": "Laptop Industrial",
        "tags": "Hogar",
        "minRating": 0,
        "startDate": "2024-05-10",
        "endDate": "2029-05-19"
      });

      expect(response.status).toBe(401);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toBeInstanceOf(Object);
    });
    
  });
});
