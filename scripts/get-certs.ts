import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const achievements = await prisma.achievement.findMany({
    orderBy: { order: 'asc' }
  });
  console.log(JSON.stringify(achievements, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
