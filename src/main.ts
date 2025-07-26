import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoginDto } from './modules/auth/dto/login.dto';
import { RegisterDto } from './modules/auth/dto/register.dto';
import * as dotenv from 'dotenv';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  const grpcPort = process.env.GRPC_PORT;
  console.log('gRPC port:', grpcPort);
  const port = process.env.PORT;
  console.log('Port:', port);
  // Security headers
  // Type assertion used to resolve Fastify/NestJS type mismatch (safe per Fastify + NestJS docs)
  await app.register(helmet as any);

  // Global error handler
  app.useGlobalFilters(new AllExceptionsFilter());

  // Enable CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  // Global logger (Winston)
  const winstonLogger = WinstonModule.createLogger({
    level: 'debug',
    format: winston.format.combine(
      winston.format.timestamp(),
      nestWinstonModuleUtilities.format.nestLike('gRPC-Gateway', { prettyPrint: true })
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike('gRPC-Gateway', { prettyPrint: true })
        ),
      }),
    ],
  });
  app.useLogger(winstonLogger);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Fitness App API Gateway')
    .setDescription('API Gateway for Fitness Application\n\n## Authentication\nMost endpoints require a valid JWT token. Use the `/auth/login` endpoint to obtain one.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name should be used as @ApiBearerAuth('JWT-auth') in your controllers
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('user', 'User management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    operationIdFactory: (controllerKey, methodKey) => methodKey,
    extraModels: [LoginDto, RegisterDto],
  });

  SwaggerModule.setup('docs', app, document, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: (a: any, b: any) => {
        const methodsOrder = ['get', 'post', 'put', 'delete', 'patch'];
        const result = methodsOrder.indexOf(a.get('method')) - methodsOrder.indexOf(b.get('method'));
        return result === 0 ? a.get('path').localeCompare(b.get('path')) : result;
      },
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      defaultModelExpandDepth: 3,
      defaultModelsExpandDepth: 3,
      defaultModelRendering: 'example',
    },
    customSiteTitle: 'Fitness App API Documentation',
  });

  await app.listen(process.env.PORT || 3900, '0.0.0.0');
}

bootstrap();
