import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ALLOW_MUST_CHANGE } from './allow-must-change.decorator';
import { ALL_PERMISSIONS } from './permissions';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const header: string = req.headers['authorization'] ?? '';
    const [type, token] = header.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Falta sesion');
    }

    let payload: { sub: number; tv?: number };
    try {
      payload = this.jwt.verify(token);
    } catch {
      throw new UnauthorizedException('Sesion invalida o vencida');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { role: true, area: true },
    });
    if (!user || !user.active) {
      throw new UnauthorizedException('Sesion invalida');
    }
    if (payload.tv !== user.tokenVersion) {
      throw new UnauthorizedException('Sesion invalida');
    }

    if (user.mustChangePassword) {
      const allowed = this.reflector.getAllAndOverride<boolean>(
        ALLOW_MUST_CHANGE,
        [ctx.getHandler(), ctx.getClass()],
      );
      if (!allowed) {
        throw new ForbiddenException('Debes cambiar tu contrasena primero');
      }
    }

    req.user = {
      sub: user.id,
      username: user.username,
      role: user.role.name,
      isAdmin: user.role.isAdmin,
      areaId: user.areaId,
      area: user.area?.name ?? null,
      fullName: user.fullName,
      discountPct: user.discountPct,
      docType: user.docType,
      docNumber: user.docNumber,
      mustChange: user.mustChangePassword,
      permissions: user.role.isAdmin ? ALL_PERMISSIONS : user.role.permissions,
    };
    return true;
  }
}