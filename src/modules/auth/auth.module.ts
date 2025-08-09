import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import * as dotenv from 'dotenv';
import { checkProto, validateProto, PROTO_DIR } from '../../common/utils/protos';
import { ConfigModule, ConfigService } from '@nestjs/config';

dotenv.config();


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'check',
            protoPath: checkProto,
            url: process.env.CHECK_SERVICE_URL,
            loader: {
              keepCase: true,
              longs: String,
              enums: String,
              defaults: true,
              oneofs: true,
            },
            channelOptions: {
              'grpc.keepalive_time_ms': 10000,
              'grpc.keepalive_timeout_ms': 5000,
              'grpc.keepalive_permit_without_calls': 1,
              'grpc.http2_max_pings_without_data': 0,
              'grpc.max_send_message_length': 1024 * 1024 * 50,
              'grpc.max_receive_message_length': 1024 * 1024 * 50,
        },
          },
      },
    ]),
    ConfigModule.forRoot(),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {
  constructor() {
    console.log('AuthModule initialized with proto directory:', PROTO_DIR);
  }
}
