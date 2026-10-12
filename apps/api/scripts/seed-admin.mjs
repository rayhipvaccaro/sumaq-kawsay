import pkg from '@prisma/client';
import bcrypt from 'bcryptjs';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const password = process.env.ADMIN_PASSWORD;
if (!password || password.length < 10) {
  console.error('ADMIN_PASSWORD falta o es corta (min 10).');
  process.exit(1);
}

const role = await prisma.role.upsert({
  where: { name: 'Administrador' },
  update: {},
  create: {
    name: 'Administrador',
    description: 'Control total del sistema',
    isAdmin: true,
  },
});

const existing = await prisma.user.findUnique({ where: { username: 'admin' } });
if (existing) {
  console.log('Usuario admin ya existe. No toco nada.');
} else {
  const user = await prisma.user.create({
    data: {
      username: 'admin',
      fullName: 'Administrador General',
      passwordHash: await bcrypt.hash(password, 12),
      roleId: role.id,
      mustChangePassword: true,
    },
  });
  await prisma.auditLog.create({
    data: { userId: user.id, action: 'SEED_ADMIN', detail: 'Admin inicial creado' },
  });
  console.log('Admin creado. id =', user.id);
}

await prisma.$disconnect();