import { INestApplication } from '@nestjs/common';
import * as redoc from 'redoc-express';

export function setupRedoc(app: INestApplication) 
{
    const redocOptions = {
        title: 'SpotSync API',
        version: '1.0',
        specUrl: '/api-json'
    };

    app.use('/docs', redoc.default(redocOptions));
}