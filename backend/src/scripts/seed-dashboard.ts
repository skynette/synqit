import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDashboard() {
  try {
    console.log('🌱 Starting dashboard seeding...');
    
    // This seed script is currently disabled as it references Company models
    // that don't exist in the current schema. The current schema uses Projects
    // associated with Users instead of separate Company entities.
    
    console.log('⚠️  Dashboard seeding skipped - needs to be updated for current schema');
    
  } catch (error) {
    console.error('❌ Error seeding dashboard:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedDashboard()
    .then(() => {
      console.log('✅ Dashboard seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Dashboard seeding failed:', error);
      process.exit(1);
    });
}

export default seedDashboard;