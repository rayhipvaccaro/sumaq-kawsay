import pkg from '@prisma/client';
import bcrypt from 'bcryptjs';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const pass = process.env.NEW_ADMIN_PASSWORD ?? '';
if (pass.length < 10) {
  console.error('La clave debe tener minimo 10 caracteres.');
  process.exit(1);
}

const user = await prisma.user.findUnique({ where: { username: 'admin' } });
if (!user) {
  console.error('No existe el usuario admin.');
  process.exit(1);
}

await prisma.user.update({
  where: { id: user.id },
  data: {
    passwordHash: await bcrypt.hash(pass, 12),
    mustChangePassword: false,
    failedAttempts: 0,
    lockedUntil: null,
    active: true,
    tokenVersion: { increment: 1 },
  },
});
await prisma.auditLog.create({
  data: { userId: user.id, action: 'ADMIN_PASSWORD_SET_LOCAL', detail: 'Clave puesta por script local' },
});

console.log('Listo. Clave de admin guardada. mustChangePassword: false');
await prisma.$disconnect();
