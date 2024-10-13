import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { hostname } from 'os';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with customized settings
  app.enableCors({
    origin: [
      'https://wonge-enterprise.netlify.app',
      'http://localhost:3001',
    ], // Specify allowed origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  });

  // Correct usage of app.listen
  await app.listen(process.env.PORT || 3000, '0.0.0.0'); // Default to port 3000 if not defined
}

bootstrap();
