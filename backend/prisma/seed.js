const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Создать администратора, если его ещё нет.
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@territoriya-dobroty.ru' },
    update: {
      password: hashedPassword,
      isAdmin: true,
    },
    create: {
      email: 'admin@territoriya-dobroty.ru',
      password: hashedPassword,
      isAdmin: true,
    },
  });

  console.log('Admin user created or updated:', admin.email);
  console.log('Seed completed. No default animals were added. Добавьте животных через админ-панель.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
