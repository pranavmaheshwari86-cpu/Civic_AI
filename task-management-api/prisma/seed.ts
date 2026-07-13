import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo user
  const passwordHash = await bcrypt.hash('password123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      passwordHash,
      firstName: 'Demo',
      lastName: 'User',
      isActive: true,
    },
  });

  console.log('✅ Created demo user:', user.email);

  // Create sample tasks
  const tasks = [
    {
      title: 'Set up project structure',
      description: 'Initialize the Node.js project with TypeScript, ESLint, and Prettier',
      status: 'DONE',
      priority: 'HIGH',
      userId: user.id,
    },
    {
      title: 'Implement user authentication',
      description: 'Add JWT-based authentication with access and refresh tokens',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      userId: user.id,
    },
    {
      title: 'Create task CRUD endpoints',
      description: 'Build RESTful endpoints for task management',
      status: 'TODO',
      priority: 'MEDIUM',
      userId: user.id,
    },
    {
      title: 'Add PostgreSQL integration',
      description: 'Configure Prisma ORM with PostgreSQL database',
      status: 'TODO',
      priority: 'MEDIUM',
      userId: user.id,
    },
    {
      title: 'Implement Redis caching',
      description: 'Add caching layer for frequently accessed tasks',
      status: 'TODO',
      priority: 'LOW',
      userId: user.id,
    },
    {
      title: 'Write unit and integration tests',
      description: 'Achieve 80%+ code coverage with Jest and Supertest',
      status: 'TODO',
      priority: 'MEDIUM',
      userId: user.id,
    },
    {
      title: 'Set up Swagger documentation',
      description: 'Generate OpenAPI spec and Swagger UI',
      status: 'TODO',
      priority: 'LOW',
      userId: user.id,
    },
    {
      title: 'Configure Docker and CI/CD',
      description: 'Create multi-stage Dockerfile and GitHub Actions workflow',
      status: 'TODO',
      priority: 'MEDIUM',
      userId: user.id,
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({
      data: task,
    });
  }

  console.log(`✅ Created ${tasks.length} sample tasks`);
  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });