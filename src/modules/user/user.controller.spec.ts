import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUser: jest.fn().mockResolvedValue({ user_id: '1', email: 'test@example.com', name: 'Test User' }),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: (ctx: ExecutionContext) => true })
      .compile();
    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get user by id', async () => {
    const result = await controller.getUserById('1');
    expect(result).toEqual({ user_id: '1', email: 'test@example.com', name: 'Test User' });
  });

  it('should get user by email', async () => {
    const result = await controller.getUserByEmail('test@example.com');
    expect(result).toEqual({ user_id: '1', email: 'test@example.com', name: 'Test User' });
  });
});
