import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // Validate required environment variables
  const requiredEnvVars = ['DATABASE_URL', 'REDIS_URL'];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      logger.error(`Missing required environment variable: ${envVar}`);
      process.exit(1);
    }
  }
  
  const app = await NestFactory.create(AppModule);
  const env = process.env.NODE_ENV || 'development';
  
  app.enableCors({ 
    origin: process.env.NODE_ENV === 'production' 
      ? (process.env.NEXT_PUBLIC_APP_URL || 'localhost:3000')
      : true,
    credentials: true 
  });
  
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true,
    forbidNonWhitelisted: true 
  }));
  
  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  logger.log(`Server running in ${env} mode on port ${port}`);
}

bootstrap().catch((err) => {
  console.error('Failed to bootstrap application:', err);
  process.exit(1);
});
