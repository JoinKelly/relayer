import * as dotenv from 'dotenv';
dotenv.config();
import * as config from 'config';
import helmet from 'helmet';
import { join } from 'path';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from 'src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const appPort = config.get<number>('app.port');
const appHost = config.get<string>('app.url');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.setGlobalPrefix(process.env.PREFIX);

  //Document
  const config = new DocumentBuilder()
    .setTitle('relayer_be')
    .setDescription('relayer API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document, {
    swaggerOptions: {
      filter: true,
      displayRequestDuration: true,
    },
  });

  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'src/static'));
  app.use(helmet());

  await app.listen(appPort);
  const logger = app.get(Logger);
  logger.setContext('NestApplication');
}
bootstrap();
