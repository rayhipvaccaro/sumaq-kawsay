import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const header: string = req.headers['authorization'] ?? '';
    const [type, token] = header.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Falta sesion');
    }

    let payload: { sub: number };
    try {
      payload = this.jwt.verify(token);
    } catch {
      throw new UnauthorizedException('Sesion invalida o vencida');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { role: true },
    });
    if (!user || !user.active) {
      throw new UnauthorizedException('Sesion invalida');
    }

    req.user = {
      sub: user.id,
      username: user.username,
      role: user.role.name,
      isAdmin: user.role.isAdmin,
      area: user.area,
      mustChange: user.mustChangePassword,
    };
    return true;
  }
}