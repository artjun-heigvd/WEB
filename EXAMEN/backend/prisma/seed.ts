import { PrismaClient } from '@prisma/client';
import * as argon2id from 'argon2';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { username: 'user' as string },
    update: {},
    create: {
      username: 'user',
      password: await argon2id.hash('pass' as string),
    },
  });

  await prisma.book.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' as string },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      title: 'Vagabondes, voleuse, vicieuses',
      author: 'Véronique Blanchard',
    },
  });

  await prisma.book.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' as string },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      title: "Une pluie d'oiseaux",
      author: 'Marielle Macé',
    },
  });

  await prisma.book.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' as string },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      title: 'Mémoires',
      author: 'Louise Michel',
    },
  });

  console.log('Database seeded with default data');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
