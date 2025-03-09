import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(process.env.MONGO_URI, 'main-6')
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
