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
          url: process.env.CLIENT_SERVICE_URL,
          loader: {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
            includeDirs: [PROTO_DIR],
          },
          channelOptions: {
            'grpc.dns_min_time_between_resolutions_ms': 5000,
            'grpc.enable_retries': 1,
            'grpc.keepalive_timeout_ms': 10000,
          },
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
