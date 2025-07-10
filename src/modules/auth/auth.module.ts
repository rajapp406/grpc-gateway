import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(__dirname, '../../../proto/auth.proto'),
          url: 'localhost:' + process.env.GRPC_PORT,
        },
      },
      {
        name: 'VALIDATE_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'validate',
          protoPath: join(__dirname, '../../../../common-modules/protocol/validate.proto'),
          url: 'localhost:' + '50544',
        },
      },
    ]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {
  constructor() {
    console.log('AuthModule initialized', join(__dirname, '../../../proto/auth.proto'));
  }
}
