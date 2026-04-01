require('dotenv').config();
const { Pool } = require('pg');

async function seedContent() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  console.log('🔗 Connected to Neon for Content Seeding');

  // Clear existing content to avoid duplicates during dev testing
  await pool.query('DELETE FROM "Project"');
  await pool.query('DELETE FROM "Education"');
  await pool.query('DELETE FROM "Experience"');
  await pool.query('DELETE FROM "Skill"');
  await pool.query('DELETE FROM "Achievement"');
  
  // Update the avatarUrl and resumeUrl in Profile
  await pool.query(`UPDATE "Profile" SET "avatarUrl" = '/upload/profile/bukhari anc.jpeg', "resumeUrl" = '/upload/profile/RESUME_MOHAMAD_BUKHARI.pdf'`);

  // ====================== PROJECTS ======================
  const projects = [
    {
      title: "KerjayaTech MY",
      description: "Resume Analyzer for IT Skills Talent",
      longDescription: "Created an AI recruitment engine achieving 80.1% accuracy using a hybrid NLP pipeline trained on 9,500 samples. Designed a scalable architecture syncing Python ML benchmarks with a Node.js REST API and Firebase.",
      images: ['/upload/projects/KerjayaTechMY/Landing Page.png', '/upload/projects/KerjayaTechMY/AI Performance Dashboard.png', '/upload/projects/KerjayaTechMY/Recruiter Dashboard.png', '/upload/projects/KerjayaTechMY/Fresh Graduate Dashboard.png', '/upload/projects/KerjayaTechMY/Result Candidate.png', '/upload/projects/KerjayaTechMY/User Management Dashboard.png', '/upload/projects/KerjayaTechMY/New User.png'],
      techStack: ['Python', 'Scikit-Learn', 'Node.js', 'NLP Pipelines', 'Firebase', 'Chart.js'],
      category: "AI/Web",
      githubUrl: "https://github.com/Bukhhh/KerjayaTechMY-smart-resume-analyzer",
      demoUrl: "",
      featured: true,
      order: 1
    },
    {
      title: "RentVerse",
      description: "Secured Rental Platform",
      longDescription: "Built a secure, mobile-first rental platform designed to eliminate fraud and lease tampering. Integrated AI-powered anomaly detection and cryptographic SHA-256 digital signatures for automated PDF lease agreements. Implemented Multi-Factor Authentication (MFA) to create a trust-based ecosystem for property management.",
      images: ['/upload/projects/RentVerse/Renvterse Search.png', '/upload/projects/RentVerse/Security Admin Dashboard 1.png', '/upload/projects/RentVerse/OTP MFA.png', '/upload/projects/RentVerse/Rental Agreement .png', '/upload/projects/RentVerse/Live Activity Feed.png', '/upload/projects/RentVerse/Agreement Download.png'],
      techStack: ['Next.js', 'React', 'Prisma ORM', 'PostgreSQL', 'SHA-256', 'Tailwind CSS'],
      category: "Web App / Security",
      githubUrl: "https://github.com/Bukhhh/uitm-devops-challenge_VECNA",
      demoUrl: "https://uitm-devops-challenge-vecna-rentver-theta.vercel.app/",
      featured: true,
      order: 2
    },
    {
      title: "Clarity (Skin Analyzer & Recognition System)",
      description: "1st Place (Champion) in AI Seminar 2025",
      longDescription: "Achieved 1st Place (Champion) in AI Seminar 2025: Frontiers in Artificial Intelligence. Developed an AI-powered tool using Roboflow for custom object detection to identify facial skin features with high precision. Managed the end-to-end Machine Learning lifecycle including dataset annotation, model training, and version control via GitHub.",
      images: ['/upload/projects/CLARITY/POSTER.jpeg', '/upload/projects/CLARITY/DAHSHBOARD CLARITY.jpeg', '/upload/projects/CLARITY/WINNER PICTURE.jpeg', '/upload/projects/CLARITY/SIJIL PROJEK TERBAIK.jpeg'],
      techStack: ['Python', 'Roboflow', 'YOLOv8', 'Computer Vision'],
      category: "AI/Computer Vision",
      githubUrl: "",
      demoUrl: "",
      featured: true,
      order: 3
    },
    {
      title: "BankaiBotMY",
      description: "Bleach Anime Chatbot & Teori Challenge",
      longDescription: "An interactive Telegram/Web bot that answers Bleach lore questions in Bahasa Melayu. Features a 'Teori Challenge' where users answer questions to level up their Reiatsu and unlock characters.",
      images: ['/upload/projects/BankaiBotMY/Character.png', '/upload/projects/BankaiBotMY/Interaction.png', '/upload/projects/BankaiBotMY/Quiz.png', '/upload/projects/BankaiBotMY/Quiz 2.png', '/upload/projects/BankaiBotMY/Unlock.png'],
      techStack: ['React', 'JavaScript', 'Tailwind CSS', 'Vite'],
      category: "Web Application",
      githubUrl: "https://github.com/Bukhhh/BankaiBotMY",
      demoUrl: "",
      featured: false,
      order: 4
    },
    {
      title: "MusangKing Hybrid Classification System",
      description: "AI-Powered Durian Ripeness & Variety Classifier",
      longDescription: "Developed an integrated image processing system for classifying Durian ripeness and variety using a Hybrid Pipeline — combining classical Computer Vision with advanced Machine Learning. The 8-step pipeline includes Gamma Correction, LAB Color Space conversion, K-Means Clustering (K=3), Morphological Cleanup, Contour Detection, Geometric Feature Extraction, Color Analysis (RGB/HSV Histograms), and Binary Masking. Multi-class classification identifies varieties (Musang King D197, Black Thorn D200, Udang Merah D175) and ripeness levels (Mature, Immature, Defective). Built for CSC566 - Advanced Image Processing.",
      images: [
        "/upload/projects/MusangKingSystem/musangking1.png",
        "/upload/projects/MusangKingSystem/musangking2.png",
        "/upload/projects/MusangKingSystem/musangking3.png",
        "/upload/projects/MusangKingSystem/musangking4.png"
      ],
      techStack: ['Python', 'Flask', 'OpenCV', 'XGBoost', 'Scikit-learn', 'K-Means Clustering', 'Computer Vision'],
      category: "AI/Computer Vision",
      githubUrl: "https://github.com/Bukhhh/MusangKing_System",
      demoUrl: "",
      featured: false,
      order: 5
    }
  ];

  for (const proj of projects) {
    const imagesJson = JSON.stringify(proj.images);
    const techStackJson = JSON.stringify(proj.techStack);
    const imageUrl = proj.images.length > 0 ? proj.images[0] : "";
    await pool.query(`
      INSERT INTO "Project" (id, title, description, "longDescription", "imageUrl", images, "demoUrl", "githubUrl", "techStack", category, featured, "order", "createdAt", "updatedAt")
      VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
    `, [proj.title, proj.description, proj.longDescription, imageUrl, imagesJson, proj.demoUrl, proj.githubUrl, techStackJson, proj.category, proj.featured, proj.order]);
  }
  console.log('✅ Projects seeded');

  // ====================== EDUCATION ======================
  const eds = [
    {
      institution: "Universiti Teknologi MARA (UiTM)",
      degree: "Bachelor of Computer Science (Honours)",
      field: "Computer Science",
      gpa: "Dean's List (Semester 5)",
      startDate: "07/2025",
      endDate: "09/2025",
      description: "Relevant Coursework: Mobile Programming, Algorithm Analysis & Design, Project Formulation. Tapah, Perak.",
      order: 1
    },
    {
      institution: "Universiti Teknologi MARA (UiTM)",
      degree: "Diploma of Computer Science",
      field: "Computer Science",
      gpa: "Dean's List for 4 Consecutive Semesters",
      startDate: "09/2023",
      endDate: "03/2024",
      description: "Honors: Consistently achieved Dean's List status (Anugerah Dekan). Relevant Coursework: Object-Oriented Programming, Visual Programming, Introduction to Web & Mobile, Digital Electronics, Discrete Mathematics.",
      order: 2
    }
  ];
  for (const ed of eds) {
    await pool.query(`
      INSERT INTO "Education" (id, institution, degree, field, gpa, "startDate", "endDate", description, "order", "createdAt", "updatedAt")
      VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
    `, [ed.institution, ed.degree, ed.field, ed.gpa, ed.startDate, ed.endDate, ed.description, ed.order]);
  }
  console.log('✅ Education seeded');

  // ====================== EXPERIENCE ======================
  const exps = [
    {
      title: "Web Developer Intern",
      company: "Madani IT Solution",
      description: "Engineered the SEHMAIPP Admin Dashboard using Laravel 10 and MySQL to centralize Islamic real estate (Hartanah), Wakaf, and Baitulmal records. Implemented Role-Based Access Control (RBAC) to ensure secure data handling and restricted admin rights for sensitive information. Integrated Chart.js for real-time reporting and visualization, replacing manual record-keeping with automated data insights.",
      startDate: "07/2025",
      endDate: "09/2025",
      location: "Ipoh, Perak",
      type: "internship",
      order: 1
    },
    {
      title: "Barista & Crew Trainer",
      company: "The Loca Cafe",
      description: "Led comprehensive team training on operational standards and service excellence to maintain high-quality customer experiences. Managed inventory and daily cafe operations while ensuring consistent product quality in a fast-paced environment.",
      startDate: "09/2023",
      endDate: "03/2024",
      location: "Ipoh, Perak",
      type: "work",
      order: 2
    }
  ];
  for (const exp of exps) {
    await pool.query(`
      INSERT INTO "Experience" (id, title, company, description, "startDate", "endDate", location, type, "order", "createdAt", "updatedAt")
      VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
    `, [exp.title, exp.company, exp.description, exp.startDate, exp.endDate, exp.location, exp.type, exp.order]);
  }
  console.log('✅ Experience seeded');

  // ====================== SKILLS ======================
  const skillsList = [
    { name: "Python", category: "Languages", proficiency: 90 },
    { name: "JavaScript", category: "Languages", proficiency: 90 },
    { name: "TypeScript", category: "Languages", proficiency: 85 },
    { name: "PHP", category: "Languages", proficiency: 80 },
    { name: "Java", category: "Languages", proficiency: 75 },
    { name: "SQL", category: "Languages", proficiency: 90 },
    
    { name: "Next.js", category: "Frameworks", proficiency: 90 },
    { name: "React 19", category: "Frameworks", proficiency: 85 },
    { name: "Node.js", category: "Frameworks", proficiency: 85 },
    { name: "Express.js", category: "Frameworks", proficiency: 80 },
    { name: "Laravel", category: "Frameworks", proficiency: 80 },
    { name: "Tailwind CSS", category: "Frameworks", proficiency: 95 },
    { name: "Prisma ORM", category: "Frameworks", proficiency: 85 },
    
    { name: "Computer Vision", category: "AI & ML", proficiency: 85 },
    { name: "Roboflow", category: "AI & ML", proficiency: 80 },
    { name: "NLP Pipelines", category: "AI & ML", proficiency: 85 },
    { name: "Scikit-Learn", category: "AI & ML", proficiency: 80 },
    { name: "Gradient Boosting", category: "AI & ML", proficiency: 75 },
    { name: "Random Forest", category: "AI & ML", proficiency: 80 },
    
    { name: "Firebase", category: "Cloud & Dev", proficiency: 85 },
    { name: "Supabase", category: "Cloud & Dev", proficiency: 80 },
    { name: "PostgreSQL", category: "Cloud & Dev", proficiency: 85 },
    { name: "Git", category: "Cloud & Dev", proficiency: 90 },
    { name: "RBAC & JWT Security", category: "Cloud & Dev", proficiency: 85 }
  ];
  let skillOrder = 1;
  for (const skill of skillsList) {
    await pool.query(`
      INSERT INTO "Skill" (id, name, category, proficiency, "order", "createdAt", "updatedAt")
      VALUES (gen_random_uuid()::text, $1, $2, $3, $4, NOW(), NOW())
    `, [skill.name, skill.category, skill.proficiency, skillOrder++]);
  }
  console.log('✅ Skills seeded');

  // ====================== ACHIEVEMENTS/CERTIFICATES ======================
  const certs = [
    {
      title: "Clarity - 1st Place (Champion) Best Project",
      description: "Achieved 1st Place in AI Seminar 2025: Frontiers in Artificial Intelligence",
      date: "07/2025",
      issuer: "Universiti Teknologi MARA (UiTM)",
      imageUrl: "/upload/certificates/clarity_SIJIL PROJEK TERBAIK.jpeg",
      link: "",
      order: 1
    },
    {
      title: "WordPress Development Course",
      description: "Completed comprehensive WordPress web development course.",
      date: "2024",
      issuer: "Coursera",
      imageUrl: "/upload/certificates/Screenshot 2026-03-28 023032.png",
      link: "",
      order: 2
    },
    {
      title: "Latest Online Certificate",
      description: "Completed recent online certification.",
      date: "2026",
      issuer: "Online Platform",
      imageUrl: "/upload/certificates/Screenshot 2026-03-31 144212.png",
      link: "",
      order: 3
    }
  ];
  for (const cert of certs) {
    await pool.query(`
      INSERT INTO "Achievement" (id, title, description, date, issuer, "imageUrl", link, "order", "createdAt", "updatedAt")
      VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
    `, [cert.title, cert.description, cert.date, cert.issuer, cert.imageUrl, cert.link, cert.order]);
  }
  console.log('✅ Certificates seeded');

  await pool.end();
  console.log('🎉 All content seeded successfully!');
}

seedContent().catch(e => {
  console.error(e);
  process.exit(1);
});
