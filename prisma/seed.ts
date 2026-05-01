import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.role.createMany({
    data: [{ name: 'customer' }, { name: 'staff' }, { name: 'manager' }],
    skipDuplicates: true,
  });

  console.log('✅ Seed roles thành công');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
