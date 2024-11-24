import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { LoggingService } from './logging/logging.service';
import { CustomExceptionFilter } from './filters/custom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;
  const loggingService = app.get(LoggingService);
  app.useGlobalFilters(new CustomExceptionFilter(loggingService));
  const config = new DocumentBuilder()
    .setTitle('Music library example')
    .setDescription('The music API description')
    .setVersion('1.0')
    .build();
  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  process.on('uncaughtException', (error) => {
    loggingService.logCriticalError('Uncaught Exception', error.stack);
  });

  process.on(
    'unhandledRejection',
    (reason: unknown, promise: Promise<unknown>) => {
      if (reason instanceof Error) {
        loggingService.logCriticalError(
          'Unhandled Rejection',
          reason.stack || 'No stack trace',
        );
      } else {
        loggingService.logCriticalError(
          'Unhandled Rejection',
          'Unknown rejection reason',
        );
      }
    },
  );
  await app.listen(port);
}
bootstrap();
