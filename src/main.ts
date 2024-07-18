import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupRedoc } from './redoc.middleware';

declare const module: any;

const current_version = '1.0';
const path_current_version = 'v1';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(`api/${path_current_version}`);

  const options = new DocumentBuilder()
    .setTitle('SpotSync API')
    .setDescription('SpotSync API documentation')
    .setVersion(current_version)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  setupRedoc(app);

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
