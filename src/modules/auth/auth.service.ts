import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface AuthServiceGrpc {
  fetchUser(data: { userId: string }): Observable<any>;
  Health(data: { }): Observable<{ status: string }>;
  login(data: { email: string; password: string }): Observable<{ user_id: string; email: string; access_token: string }>;
  Register(data: { email: string; password: string; name: string }): Observable<{ user_id: string; email: string; access_token: string }>;
  Login(data: { email: string; password: string }): Observable<{ user_id: string; email: string; access_token: string }>;
  VerifyToken(data: { token: string }): Observable<{ valid: boolean; user?: any }>;
}

@Injectable()
export class AuthService implements OnModuleInit {
  public grpcService?: AuthServiceGrpc;
  public validateService?: AuthServiceGrpc;

  constructor(
    @Inject('AUTH_PACKAGE') private readonly client: ClientGrpc,
    @Inject('VALIDATE_PACKAGE') private readonly validateClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.grpcService = this.client.getService<AuthServiceGrpc>('ValidateService');
    this.validateService = this.validateClient.getService<AuthServiceGrpc>('ValidateService');
  }

  // Implement methods to call gRPC endpoints

  async verifyToken(data: { token: string }) {
    if (!this.validateService) throw new Error('gRPC service not initialized');
    return this.validateService.VerifyToken(data).toPromise();
   // return this.grpcService.VerifyToken(data).toPromise();
  }

  async register(data: { email: string; password: string; name: string }) {
    if (!this.validateService) throw new Error('gRPC service not initialized');
    return this.validateService.Register(data).toPromise();
  }

  async login(data: { email: string; password: string }) {
    if (!this.grpcService) throw new Error('gRPC service not initialized');
    return this.grpcService.login(data).toPromise();
  }
}
