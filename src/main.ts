import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { env } from 'process';
import { AppModule } from './app.module';
import { setupRedoc } from './redoc.middleware';

declare const module: any;

const current_version = env.APP_VERSION || '1.0.0';
const prefix = env.APP_PREFIX || 'api/v1';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix(prefix);

	const options = new DocumentBuilder()
		.setTitle('SpotSync API')
		.setDescription('SpotSync API documentation')
		.setVersion(current_version)
		.build();

	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('api', app, document);

	setupRedoc(app);

	await app.listen(env.APP_PORT || 3000);

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}
bootstrap();
