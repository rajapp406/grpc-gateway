import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface UserServiceGrpc {
  Health(data: { }): Observable<{ status: string }>;
  GetUser(data: { id?: string; email?: string }): Observable<{ user_id: string; email: string; name: string }>;
}

@Injectable()
export class UserService implements OnModuleInit {
  public grpcService?: UserServiceGrpc;

  constructor(@Inject('USER_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.grpcService = this.client.getService<UserServiceGrpc>('IdentityService');
  }

  // Implement methods to call gRPC endpoints

  async getUser(data: { id?: string; email?: string }) {
    if (!this.grpcService) throw new Error('gRPC service not initialized');
    return this.grpcService.GetUser(data).toPromise();
  }
}
