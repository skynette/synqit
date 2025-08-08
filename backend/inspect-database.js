#!/usr/bin/env node

/**
 * Database Inspection Script for Synqit Backend
 * 
 * This script connects to the database and shows:
 * - Database connection status
 * - Table structure and counts
 * - Sample data from each table
 * 
 * Usage: node inspect-database.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function inspectDatabase() {
  console.log('🔍 Inspecting Synqit Database');
  console.log('=============================\n');

  try {
    // Test database connection
    console.log('📡 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful\n');

    // Get table information
    const tables = [
      { name: 'User', model: prisma.user },
      { name: 'Project', model: prisma.project },
      { name: 'Partnership', model: prisma.partnership },
      { name: 'Message', model: prisma.message },
      { name: 'Notification', model: prisma.notification },
      { name: 'UserSession', model: prisma.userSession },
      { name: 'Tag', model: prisma.tag }
    ];

    console.log('📊 Table Overview');
    console.log('================');

    for (const table of tables) {
      try {
        const count = await table.model.count();
        console.log(`📋 ${table.name}: ${count} records`);
      } catch (error) {
        console.log(`❌ ${table.name}: Error counting (${error.message})`);
      }
    }

    console.log('\\n🔍 Sample Data');
    console.log('==============');

    // Show sample users
    console.log('\\n👥 Users (first 3):');
    try {
      const users = await prisma.user.findMany({
        take: 3,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          userType: true,
          createdAt: true,
          isEmailVerified: true
        }
      });
      
      if (users.length > 0) {
        users.forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
          console.log(`     Type: ${user.userType}, Verified: ${user.isEmailVerified}`);
          console.log(`     Created: ${user.createdAt.toISOString().split('T')[0]}`);
        });
      } else {
        console.log('  📭 No users found');
      }
    } catch (error) {
      console.log(`  ❌ Error fetching users: ${error.message}`);
    }

    // Show sample projects
    console.log('\\n🚀 Projects (first 3):');
    try {
      const projects = await prisma.project.findMany({
        take: 3,
        select: {
          id: true,
          name: true,
          projectType: true,
          developmentFocus: true,
          createdAt: true,
          owner: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });
      
      if (projects.length > 0) {
        projects.forEach((project, index) => {
          console.log(`  ${index + 1}. ${project.name} (${project.projectType})`);
          console.log(`     Focus: ${project.developmentFocus || 'Not specified'}`);
          console.log(`     Owner: ${project.owner.firstName} ${project.owner.lastName}`);
          console.log(`     Created: ${project.createdAt.toISOString().split('T')[0]}`);
        });
      } else {
        console.log('  📭 No projects found');
      }
    } catch (error) {
      console.log(`  ❌ Error fetching projects: ${error.message}`);
    }

    // Show partnerships
    console.log('\\n🤝 Partnerships (first 3):');
    try {
      const partnerships = await prisma.partnership.findMany({
        take: 3,
        select: {
          id: true,
          title: true,
          status: true,
          partnershipType: true,
          createdAt: true
        }
      });
      
      if (partnerships.length > 0) {
        partnerships.forEach((partnership, index) => {
          console.log(`  ${index + 1}. ${partnership.title} (${partnership.status})`);
          console.log(`     Type: ${partnership.partnershipType}`);
          console.log(`     Created: ${partnership.createdAt.toISOString().split('T')[0]}`);
        });
      } else {
        console.log('  📭 No partnerships found');
      }
    } catch (error) {
      console.log(`  ❌ Error fetching partnerships: ${error.message}`);
    }

    // Show messages
    console.log('\\n💬 Messages (first 3):');
    try {
      const messages = await prisma.message.findMany({
        take: 3,
        select: {
          id: true,
          content: true,
          messageType: true,
          isRead: true,
          createdAt: true
        }
      });
      
      if (messages.length > 0) {
        messages.forEach((message, index) => {
          const preview = message.content.length > 50 
            ? message.content.substring(0, 50) + '...'
            : message.content;
          console.log(`  ${index + 1}. "${preview}" (${message.messageType})`);
          console.log(`     Read: ${message.isRead}, Created: ${message.createdAt.toISOString().split('T')[0]}`);
        });
      } else {
        console.log('  📭 No messages found');
      }
    } catch (error) {
      console.log(`  ❌ Error fetching messages: ${error.message}`);
    }

    console.log('\\n📈 Database Schema Info');
    console.log('=======================');
    console.log('To view the complete schema:');
    console.log('  📋 cat prisma/schema.prisma');
    console.log('\\nTo open database GUI:');
    console.log('  🖥️  npm run db:studio');
    console.log('\\nTo reset database:');
    console.log('  ⚠️  npx prisma db push --force-reset');

  } catch (error) {
    console.error('❌ Database inspection failed:', error.message);
    console.error('\\nTroubleshooting:');
    console.error('  1. Check your DATABASE_URL in .env');
    console.error('  2. Ensure database is running and accessible');
    console.error('  3. Run: npx prisma db push');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the inspection
inspectDatabase().catch(console.error);