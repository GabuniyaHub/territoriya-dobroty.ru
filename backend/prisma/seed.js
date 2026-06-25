const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Удалить существующих животных
  await prisma.animal.deleteMany();

  // Создать администратора
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@territoriya-dobroty.ru' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@territoriya-dobroty.ru',
      password: hashedPassword,
      isAdmin: true,
    },
  });

  console.log('Admin user created:', admin.email);

  // Создать животных
  const animals = [
    { name: 'Пуша', age: '2 года', gender: 'female', image: 'photo_1_2026-04-02_23-48-40.jpg', traits: 'Ласковая, дружелюбная', description: 'Добрая девочка, любит компанию' },
    { name: 'Савелий', age: '1.5 года', gender: 'male', image: 'photo_2_2026-04-02_23-48-40.jpg', traits: 'Спокойный, ласковый', description: 'Тихий мальчик, нуждается в заботе' },
    { name: 'Изи', age: '3 года', gender: 'male', image: 'photo_3_2026-04-02_23-48-40.jpg', traits: 'Активный, весёлый', description: 'Энергичный и весёлый' },
    { name: 'Гарфилд', age: '4 года', gender: 'male', image: 'photo_4_2026-04-02_23-48-40.jpg', traits: 'Спокойный, любит внимание', description: 'Обожает ласку и внимание' },
    { name: 'Маффин', age: '1 год', gender: 'female', image: 'photo_5_2026-04-02_23-48-40.jpg', traits: 'Игривая, любопытная', description: 'Маленькая непоседа' },
    { name: 'Флин', age: '2 года', gender: 'male', image: 'photo_1_2026-04-02_23-50-01.jpg', traits: 'Энергичный, игривый', description: 'Любит бегать и играть' },
    { name: 'Мия', age: '1.5 года', gender: 'female', image: 'photo_2_2026-04-02_23-50-01.jpg', traits: 'Нежная, ласковая', description: 'Очень нежная девочка' },
    { name: 'Декабрин', age: '3 года', gender: 'male', image: 'photo_3_2026-04-02_23-50-01.jpg', traits: 'Спокойный, добрый', description: 'Добрый и верный друг' },
    { name: 'Манник', age: '4 года', gender: 'male', image: 'photo_5_2026-04-02_23-50-01.jpg', traits: 'Сладкий, как пирожок', description: 'Сахар и любовь' },
    { name: 'Чижик', age: '2 года', gender: 'male', image: 'photo_6_2026-04-02_23-50-01.jpg', traits: 'Маленький и энергичный', description: 'Маленький, но дерзкий' },
    { name: 'Марта', age: '5 лет', gender: 'female', image: 'photo_7_2026-04-02_23-50-01.jpg', traits: 'Спокойная, мудрая', description: 'Мудрая красавица' },
    { name: 'Эбби', age: '3 года', gender: 'female', image: 'photo_8_2026-04-02_23-50-01.jpg', traits: 'Активная, весёлая', description: 'Весьма активная девочка' },
    { name: 'Черника', age: '1 год', gender: 'female', image: 'photo_9_2026-04-02_23-50-01.jpg', traits: 'Ягодная сладость, игривая', description: 'Маленькая сладкая ягодка' },
    { name: 'Ирма', age: '3 года', gender: 'female', image: 'photo_2026-04-02_23-43-32.jpg', traits: 'Загадочная, нежная', description: 'Таинственная и нежная' },
    { name: 'Ласка', age: '2.5 года', gender: 'female', image: 'photo_1_2026-04-02_23-48-40.jpg', traits: 'Ласковая, привязчивая', description: 'Очень ласковая девочка' },
  ];

  for (const animal of animals) {
    const created = await prisma.animal.create({
      data: animal,
    });
    console.log(`Created animal: ${created.name}`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
