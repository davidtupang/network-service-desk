import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(){
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  app.use(rateLimit({windowMs:60*1000,max:200}));
  const config = new DocumentBuilder().setTitle('Business Service').setVersion('1.0').build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, doc);
  await app.listen(process.env.PORT || 3001);
  console.log('Business service listening on', await app.getUrl());
}
bootstrap();
