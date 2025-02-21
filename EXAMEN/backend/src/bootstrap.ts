import * as cookieParser from 'cookie-parser';
import { HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { PassportStrategy } from '@/auth/auth.constants';

export async function bootstrap(
  app: NestExpressApplication,
): Promise<NestExpressApplication> {
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // Remove unknown properties from DTOs
    }),
  );

  // https://docs.nestjs.com/security/cors
  app.enableCors();

  // https://docs.nestjs.com/techniques/session
  app.set('trust proxy', false);

  const config = new DocumentBuilder()
    .setTitle('Exam Web API')
    .setDescription('The Web Exam API description')
    .setVersion(process.env.npm_package_version as string)
    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     description: 'The JWT to access protected endpoints',
    //   },
    //   PassportStrategy.JWT,
    // )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      showExtensions: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      persistAuthorization: true,
    },
  });

  // https://docs.nestjs.com/techniques/cookies
  app.use(cookieParser());

  return app;
}
