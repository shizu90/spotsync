import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupRedoc } from './redoc.middleware';

const CURRENT_VERSION = '1.0';
const PATH_CURRENT_VERSION = 'v1';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(`api/${PATH_CURRENT_VERSION}`);

  const options = new DocumentBuilder()
    .setTitle('SpotSync API')
    .setDescription('SpotSync API documentation')
    .setVersion(CURRENT_VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  setupRedoc(app);

  await app.listen(3000);
}
bootstrap();
