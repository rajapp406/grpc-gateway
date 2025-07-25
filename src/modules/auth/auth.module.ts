import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import * as dotenv from 'dotenv';
import { checkProto, validateProto, PROTO_DIR } from '../../common/utils/protos';

dotenv.config();


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'check',
          protoPath:checkProto,
          url: 'localhost:' + '50588',
        },
      },
      {
        name: 'VALIDATE_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'validate',
          protoPath: validateProto,
          url: 'localhost:' + process.env.VALIDATE_SERVICE_PORT,
        },
      }
    ]),
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
