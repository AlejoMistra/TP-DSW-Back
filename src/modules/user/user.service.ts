import type { User } from '../../generated/prisma/client.js'
import { UserRepository } from './user.repository.js';
import { CreateUserInput, UserResponse, UserResponseSchema, UpdateUserInput } from './user.schemas.js';
import { ConflictError, NotFoundError } from '../../utils/errors.js';

export class UserService {
  constructor(
    private readonly userRepository: UserRepository
  ){}

  async getAll(): Promise<UserResponse[]> {
    const users = await this.userRepository.getAll();
    return users.map((user) => this.toResponse(user));
  }
  
  async getById(id: number): Promise<UserResponse | null> {
    const user = await this.userRepository.getOne(id);
    if (!user) {
      throw new NotFoundError(`Usuario con id ${id} no encontrado`);
    }
    return this.toResponse(user);
  }

  async create(input: CreateUserInput): Promise<UserResponse> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('El email ingresado ya existe');
    }
    
    const user = await this.userRepository.add(input);
    return this.toResponse(user);
  }

  async update(id: number, input: UpdateUserInput): Promise<UserResponse> {
    const user = await this.userRepository.getOne(id);
    if (!user) {
      throw new NotFoundError(`Usuario con id ${id} no encontrado`);
    }

    if (input.email && input.email !== user.email) {
      const existing = await this.userRepository.findByEmail(input.email);
      if (existing) {
        throw new ConflictError('El email ingresado ya existe');
      }
    }

    const updatedUser = await this.userRepository.update(id, input);
    return this.toResponse(updatedUser);
  }

  async delete(id: number): Promise<void> {
    const user = await this.userRepository.getOne(id);
    if(!user) {
      throw new NotFoundError(`Usuario con id ${id} no encontrado`);
    }
    await this.userRepository.delete(id);
  }

  private toResponse(user: User): UserResponse {
    return UserResponseSchema.parse(user);
  }
}