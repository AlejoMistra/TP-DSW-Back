import { prisma } from '../../lib/prisma.js';
import { CreateUserInput, UpdateUserInput } from './user.schemas.js';
import { Prisma, User } from '../../generated/prisma/client.js';

type DbClient = Prisma.TransactionClient | typeof prisma;
type CreateUserData = Omit<CreateUserInput, 'userId'>;

export class UserRepository {
  async getAll(): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        deletedAt: null
      }
    });
  }

  async getOne(id: number): Promise<User | null> {
    return prisma.user.findFirst({
      where: {id, deletedAt: null}
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({where: {email}});
  }

  async add(data: CreateUserData, db: DbClient = prisma): Promise<User> {
    return db.user.create({ data: data});
  }

  async update(id: number, data: Omit<UpdateUserInput, 'userId'>, db: DbClient = prisma): Promise<User> {
    return db.user.update({
      where: { id },
      data: data,
    });
  }

  async delete(id: number, db: DbClient = prisma): Promise<void> {
    await db.user.update({
      where: { id },
      data: { deletedAt: new Date() }
    })
  }
}

