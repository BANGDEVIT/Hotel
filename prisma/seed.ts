import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.role.createMany({
    data: [
      { name: 'admin' },
      { name: 'customer' },
      { name: 'staff' },
      { name: 'manager' },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seed roles thành công');

  // Lấy role manager
  const managerRole = await prisma.role.findUnique({
    where: { name: 'manager' },
  });

  // Tạo account manager
  const hashPassword = await bcrypt.hash('Manager@123', 10);

  const account = await prisma.account.upsert({
    where: { email: 'manager@hotel.com' },
    update: {},
    create: {
      email: 'manager@hotel.com',
      hash_password: hashPassword,
      is_active: true,
      role_account: {
        create: { role_id: managerRole.id },
      },
    },
  });

  // Tạo employee cho manager
  await prisma.employee.upsert({
    where: { account_id: account.id },
    update: {},
    create: {
      account: {
        connect: { id: account.id }, // ← connect thay vì account_id
      },
      first_name: 'Manager',
      last_name: 'Hotel',
      position: 'manager',
      phone: '1234567890',
      gender: 'male',
      hired_date: new Date('2024-01-01'),
      salary: 10000000,
    },
  });

  console.log('✅ Seed manager thành công');
  console.log('📧 Email: manager@hotel.com');
  console.log('🔑 Password: Manager@123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
