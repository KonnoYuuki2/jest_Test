import swaggerUi from 'swagger-ui-express';
import swaggereJsDoc from 'swagger-jsdoc';

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
                url: 'http://localhost:5555',
            },
        ],
    },
    
    apis: ['./src/routers/*.js'],
}

const specs = swaggereJsDoc(options);

export default {swaggerUi, specs};