import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const logger = new Logger();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'log', 'verbose', 'warn'],
  });
  app.enableCors();
  logger.log('hello this is lola', process.env.PORT, "dsf");
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
