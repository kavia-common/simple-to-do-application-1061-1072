const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      version: '1.0.0',
      description: 'REST API for a simple Todo application (Express + MongoDB).',
    },
    tags: [
      { name: 'Health', description: 'Service health' },
      { name: 'Todos', description: 'Todo management' },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
