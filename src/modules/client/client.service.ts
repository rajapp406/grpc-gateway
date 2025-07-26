import { Injectable, OnModuleInit, Inject, Logger } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { Observable, catchError, firstValueFrom } from 'rxjs';

interface ClientServiceGrpc {
  fetchUser(data: { userId: string }): Observable<any>;
  Health(data: { }): Observable<{ status: string }>;
  Register(data: { email: string; password: string; name: string }): Observable<{ user_id: string; email: string; access_token: string }>;
  Login(data: { email: string; password: string }): Observable<{ user_id: string; email: string; access_token: string }>;
  VerifyToken(data: { token: string }): Observable<{ valid: boolean; user?: any }>;
  createOrUpdateUserProfile(data: {
    userId: string;
    age?: number;
    gender?: string;
    fitnessLevel?: string;
    goals?: string[];
    workoutFrequency?: string;
    preferredWorkouts?: string[];
  }): Observable<any>;
  getUserProfile(data: { userId: string }): Observable<any>;
}

@Injectable()
export class ClientService implements OnModuleInit {
  public clientService: ClientServiceGrpc | null = null;
  private readonly logger = new Logger(ClientService.name);

  constructor(
    @Inject('CLIENT_PACKAGE') private readonly clientRpc: ClientGrpc
  ) {
    this.logger.log('ClientService initialized');
  }

  onModuleInit() {
    this.clientService = this.clientRpc.getService<ClientServiceGrpc>('ClientService');
  }

  // Implement methods to call gRPC endpoints

  async createOrUpdateUserProfile(data: {
    userId: string;
    age?: number;
    gender?: string;
    fitnessLevel?: string;
    goals?: string[];
    workoutFrequency?: string;
    preferredWorkouts?: string[];
  }) {
    console.log('createOrUpdateUserProfile', data);
    if (!this.clientService) throw new Error('gRPC service not initialized');
    return this.clientService.createOrUpdateUserProfile(data).toPromise();
  }

  async fetchUser(userId: string) {
    this.logger.log(`Fetching user with ID: ${userId}`);
    
    if (!this.clientService) {
      this.logger.error('gRPC service not initialized');
      return { 
        status: 'error',
        message: 'Service unavailable',
        details: 'gRPC service not initialized'
      };
    }

    try {
      const result = await firstValueFrom(
        this.clientService.getUserProfile({ userId }).pipe(
          catchError(error => {
            const errorMessage = error?.message || 'Failed to fetch user';
            const errorDetails = error?.details || 'No additional details available';
            this.logger.error(`Error fetching user ${userId}: ${errorMessage}`, errorDetails);
            throw new RpcException({
              code: error?.code || 13,
              message: errorMessage,
              details: errorDetails
            });
          })
        )
      );
      
      this.logger.log(`Successfully fetched user: ${userId}`);
      return result;
    } catch (error: any) {
      const errorMessage = error?.message || 'Internal server error';
      const errorDetails = error?.details || 'An unexpected error occurred';
      this.logger.error(`Failed to fetch user ${userId}: ${errorMessage}`, errorDetails);
      return { 
        status: 'error',
        message: errorMessage,
        details: errorDetails
      };
    }
  }

  async getUserProfile(data: { userId: string }) {
    console.log('getUserProfile', data);
    if (!this.clientService) throw new Error('gRPC service not initialized');
    return this.clientService.getUserProfile({ userId: data.userId }).toPromise();
  }
}
