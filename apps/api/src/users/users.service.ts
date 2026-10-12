import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';

function tempPassword(len = 12): string {
  let s = '';
  for (let i = 0; i < len; i++) s += CHARS[randomInt(CHARS.length)];
  return s;
}

const publicSelect = {
  id: true,
  username: true,
  fullName: true,
  area: true,
  active: true,
  mustChangePassword: true,
  lockedUntil: true,
  lastLoginAt: true,
  createdAt: true,
  role: { select: { id: true, name: true, isAdmin: true } },
} as const;

export interface CreateUserInput {
  username: string;
  fullName: string;
  roleId: number;
  area?: string;
}

export interface CreateRoleInput {
  name: string;
  description?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private audit(actorId: number, action: string, ip?: string, detail?: string) {
    return this.prisma.auditLog.create({
      data: { userId: actorId, action, ip: ip ?? null, detail: detail ?? null },
    });
  }

  listUsers() {
    return this.prisma.user.findMany({
      orderBy: { id: 'asc' },
      select: publicSelect,
    });
  }

  async createUser(input: CreateUserInput, actorId: number, ip?: string) {
    const username = (input.username ?? '').trim().toLowerCase();
    const fullName = (input.fullName ?? '').trim();
    const area = input.area?.trim() || null;

    if (!/^[a-z0-9._-]{3,30}$/.test(username)) {
      throw new BadRequestException(
        'usuario: 3 a 30 caracteres, solo letras, numeros, punto, guion',
      );
    }
    if (!fullName) throw new BadRequestException('fullName es obligatorio');
    if (!Number.isInteger(input.roleId) || input.roleId <= 0) {
      throw new BadRequestException('roleId invalido');
    }

    const role = await this.prisma.role.findUnique({
      where: { id: input.roleId },
    });
    if (!role) throw new NotFoundException('Rol no existe');
    if (!role.isAdmin && !area) {
      throw new BadRequestException('area es obligatoria para este rol');
    }

    const temp = tempPassword();
    try {
      const user = await this.prisma.user.create({
        data: {
          username,
          fullName,
          area,
          roleId: role.id,
          passwordHash: await bcrypt.hash(temp, 12),
          mustChangePassword: true,
        },
        select: publicSelect,
      });
      await this.audit(actorId, 'USER_CREATED', ip, `usuario: ${username}`);
      return { user, tempPassword: temp };
    } catch (e) {
      if ((e as { code?: string }).code === 'P2002') {
        throw new ConflictException('Ese usuario ya existe');
      }
      throw e;
    }
  }

  async resetPassword(id: number, actorId: number, ip?: string) {
    const target = await this.prisma.user.findUnique({ where: { id } });
    if (!target) throw new NotFoundException('Usuario no existe');
    const temp = tempPassword();
    await this.prisma.user.update({
      where: { id },
      data: {
        passwordHash: await bcrypt.hash(temp, 12),
        mustChangePassword: true,
        failedAttempts: 0,
        lockedUntil: null,
      },
    });
    await this.audit(actorId, 'PASSWORD_RESET', ip, `usuario: ${target.username}`);
    return { id, username: target.username, tempPassword: temp };
  }

  async setActive(id: number, active: boolean, actorId: number, ip?: string) {
    if (typeof active !== 'boolean') {
      throw new BadRequestException('active debe ser true o false');
    }
    if (id === actorId && !active) {
      throw new BadRequestException('No puedes desactivarte a ti mismo');
    }
    const target = await this.prisma.user.findUnique({ where: { id } });
    if (!target) throw new NotFoundException('Usuario no existe');
    const user = await this.prisma.user.update({
      where: { id },
      data: { active },
      select: publicSelect,
    });
    await this.audit(
      actorId,
      active ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      ip,
      `usuario: ${target.username}`,
    );
    return user;
  }

  listRoles() {
    return this.prisma.role.findMany({ orderBy: { id: 'asc' } });
  }

  async createRole(input: CreateRoleInput, actorId: number, ip?: string) {
    const name = (input.name ?? '').trim();
    if (!name) throw new BadRequestException('name es obligatorio');
    try {
      const role = await this.prisma.role.create({
        data: {
          name,
          description: input.description?.trim() || null,
          isAdmin: false,
        },
      });
      await this.audit(actorId, 'ROLE_CREATED', ip, `rol: ${name}`);
      return role;
    } catch (e) {
      if ((e as { code?: string }).code === 'P2002') {
        throw new ConflictException('Ese rol ya existe');
      }
      throw e;
    }
  }
}