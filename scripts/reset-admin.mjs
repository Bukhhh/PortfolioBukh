import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getArg(name) {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length).trim() : '';
}

function fail(message) {
  console.error(`\n[admin:reset] ${message}`);
  process.exit(1);
}

async function main() {
  const username = getArg('username') || process.env.ADMIN_RESET_USERNAME || 'admin';
  const password = getArg('password') || process.env.ADMIN_RESET_PASSWORD || '';

  if (!password) {
    fail('Missing password. Use --password=YourStrongPassword or set ADMIN_RESET_PASSWORD in .env');
  }

  if (!/^[a-zA-Z0-9_]{1,64}$/.test(username)) {
    fail('Invalid username format. Use only letters, numbers, and underscore.');
  }

  if (password.length < 8) {
    fail('Password must be at least 8 characters long.');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
    select: { id: true, username: true, updatedAt: true },
  });

  console.log('[admin:reset] Admin credentials updated successfully.');
  console.log(`[admin:reset] Username: ${admin.username}`);
  console.log(`[admin:reset] Admin ID: ${admin.id}`);
}

main()
  .catch((error) => {
    console.error('\n[admin:reset] Failed to reset admin credentials.');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
