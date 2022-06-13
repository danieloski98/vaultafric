import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ParseDatePipe } from './savings/pipe/ParseDate.pipe';
import { ParseIntPipe } from './savings/pipe/parse-int.pipe';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error'],
  });
  app.enableCors();
  app.use(morgan('combined'));
  const config = new DocumentBuilder()
    .setTitle('MONEY VAULT API')
    .setDescription('The REST Api for the money-vault platform')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  await app.listen(3000);
}
bootstrap();
