import pkg from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomInt } from 'node:crypto';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
let temp = '';
for (let i = 0; i < 14; i++) temp += CHARS[randomInt(CHARS.length)];

const user = await prisma.user.findUnique({ where: { username: 'admin' } });
if (!user) {
  console.error('No existe el usuario admin.');
  process.exit(1);
}

await prisma.user.update({
  where: { id: user.id },
  data: {
    passwordHash: await bcrypt.hash(temp, 12),
    mustChangePassword: true,
    failedAttempts: 0,
    lockedUntil: null,
    active: true,
    tokenVersion: { increment: 1 },
  },
});
await prisma.auditLog.create({
  data: { userId: user.id, action: 'ADMIN_RESET_LOCAL', detail: 'Reset por script local' },
});

console.log('Clave temporal de admin (anotala, solo se muestra una vez):', temp);
await prisma.$disconnect();
