import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

const MAX_FAILS = 5;
const LOCK_MIN = 15;
const MIN_PASSWORD = 10;

export interface SessionUser {
  id: number;
  username: string;
  fullName: string;
  role: string;
  isAdmin: boolean;
  area: string | null;
}

export interface LoginResult {
  accessToken: string;
  mustChangePassword: boolean;
  user: SessionUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private audit(userId: number | null, action: string, ip?: string, detail?: string) {
    return this.prisma.auditLog.create({
      data: { userId, action, ip: ip ?? null, detail: detail ?? null },
    });
  }

  private sign(user: {
    id: number;
    username: string;
    fullName: string;
    area: string | null;
    mustChangePassword: boolean;
    role: { name: string; isAdmin: boolean };
  }): LoginResult {
    const sessionUser: SessionUser = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role.name,
      isAdmin: user.role.isAdmin,
      area: user.area,
    };
    const accessToken = this.jwt.sign({
      sub: user.id,
      username: user.username,
      role: user.role.name,
      isAdmin: user.role.isAdmin,
      area: user.area,
      mustChange: user.mustChangePassword,
    });
    return {
      accessToken,
      mustChangePassword: user.mustChangePassword,
      user: sessionUser,
    };
  }

  async login(
    usernameRaw: string,
    password: string,
    ip?: string,
  ): Promise<LoginResult> {
    const username = (usernameRaw ?? '').trim().toLowerCase();
    if (!username || !password) {
      throw new BadRequestException('usuario y contrasena son obligatorios');
    }

    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { role: true },
    });

    if (!user || !user.active) {
      await this.audit(null, 'LOGIN_FAIL', ip, `usuario: ${username}`);
      throw new UnauthorizedException('Usuario o contrasena incorrectos');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      await this.audit(user.id, 'LOGIN_BLOCKED', ip);
      throw new HttpException('Cuenta bloqueada. Intenta mas tarde.', 423);
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      const fails = user.failedAttempts + 1;
      const lock = fails >= MAX_FAILS;
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedAttempts: lock ? 0 : fails,
          lockedUntil: lock ? new Date(Date.now() + LOCK_MIN * 60_000) : null,
        },
      });
      await this.audit(user.id, lock ? 'LOCKED' : 'LOGIN_FAIL', ip);
      throw new UnauthorizedException('Usuario o contrasena incorrectos');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { failedAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
    });
    await this.audit(user.id, 'LOGIN_OK', ip);
    return this.sign(user);
  }

  async changePassword(
    userId: number,
    current: string,
    next: string,
    ip?: string,
  ): Promise<LoginResult> {
    if (!current || !next) {
      throw new BadRequestException('faltan datos');
    }
    if (next.length < MIN_PASSWORD) {
      throw new BadRequestException(
        `la contrasena nueva debe tener minimo ${MIN_PASSWORD} caracteres`,
      );
    }
    if (next === current) {
      throw new BadRequestException('la contrasena nueva debe ser distinta');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });
    if (!user || !user.active) {
      throw new UnauthorizedException('Sesion invalida');
    }
    const ok = await bcrypt.compare(current, user.passwordHash);
    if (!ok) {
      await this.audit(user.id, 'PASSWORD_CHANGE_FAIL', ip);
      throw new UnauthorizedException('Contrasena actual incorrecta');
    }

    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await bcrypt.hash(next, 12),
        mustChangePassword: false,
      },
      include: { role: true },
    });
    await this.audit(user.id, 'PASSWORD_CHANGED', ip);
    return this.sign(updated);
  }
}