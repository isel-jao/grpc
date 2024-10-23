import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'examplePackage',
        protoPath: join(__dirname, 'proto/hero.proto'),
        url: '192.168.1.132:5000',
      },
    },
  );
  await app.listen();
}
bootstrap();
