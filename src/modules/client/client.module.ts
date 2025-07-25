import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { clientProto, PROTO_DIR } from '../../common/utils/protos';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CLIENT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'client',
          protoPath: clientProto,
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
    console.log('ClientModule initialized', PROTO_DIR);
  }
}
