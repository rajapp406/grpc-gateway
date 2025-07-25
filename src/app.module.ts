import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { ClientModule } from './modules/client/client.module';
import { WorkoutModule } from './modules/workout/workout.module';


@Module({
  imports: [
    AuthModule,
    UserModule,
    ClientModule,
    WorkoutModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware, require('./common/middleware/correlation-id.middleware').CorrelationIdMiddleware)
      .forRoutes('*');
  }
}
