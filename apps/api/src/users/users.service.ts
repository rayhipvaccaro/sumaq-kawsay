import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { PERMISSIONS, PERMISSION_CODES } from '../auth/permissions';

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
  area: { select: { id: true, name: true } },
  active: true,
  mustChangePassword: true,
  discountPct: true,
  docType: true,
  docNumber: true,
  lockedUntil: true,
  lastLoginAt: true,
  createdAt: true,
  role: { select: { id: true, name: true, isAdmin: true, permissions: true } },
} as const;

export interface CreateUserInput {
  username: string;
  fullName: string;
  roleId: number;
  areaId?: number;
  discountPct?: number;
  docType?: string;
  docNumber?: string;
}

export interface CreateRoleInput {
  name: string;
  description?: string;
  permissions?: string[];
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
    const areaId = input.areaId ?? null;

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username) && username.length <= 160;
    if (!isEmail && !/^[a-z0-9._-]{3,30}$/.test(username)) {
      throw new BadRequestException(
        'usuario: un correo, o 3 a 30 caracteres (letras, numeros, punto, guion)',
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
    if (role.permissions.includes('area.manage') && areaId === null) {
      throw new BadRequestException('areaId es obligatorio para este rol');
    }
    if (areaId !== null) {
      if (!Number.isInteger(areaId) || areaId <= 0) {
        throw new BadRequestException('areaId invalido');
      }
      const area = await this.prisma.area.findUnique({ where: { id: areaId } });
      if (!area) throw new NotFoundException('Area no existe');
    }

    const discountPct = Math.round(Number(input.discountPct ?? 0));
    if (!Number.isFinite(discountPct) || discountPct < 0 || discountPct > 100) {
      throw new BadRequestException('descuento: de 0 a 100');
    }
    if (discountPct > 0 && !role.permissions.includes('sales.own')) {
      throw new BadRequestException('Solo el rol de agencia lleva descuento');
    }

    const temp = tempPassword();
    try {
      const user = await this.prisma.user.create({
        data: {
          discountPct,
          docType: input.docType?.trim().toUpperCase() || null,
          docNumber: input.docNumber?.trim().toUpperCase() || null,
          username,
          fullName,
          areaId: role.permissions.includes('area.manage') ? areaId : null,
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
        tokenVersion: { increment: 1 },
      },
    });
    await this.audit(actorId, 'PASSWORD_RESET', ip, `usuario: ${target.username}`);
    return { id, username: target.username, tempPassword: temp };
  }

  async setDiscount(id: number, pct: number, actorId: number, ip?: string) {
    const n = Math.round(Number(pct));
    if (!Number.isFinite(n) || n < 0 || n > 100) {
      throw new BadRequestException('descuento: de 0 a 100');
    }
    const target = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
    if (!target) throw new NotFoundException('Usuario no existe');
    if (!target.role.permissions.includes('sales.own')) {
      throw new BadRequestException('Solo el rol de agencia lleva descuento');
    }
    const user = await this.prisma.user.update({
      where: { id },
      data: { discountPct: n },
      select: publicSelect,
    });
    await this.audit(actorId, 'DISCOUNT_SET', ip, `usuario: ${target.username} -> ${n}%`);
    return user;
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
      data: { active, tokenVersion: { increment: 1 } },
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

  private cleanPerms(p?: string[]): string[] {
    if (p === undefined) return [];
    if (!Array.isArray(p)) throw new BadRequestException('permissions debe ser lista');
    const bad = p.filter((x) => !PERMISSION_CODES.includes(x));
    if (bad.length) throw new BadRequestException('Permiso invalido: ' + bad.join(', '));
    return Array.from(new Set(p));
  }

  listPermissions() {
    return PERMISSIONS;
  }

  async setRolePermissions(id: number, perms: string[], actorId: number, ip?: string) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException('Rol no existe');
    if (role.isAdmin) throw new BadRequestException('El rol Administrador no se edita');
    const permissions = this.cleanPerms(perms);
    const updated = await this.prisma.role.update({ where: { id }, data: { permissions } });
    await this.audit(actorId, 'ROLE_PERMS', ip, `rol: ${role.name}`);
    return updated;
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
          permissions: this.cleanPerms(input.permissions),
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