import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { RegisterDto } from './dto/register.dto';

interface AuthServiceGrpc {
  fetchUser(data: { userId: string }): Observable<any>;
  Health(data: { }): Observable<{ status: string }>;
  login(data: { email: string; password: string }): Observable<{ user_id: string; email: string; access_token: string }>;
  createUser(data: RegisterDto): Observable<{ user_id: string; email: string; access_token: string }>;
  Login(data: { email: string; password: string }): Observable<{ user_id: string; email: string; access_token: string }>;
  VerifyToken(data: { accessToken: string }): Observable<{ valid: boolean; user?: any }>;
  validateToken(data: { accessToken: string }): Observable<{ valid: boolean; user?: any }>;
}

@Injectable()
export class AuthService implements OnModuleInit {
  public grpcService?: AuthServiceGrpc;

  constructor(
    @Inject('AUTH_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.grpcService = this.client.getService<AuthServiceGrpc>('ValidateService');
  }

  // Implement methods to call gRPC endpoints

  async verifyToken(data: { accessToken: string }) {
    if (!this.grpcService) throw new Error('gRPC service not initialized');
    return this.grpcService.validateToken(data).toPromise();
   // return this.grpcService.VerifyToken(data).toPromise();
  }

  async register(data: RegisterDto) {
    console.log('register service', data);
    if (!this.grpcService) throw new Error('gRPC service not initialized');
    return this.grpcService.createUser(data).toPromise();
  }

  async login(data: { email: string; password: string }) {
    if (!this.grpcService) throw new Error('gRPC service not initialized');
    return this.grpcService.login(data).toPromise();
  }
}
