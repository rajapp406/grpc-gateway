import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CLIENT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'client',
          protoPath: join(__dirname, '../../../../common-modules/protocol/client.proto'),
          url: 'localhost:' + '50522',
        },
      },
    ]),
  ],
  providers: [ClientService],
  controllers: [ClientController],
  exports: [ClientService],
})
export class ClientModule {
  constructor() {
    console.log('ClientModule initialized', join(__dirname, '../../../../common-modules/protocol/client.proto'));
  }
}
