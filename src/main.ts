import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ParseDatePipe } from './savings/pipe/ParseDate.pipe';
import { ParseIntPipe } from './savings/pipe/parse-int.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error'],
  });
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
