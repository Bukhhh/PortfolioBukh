// Standalone seed script using raw pg (CJS compatible)
// Run: node prisma/seed-neon.js
require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function seed() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  console.log('🔗 Connected to Neon PostgreSQL');

  // Seed admin
  const password = process.env.ADMIN_DEFAULT_PASSWORD || 'bukhari_admin_2026';
  const hash = await bcrypt.hash(password, 12);
  await pool.query(`
    INSERT INTO "Admin" (id, username, "passwordHash", "createdAt", "updatedAt")
    VALUES (gen_random_uuid()::text, 'admin', $1, NOW(), NOW())
    ON CONFLICT (username) DO UPDATE SET "passwordHash" = $1
  `, [hash]);
  console.log('🔐 Admin seeded with bcrypt hash');

  // Seed profile
  await pool.query(`
    INSERT INTO "Profile" (id, name, title, subtitle, bio, email, location, "githubUrl", "linkedinUrl", "createdAt", "updatedAt")
    VALUES ('default-profile', 'Mohamad Bukhari', 'Computer Science Student & AI Developer', 'Building AI-Powered Solutions',
      'Final-year CS student at UiTM specializing in Machine Learning, AI, and Full-Stack Development. Passionate about AI and building intelligent systems.',
      'mohdbukhari03@gmail.com', 'Malaysia', 'https://github.com/Bukhhh', 'https://www.linkedin.com/in/bukhtech/', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, title = EXCLUDED.title
  `);
  console.log('👤 Profile seeded');

  // Seed settings
  await pool.query(`
    INSERT INTO "Settings" (id, "introEnabled", "introDuration", "introMessage", "assistantName", "assistantType", theme, "primaryColor", "siteTitle", "siteDescription", "showIntro", "createdAt", "updatedAt")
    VALUES ('default-settings', true, 6000, 'Welcome to my portfolio! I am Robo, your AI guide.', 'Robo', 'robot', 'dark', '#3b82f6', 'Mohamad Bukhari | Portfolio', 'Computer Science Student & AI Developer', true, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET "assistantName" = EXCLUDED."assistantName"
  `);
  console.log('⚙️ Settings seeded');

  await pool.end();
  console.log('✅ Seed complete!');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
