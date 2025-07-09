import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface AuthServiceGrpc {
  Health(data: { }): Observable<{ status: string }>;
  Register(data: { email: string; password: string; name: string }): Observable<{ user_id: string; email: string; access_token: string }>;
  Login(data: { email: string; password: string }): Observable<{ user_id: string; email: string; access_token: string }>;
  VerifyToken(data: { token: string }): Observable<{ valid: boolean; user?: any }>;
}

@Injectable()
export class AuthService implements OnModuleInit {
  public grpcService?: AuthServiceGrpc;

  constructor(@Inject('AUTH_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.grpcService = this.client.getService<AuthServiceGrpc>('AuthService');
  }

  // Implement methods to call gRPC endpoints

  async verifyToken(data: { token: string }) {
    if (!this.grpcService) throw new Error('gRPC service not initialized');
    return this.grpcService.VerifyToken(data).toPromise();
  }

  async register(data: { email: string; password: string; name: string }) {
    if (!this.grpcService) throw new Error('gRPC service not initialized');
    return this.grpcService.Register(data).toPromise();
  }

  async login(data: { email: string; password: string }) {
    if (!this.grpcService) throw new Error('gRPC service not initialized');
    return this.grpcService.Login(data).toPromise();
  }
}
