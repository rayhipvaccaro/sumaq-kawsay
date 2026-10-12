import { ForbiddenException } from '@nestjs/common';

export interface TokenUser {
  sub: number;
  username: string;
  role: string;
  isAdmin: boolean;
  area: string | null;
  mustChange: boolean;
}

export function assertAreaAccess(user: TokenUser, area: string): void {
  if (user.isAdmin) return;
  if (!user.area || user.area.trim().toLowerCase() !== area.trim().toLowerCase()) {
    throw new ForbiddenException('Esta actividad no es de tu area');
  }
}