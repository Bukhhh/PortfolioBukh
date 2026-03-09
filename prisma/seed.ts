import { db } from '../src/lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  // ── Create admin account with bcrypt-hashed password ──────────────────────
  // Set ADMIN_DEFAULT_PASSWORD in your .env before running this seed!
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'CHANGE_ME_NOW';
  if (adminPassword === 'CHANGE_ME_NOW') {
    console.warn('⚠️  WARNING: Using default admin password. Set ADMIN_DEFAULT_PASSWORD in .env!');
  }
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await db.admin.upsert({
    where: { username: 'admin' },
    create: { username: 'admin', passwordHash },
    update: { passwordHash },
  });
  console.log('🔐 Admin account seeded with bcrypt hash (cost factor: 12)');


  // Create/update profile
  await db.profile.upsert({
    where: { id: 'default-profile' },
    create: {
      id: 'default-profile',
      name: 'Mohamad Bukhari',
      title: 'Computer Science Student & AI Developer',
      subtitle: 'Building AI-Powered Solutions',
      bio: 'Final-year CS student at UiTM specializing in Machine Learning, AI, and Full-Stack Development. Passionate about discovering the newest AI models and building intelligent systems. Gold Medal winner for ClaRity AI project.',
      email: 'mohdbukhari03@gmail.com',
      location: 'Malaysia',
      githubUrl: 'https://github.com/Bukhhh',
      linkedinUrl: 'https://www.linkedin.com/in/bukhtech/',
      websiteUrl: 'https://bukhari.dev',
    },
    update: {
      name: 'Mohamad Bukhari',
      title: 'Computer Science Student & AI Developer',
      subtitle: 'Building AI-Powered Solutions',
      bio: 'Final-year CS student at UiTM specializing in Machine Learning, AI, and Full-Stack Development. Passionate about discovering the newest AI models and building intelligent systems. Gold Medal winner for ClaRity AI project.',
      email: 'mohdbukhari03@gmail.com',
      location: 'Malaysia',
      githubUrl: 'https://github.com/Bukhhh',
      linkedinUrl: 'https://www.linkedin.com/in/bukhtech/',
      websiteUrl: 'https://bukhari.dev',
    },
  });

  // Create/update settings with blue theme
  await db.settings.upsert({
    where: { id: 'default-settings' },
    create: {
      id: 'default-settings',
      introEnabled: true,
      introDuration: 6000,
      introMessage: "Welcome to my portfolio! I'm Robo, your AI guide. Ask me anything about Mohamad's projects, skills, and experience!",
      assistantName: 'Robo',
      assistantType: 'robot',
      theme: 'dark',
      primaryColor: '#3b82f6', // Blue
      siteTitle: 'Mohamad Bukhari | Portfolio',
      siteDescription: 'Computer Science Student & AI Developer',
      showIntro: true,
    },
    update: {
      primaryColor: '#3b82f6',
      introMessage: "Welcome to my portfolio! I'm Robo, your AI guide. Ask me anything about Mohamad's projects, skills, and experience!",
      assistantName: 'Robo',
    },
  });

  // Create Bachelor's education
  await db.education.upsert({
    where: { id: 'edu-1' },
    create: {
      id: 'edu-1',
      institution: 'UiTM Kampus Tapah',
      degree: "Bachelor of Computer Science (Honours)",
      field: 'Machine Learning & AI',
      gpa: '3.66',
      startDate: '2022',
      endDate: '2026',
      description: "Dean's List student specializing in AI and Machine Learning",
      achievements: JSON.stringify(["Dean's List (Semester 5)", 'CGPA: 3.66', 'Gold Medal - ClaRity AI Project']),
      order: 0,
    },
    update: {
      institution: 'UiTM Kampus Tapah',
      degree: "Bachelor of Computer Science (Honours)",
      field: 'Machine Learning & AI',
      gpa: '3.66',
      description: "Dean's List student specializing in AI and Machine Learning. Relevant Coursework: Mobile Programming (A), Parallel Processing (A), Algorithm Analysis & Design (A), Project Formulation (A)",
      achievements: JSON.stringify(["Dean's List (Semester 5)", 'CGPA: 3.66', 'Gold Medal - ClaRity AI Project']),
    },
  });

  // Create Diploma education
  await db.education.upsert({
    where: { id: 'edu-2' },
    create: {
      id: 'edu-2',
      institution: 'UiTM',
      degree: 'Diploma of Computer Science',
      field: 'Computer Science',
      gpa: '3.8',
      startDate: '2019',
      endDate: '2022',
      description: "Dean's List for 4 semesters. Received Vice-Chancellor's Award (Anugerah Naib Canselor)",
      achievements: JSON.stringify(["Dean's List × 4 Semesters", "Vice-Chancellor's Award (ANC)"]),
      order: 1,
    },
    update: {
      institution: 'UiTM',
      degree: 'Diploma of Computer Science',
      field: 'Computer Science',
      description: "Dean's List for 4 semesters. Received Vice-Chancellor's Award (Anugerah Naib Canselor). Relevant Coursework: Object-Oriented Programming (A), Visual Programming (A), Introduction to Web & Mobile (A), Digital Electronics (A-), Discrete Mathematics (A)",
      achievements: JSON.stringify(["Dean's List × 4 Semesters", "Vice-Chancellor's Award (ANC)"]),
    },
  });

  // Create experiences
  await db.experience.upsert({
    where: { id: 'exp-1' },
    create: {
      id: 'exp-1',
      title: 'Intern',
      company: 'MADANI IT SOLUTION',
      description: 'Developed SEHMAIPP Admin Dashboard to centralize Islamic real estate records. Engineered Asset Registration modules and implemented RBAC for secure data handling. Tech: Laravel 10, MySQL, Chart.js.',
      startDate: '2024',
      type: 'internship',
      current: true,
      order: 0,
    },
    update: {
      description: 'Developed SEHMAIPP Admin Dashboard to centralize Islamic real estate records. Engineered Asset Registration modules and implemented RBAC for secure data handling. Tech: Laravel 10, MySQL, Chart.js.',
      current: true,
    },
  });

  await db.experience.upsert({
    where: { id: 'exp-2' },
    create: {
      id: 'exp-2',
      title: 'Barista & Crew Trainer',
      company: 'The Loca Cafe',
      description: 'Trained new crew members on coffee preparation and customer service standards. Managed inventory and ensured quality control.',
      startDate: '2023',
      endDate: '2023',
      type: 'part-time',
      current: false,
      order: 1,
    },
    update: {
      title: 'Barista & Crew Trainer',
      company: 'The Loca Cafe',
      description: 'Trained new crew members on coffee preparation and customer service standards. Managed inventory and ensured quality control.',
    },
  });

  await db.experience.upsert({
    where: { id: 'exp-3' },
    create: {
      id: 'exp-3',
      title: 'Waiter & Cashier',
      company: 'Tasty Theory Cafe',
      description: 'Handled customer orders, payments, and ensured excellent dining experience. Managed POS system and cash handling.',
      startDate: '2022',
      endDate: '2022',
      type: 'part-time',
      current: false,
      order: 2,
    },
    update: {
      title: 'Waiter & Cashier',
      company: 'Tasty Theory Cafe',
      description: 'Handled customer orders, payments, and ensured excellent dining experience. Managed POS system and cash handling.',
    },
  });

  // Create comprehensive skills
  const skills = [
    // AI & ML
    { name: 'Python', category: 'AI & ML', proficiency: 90 },
    { name: 'Scikit-Learn', category: 'AI & ML', proficiency: 85 },
    { name: 'NLP', category: 'AI & ML', proficiency: 80 },
    { name: 'Computer Vision', category: 'AI & ML', proficiency: 80 },
    { name: 'TensorFlow', category: 'AI & ML', proficiency: 75 },
    { name: 'Roboflow', category: 'AI & ML', proficiency: 75 },
    
    // Frontend
    { name: 'React', category: 'Frontend', proficiency: 85 },
    { name: 'Next.js', category: 'Frontend', proficiency: 85 },
    { name: 'TypeScript', category: 'Frontend', proficiency: 80 },
    { name: 'JavaScript', category: 'Frontend', proficiency: 85 },
    { name: 'Tailwind CSS', category: 'Frontend', proficiency: 85 },
    { name: 'HTML5', category: 'Frontend', proficiency: 90 },
    { name: 'CSS3', category: 'Frontend', proficiency: 90 },
    
    // Backend
    { name: 'Node.js', category: 'Backend', proficiency: 80 },
    { name: 'Express.js', category: 'Backend', proficiency: 75 },
    { name: 'FastAPI', category: 'Backend', proficiency: 80 },
    { name: 'Laravel', category: 'Backend', proficiency: 75 },
    { name: 'PHP', category: 'Backend', proficiency: 70 },
    
    // Database
    { name: 'PostgreSQL', category: 'Database', proficiency: 80 },
    { name: 'MySQL', category: 'Database', proficiency: 80 },
    { name: 'Firebase', category: 'Database', proficiency: 80 },
    { name: 'Supabase', category: 'Database', proficiency: 75 },
    { name: 'Prisma ORM', category: 'Database', proficiency: 80 },
    
    // Languages
    { name: 'Java', category: 'Languages', proficiency: 75 },
    { name: 'SQL', category: 'Languages', proficiency: 85 },
    
    // Tools
    { name: 'Git', category: 'Tools', proficiency: 90 },
    { name: 'GitHub', category: 'Tools', proficiency: 90 },
    { name: 'Docker', category: 'Tools', proficiency: 70 },
    { name: 'Chart.js', category: 'Tools', proficiency: 80 },
    { name: 'Capacitor', category: 'Tools', proficiency: 70 },
  ];

  for (let i = 0; i < skills.length; i++) {
    await db.skill.upsert({
      where: { id: `skill-${i}` },
      create: {
        id: `skill-${i}`,
        ...skills[i],
        order: i,
      },
      update: {
        proficiency: skills[i].proficiency,
        category: skills[i].category,
      },
    });
  }

  // Create all 4 projects with full details and multiple images
  const projects = [
    {
      id: 'project-0',
      title: 'KerjayaTechMY',
      description: 'Smart Resume Analyzer Pro - AI recruitment engine with hybrid NLP pipeline achieving 80.1% accuracy. Features real-time analytics dashboard for efficient candidate screening and recruitment process optimization.',
      longDescription: 'An AI-powered recruitment platform that addresses inefficient manual recruitment processes and high volumes of resumes to screen. Uses a hybrid NLP pipeline with 80.1% accuracy for resume analysis and matching.',
      imageUrl: '/projects/kerjayatech.png',
      images: JSON.stringify([
        '/projects/kerjayatech.png',
        '/projects/kerjayatech-2.png',
        '/projects/kerjayatech-3.png',
      ]),
      techStack: ['Python', 'Node.js', 'Firebase', 'Scikit-Learn', 'Chart.js'],
      category: 'AI',
      featured: true,
      status: 'Coming Soon',
      demoUrl: null,
      githubUrl: 'https://github.com/Bukhhh/KerjayaTechMY',
    },
    {
      id: 'project-1',
      title: 'RentVerse',
      description: 'Mobile SecOps Platform - Secure rental platform with AI anomaly detection, Role-Based MFA, and SHA-256 digital signatures for document integrity and identity verification.',
      longDescription: 'A cybersecurity-focused property rental platform addressing security vulnerabilities in rental platforms. Features AI anomaly detection, Role-Based MFA, and SHA-256 digital signatures for secure transactions.',
      imageUrl: '/projects/rentverse.png',
      images: JSON.stringify([
        '/projects/rentverse.png',
        '/projects/rentverse-2.png',
        '/projects/rentverse-3.png',
      ]),
      techStack: ['Next.js', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'Prisma ORM'],
      category: 'Cybersecurity',
      featured: true,
      status: 'Live Demo',
      demoUrl: 'https://uitm-devops-challenge-vecna-rentver-theta.vercel.app/',
      githubUrl: 'https://github.com/Bukhhh/RentVerse',
    },
    {
      id: 'project-2',
      title: 'ClaRity AI',
      description: 'AI-powered Skin Analyzer & Recognition System using custom object detection for facial skin feature identification like acne and pigmentation tracking.',
      longDescription: 'An AI-powered skin analysis system that addresses difficulty in accurately identifying and tracking facial skin features. Won Gold Medal at innovation competition.',
      imageUrl: '/projects/claRity.png',
      images: JSON.stringify([
        '/projects/claRity.png',
        '/projects/claRity-2.png',
        '/projects/claRity-3.png',
      ]),
      techStack: ['Computer Vision', 'Roboflow', 'Python', 'GitHub'],
      category: 'AI',
      featured: true,
      status: 'Competition Winner',
      achievement: '🥇 Gold Medal',
      demoUrl: null,
      githubUrl: 'https://github.com/Bukhhh/ClaRity',
    },
    {
      id: 'project-3',
      title: 'BankaiBotMY',
      description: 'Bleach-Themed AI Chatbot - Interactive AI chatbot with 7 character personas, gamification mechanics, and dynamic quiz generation for anime lore learning in Bahasa Melayu.',
      longDescription: 'An engaging, gamified educational tool for anime lore learning in Bahasa Melayu. Features 7 character personas, gamification mechanics, and dynamic quiz generation. Built for CSC649 Assignment Project.',
      imageUrl: '/projects/bankaibot.png',
      images: JSON.stringify([
        '/projects/bankaibot.png',
        '/projects/bankaibot-2.png',
        '/projects/bankaibot-3.png',
      ]),
      techStack: ['Flask', 'OpenAI GPT-4', 'SQLite', 'Flask-SQLAlchemy', 'HTML', 'CSS', 'JavaScript', 'Python'],
      category: 'AI',
      featured: false,
      status: 'Completed',
      demoUrl: null,
      githubUrl: 'https://github.com/Bukhhh/BankaiBotMY',
    },
  ];

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    await db.project.upsert({
      where: { id: project.id },
      create: {
        id: project.id,
        title: project.title,
        description: project.description,
        longDescription: project.longDescription,
        imageUrl: project.imageUrl,
        images: project.images,
        techStack: JSON.stringify(project.techStack),
        category: project.category,
        featured: project.featured,
        status: project.status,
        demoUrl: project.demoUrl,
        githubUrl: project.githubUrl,
        order: i,
      },
      update: {
        title: project.title,
        description: project.description,
        longDescription: project.longDescription,
        imageUrl: project.imageUrl,
        images: project.images,
        techStack: JSON.stringify(project.techStack),
        category: project.category,
        featured: project.featured,
        status: project.status,
        demoUrl: project.demoUrl,
        githubUrl: project.githubUrl,
      },
    });
  }

  // Create achievements
  await db.achievement.upsert({
    where: { id: 'ach-1' },
    create: {
      id: 'ach-1',
      title: 'Gold Medal - ClaRity AI',
      description: 'Won 1st Place / Gold Medal at innovation competition for AI-powered skin analysis system using custom object detection.',
      date: '2024',
      issuer: 'Innovation Competition',
      order: 0,
    },
    update: {
      title: 'Gold Medal - ClaRity AI',
      description: 'Won 1st Place / Gold Medal at innovation competition for AI-powered skin analysis system using custom object detection.',
    },
  });

  await db.achievement.upsert({
    where: { id: 'ach-2' },
    create: {
      id: 'ach-2',
      title: "Dean's List Awardee",
      description: "Achieved Dean's List for Semester 5 with CGPA 3.66 in Bachelor of Computer Science program.",
      date: '2024',
      issuer: 'UiTM',
      order: 1,
    },
    update: {
      title: "Dean's List Awardee",
      description: "Achieved Dean's List for Semester 5 with CGPA 3.66 in Bachelor of Computer Science program.",
    },
  });

  await db.achievement.upsert({
    where: { id: 'ach-3' },
    create: {
      id: 'ach-3',
      title: "Vice-Chancellor's Award (ANC)",
      description: "Received Anugerah Naib Canselor during Diploma studies for outstanding academic excellence with Dean's List for 4 consecutive semesters.",
      date: '2022',
      issuer: 'UiTM',
      order: 2,
    },
    update: {
      title: "Vice-Chancellor's Award (ANC)",
      description: "Received Anugerah Naib Canselor during Diploma studies for outstanding academic excellence with Dean's List for 4 consecutive semesters.",
    },
  });

  console.log('✅ Seed completed with all portfolio data!');
  console.log('🎨 Primary color: #3b82f6 (Blue)');
  console.log('🤖 Assistant name: Robo');
  console.log('📁 Projects: 4 (KerjayaTechMY, RentVerse, ClaRity AI, BankaiBotMY)');
  console.log('💼 Experiences: 3');
  console.log('🎓 Education: 2 (Bachelor + Diploma)');
  console.log('🏆 Achievements: 3');
  console.log('💻 Skills: 30+');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
