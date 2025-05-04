import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // EJS View setup
  const viewsPath = join(__dirname, '..', 'views');
  console.log('Views Path:', viewsPath);  // Add this to check if the path is correct

  app.setViewEngine('ejs');
  app.setBaseViewsDir(viewsPath);


  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('UUID Encryption API')
    .setDescription('Encrypt and manage UUID-based values')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);

  console.log(`🚀 Server is running on: http://localhost:3000`);
  console.log(`📘 Swagger docs available at: http://localhost:3000/api/docs`);
}
bootstrap();
