import { ForbiddenException } from '@nestjs/common';

export interface TokenUser {
  sub: number;
  username: string;
  role: string;
  isAdmin: boolean;
  areaId: number | null;
  area: string | null;
  mustChange: boolean;
}

export function assertAreaAccess(user: TokenUser, areaId: number): void {
  if (user.isAdmin) return;
  if (user.areaId === null || user.areaId !== areaId) {
    throw new ForbiddenException('Esta actividad no es de tu area');
  }
}