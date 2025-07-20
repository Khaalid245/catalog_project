import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Catalog API',
      version: '1.0.0',
      description: 'API for managing e-commerce products',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Wireless Headphones' },
            price: { type: 'number', example: 99.99 },
            variants: {
              type: 'array',
              items: { $ref: '#/components/schemas/Variant' }
            }
          }
        },
        Variant: {
          type: 'object',
          properties: {
            sku: { type: 'string', example: 'HP-001-BLACK' },
            color: { type: 'string', example: 'Black' },
            stock: { type: 'number', example: 50 }
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '5f8d04b3ab35a73ab8812345' },
            name: { type: 'string', example: 'Electronics' }
          }
        }
      }
    }
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js'
  ],
};

const specs = swaggerJsdoc(options);

export default function setupSwagger(app) {
  // Swagger UI page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  
  // Docs in JSON format
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  // Debug: Log registered schemas
  console.log('Swagger schemas registered:', Object.keys(specs.components.schemas));
}