import swaggerUi from 'swagger-ui-express';
import swaggereJsDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'token test API',
      version: '1.0.0',
      description: 'Access / Refresh token test',
    },
    servers: [
      {
        // ! 직접 홈페이지 주소를 매핑할 필요성 http://~:3000
        url: process.env.host + process.env.port,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routers/*.js'], // 여긴 그대로 OK
};


const specs = swaggereJsDoc(options);

export default {swaggerUi, specs};