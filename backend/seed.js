import 'dotenv/config';
import mongoose from 'mongoose';
import AdminUser from './models/AdminUser.js';
import Project from './models/Project.js';
import Skill from './models/Skill.js';
import Experience from './models/Experience.js';
import connectDB from './config/db.js';

await connectDB();

const seed = async () => {
  try {
    // Clear existing data
    await Promise.all([
      AdminUser.deleteMany(),
      Project.deleteMany(),
      Skill.deleteMany(),
      Experience.deleteMany(),
    ]);
    console.log('🗑️  Cleared existing data');

    // ─── Admin User ───────────────────────────────────────────────
    await AdminUser.create({
      username: 'admin',
      email: 'admin@portfolio.dev',
      password: 'Admin@1234', // Change after first login!
    });
    console.log('👤 Admin user created  →  email: admin@portfolio.dev  |  password: Admin@1234');

    // ─── Skills ───────────────────────────────────────────────────
    const skills = await Skill.insertMany([
      { name: 'React', icon: '⚛️', proficiency: 92, category: 'Frontend', order: 1 },
      { name: 'TypeScript', icon: '🔷', proficiency: 88, category: 'Frontend', order: 2 },
      { name: 'Tailwind CSS', icon: '🎨', proficiency: 90, category: 'Frontend', order: 3 },
      { name: 'Next.js', icon: '▲', proficiency: 82, category: 'Frontend', order: 4 },
      { name: 'Node.js', icon: '🟢', proficiency: 90, category: 'Backend', order: 5 },
      { name: 'Express.js', icon: '🚂', proficiency: 88, category: 'Backend', order: 6 },
      { name: 'MongoDB', icon: '🍃', proficiency: 85, category: 'Database', order: 7 },
      { name: 'PostgreSQL', icon: '🐘', proficiency: 75, category: 'Database', order: 8 },
      { name: 'Docker', icon: '🐋', proficiency: 70, category: 'DevOps', order: 9 },
      { name: 'AWS', icon: '☁️', proficiency: 65, category: 'DevOps', order: 10 },
      { name: 'Git & GitHub', icon: '🔧', proficiency: 95, category: 'Tools', order: 11 },
      { name: 'Figma', icon: '🎭', proficiency: 72, category: 'Tools', order: 12 },
    ]);
    console.log(`🛠️  ${skills.length} skills created`);

    // ─── Experience & Education ────────────────────────────────────
    const experiences = await Experience.insertMany([
      {
        type: 'work',
        title: 'Senior Full-Stack Engineer',
        organization: 'TechNova Solutions',
        location: 'Addis Ababa, ET (Remote)',
        startDate: new Date('2022-06-01'),
        current: true,
        description:
          'Lead engineer for a suite of SaaS products serving 50k+ users. Architect scalable MERN microservices, mentor junior developers, and drive CI/CD adoption across the team.',
        skills: ['React', 'Node.js', 'MongoDB', 'Docker', 'AWS'],
        order: 1,
      },
      {
        type: 'work',
        title: 'Full-Stack Developer',
        organization: 'Freelance / Remote',
        location: 'Remote',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2022-05-31'),
        description:
          'Delivered 20+ client projects ranging from e-commerce platforms to REST API integrations. Specialized in React + Node.js stacks.',
        skills: ['React', 'Express.js', 'PostgreSQL', 'Tailwind CSS'],
        order: 2,
      },
      {
        type: 'education',
        title: 'B.Sc. Software Engineering',
        organization: 'Addis Ababa University',
        location: 'Addis Ababa, Ethiopia',
        startDate: new Date('2016-09-01'),
        endDate: new Date('2020-07-31'),
        description:
          'Graduated with distinction. Thesis: "Distributed systems for low-bandwidth environments in Sub-Saharan Africa." Dean\'s List 2018–2020.',
        skills: ['Algorithms', 'Data Structures', 'Software Architecture'],
        order: 3,
      },
    ]);
    console.log(`📚 ${experiences.length} experience entries created`);

    // ─── Projects ─────────────────────────────────────────────────
    const projects = await Project.insertMany([
      {
        title: 'ShopSphere — E-Commerce Platform',
        shortDescription: 'Full-featured online store with real-time inventory & payments.',
        description:
          'A production-grade e-commerce platform built with the MERN stack. Features include Stripe payment integration, real-time inventory management, admin dashboard, JWT auth, and email notifications via SendGrid. Hosted on AWS EC2 with NGINX reverse proxy.',
        images: [
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
          'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
        ],
        sourceCodeLink: 'https://github.com/admin/shopsphere',
        liveLink: 'https://shopsphere.demo',
        techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS', 'Tailwind CSS'],
        category: 'Web App',
        featured: true,
        order: 1,
        reviews: [
          { reviewerName: 'Alex M.', rating: 5, comment: 'Incredibly clean code and beautiful UI. Learned a ton from this.', isApproved: true },
          { reviewerName: 'Sara K.', rating: 5, comment: 'The real-time inventory updates are seamless. Great work!', isApproved: true },
        ],
      },
      {
        title: 'DevCollab — Real-Time Code Editor',
        shortDescription: 'Collaborative coding environment with live pair programming.',
        description:
          'A browser-based collaborative code editor powered by Socket.io. Supports multiple simultaneous users, syntax highlighting via CodeMirror, room-based sessions, and integrated chat. Designed for remote pair programming and technical interviews.',
        images: [
          'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
          'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800',
        ],
        sourceCodeLink: 'https://github.com/admin/devcollab',
        liveLink: 'https://devcollab.demo',
        techStack: ['React', 'Node.js', 'Socket.io', 'CodeMirror', 'MongoDB'],
        category: 'Web App',
        featured: true,
        order: 2,
        reviews: [
          { reviewerName: 'James T.', rating: 4, comment: 'Great concept! The socket syncing is impressively fast.', isApproved: true },
        ],
      },
      {
        title: 'AIInsight — Analytics Dashboard',
        shortDescription: 'ML-powered data dashboard with predictive analytics.',
        description:
          'An analytics dashboard integrating a Python ML microservice (FastAPI) with a React frontend. Processes CSV/JSON datasets, generates trend forecasts, and renders interactive D3.js charts. Built for non-technical business stakeholders.',
        images: [
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        ],
        sourceCodeLink: 'https://github.com/admin/aiinsight',
        liveLink: 'https://aiinsight.demo',
        techStack: ['React', 'FastAPI', 'Python', 'D3.js', 'MongoDB', 'Docker'],
        category: 'ML/AI',
        featured: false,
        order: 3,
        reviews: [],
      },
      {
        title: 'TaskFlow — Project Management API',
        shortDescription: 'RESTful API with role-based access, webhooks & Kanban logic.',
        description:
          'A fully documented REST API for project management workflows. Features RBAC (Owner / Member / Viewer), task dependencies, webhook integrations for Slack, and automatic PDF report generation. Includes Swagger UI documentation.',
        images: [
          'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800',
        ],
        sourceCodeLink: 'https://github.com/admin/taskflow-api',
        liveLink: 'https://taskflow-api.demo/docs',
        techStack: ['Node.js', 'Express.js', 'MongoDB', 'JWT', 'Swagger'],
        category: 'API',
        featured: false,
        order: 4,
        reviews: [
          { reviewerName: 'Yonas B.', rating: 5, comment: 'The Swagger docs made integration a breeze. Very professional!', isApproved: true },
        ],
      },
    ]);
    console.log(`🚀 ${projects.length} projects created`);

    console.log('\n✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Login:');
    console.log('  Email   : admin@portfolio.dev');
    console.log('  Password: Admin@1234');
    console.log('  Route   : /admin/login');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    await mongoose.connection.close();
  }
};

seed();
