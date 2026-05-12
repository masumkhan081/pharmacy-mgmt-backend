import prisma from "../lib/prisma";
import { IUser, IUserCreateInput, IUserUpdateInput } from "../types/user.type";
import { UserRole } from "@prisma/client";

/**
 * User Repository (Prisma implementation)
 * Handles all User persistence logic for PostgreSQL.
 */
export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user as IUser | null;
  }

  async findByUsername(username: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    return user as IUser | null;
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user as IUser | null;
  }

  async create(data: IUserCreateInput): Promise<IUser> {
    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        name: data.name,
        password: data.password,
        role: data.role as UserRole,
        staffId: data.staffId,
      },
    });
    return user as IUser;
  }

  async update(id: string, data: IUserUpdateInput): Promise<IUser> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        role: data.role as UserRole | undefined,
      },
    });
    return user as IUser;
  }

  async list(params: { skip?: number; take?: number } = {}): Promise<IUser[]> {
    const users = await prisma.user.findMany({
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
    });
    return users as IUser[];
  }
}

export default new UserRepository();
