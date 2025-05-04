import * as dotenv from 'dotenv';
import path from 'path';
import swaggerAutogen from 'swagger-autogen';
dotenv.config();

const doc = {
  info: {
    version: 'v1.0.0',
    title: 'E-commerce API',
    description: 'E-commerce API documentation',
  },
  host: process.env.BASE_URL || 'localhost:4000',
  schemes: ['http', 'https'],
  servers: [
    {
      url: 'http://localhost:4000/api',
      description: 'Local HTTP'
    },
    {
      url: 'https://localhost:4000/api',
      description: 'Local HTTPS'
    }
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer'
      }
    },
    schemas: {},
  }
};

const endPointFiles = [path.join(__dirname, '../../../../apps/ecom/backend/routes/*.routes.ts')];
const outputFile = path.join(__dirname, '../../../../../swaggerApi.json');
swaggerAutogen({ openapi: '3.0.0' })(outputFile, endPointFiles, doc);