#!/usr/bin/env npx tsx

/**
 * Comprehensive Database Seeding Script
 * Creates 20 dummy users, projects, partnerships, and messages for testing
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Dummy data templates
const companyNames = [
  'CryptoFlow Labs', 'BlockChain Dynamics', 'DeFi Solutions', 'NFT Marketplace Pro',
  'Web3 Analytics', 'Decentralized Gaming', 'Smart Contract Hub', 'Metaverse Builder',
  'Digital Asset Manager', 'Crypto Trading Bot', 'Blockchain Security', 'DeFi Protocol',
  'NFT Creator Studio', 'Web3 Social Network', 'Decentralized Storage', 'Crypto Wallet Plus',
  'Blockchain Explorer', 'Smart City Solutions', 'Digital Identity', 'Tokenization Platform'
];

const projectTypes = ['AI', 'DEFI', 'GAMEFI', 'NFT', 'DAO', 'WEB3_TOOLS', 'INFRASTRUCTURE', 'METAVERSE', 'SOCIAL', 'OTHER'];
const developmentFocuses = [
  'Decentralized Finance', 'Non-Fungible Tokens', 'Blockchain Gaming', 
  'Infrastructure Development', 'Social Networks', 'Smart Contracts',
  'Metaverse Development', 'Digital Assets', 'Crypto Trading', 'Security Solutions'
];

const fundingStages = ['PRE_SEED', 'SEED', 'SERIES_A', 'SERIES_B', 'SERIES_C', 'SERIES_D_PLUS', 'IPO', 'PROFITABLE'];
const teamSizes = ['SOLO', 'SMALL_2_10', 'MEDIUM_11_50', 'LARGE_51_200', 'ENTERPRISE_200_PLUS'];
const verificationLevels = ['BASIC', 'VERIFIED', 'PREMIUM_VERIFIED'];

const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Kate', 'Liam', 'Maya', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Ruby', 'Sam', 'Tara'];
const lastNames = ['Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

const descriptions = [
  'Building the future of decentralized finance with innovative solutions.',
  'Creating revolutionary NFT marketplace experiences.',
  'Developing next-generation blockchain gaming platforms.',
  'Providing secure and scalable blockchain infrastructure.',
  'Building decentralized social networks for Web3.',
  'Creating smart contract solutions for enterprises.',
  'Developing metaverse platforms and virtual experiences.',
  'Building digital asset management tools.',
  'Creating automated crypto trading solutions.',
  'Providing blockchain security and audit services.'
];

const tags = [
  'DeFi', 'NFT', 'Gaming', 'Web3', 'Blockchain', 'Smart Contracts', 'Metaverse',
  'DAO', 'Crypto', 'Trading', 'Security', 'Infrastructure', 'Social', 'Mobile',
  'Analytics', 'AI', 'Machine Learning', 'Identity', 'Storage', 'Payments'
];

const partnershipTitles = [
  'Technical Integration Partnership',
  'Marketing Collaboration Initiative',
  'Joint Development Project',
  'Cross-Chain Integration',
  'Community Partnership',
  'Strategic Alliance',
  'Technology Licensing Deal',
  'Co-Marketing Agreement',
  'Joint Venture Proposal',
  'Ecosystem Partnership'
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedDatabase() {
  console.log('🌱 Starting comprehensive database seeding...');
  console.log('============================================\n');

  try {
    // Preserve existing data - only clean up test data if needed
    console.log('🧹 Cleaning only test seed data (preserving existing data)...');
    // Only delete test users created by this script
    await prisma.message.deleteMany({ where: { sender: { email: { contains: 'testsynqit.com' } } } });
    await prisma.partnership.deleteMany({ where: { requester: { email: { contains: 'testsynqit.com' } } } });
    await prisma.notification.deleteMany({ where: { user: { email: { contains: 'testsynqit.com' } } } });
    await prisma.projectTag.deleteMany({ where: { project: { owner: { email: { contains: 'testsynqit.com' } } } } });
    await prisma.project.deleteMany({ where: { owner: { email: { contains: 'testsynqit.com' } } } });
    await prisma.user.deleteMany({ where: { email: { contains: 'testsynqit.com' } } });
    console.log('✅ Cleanup completed (existing data preserved)\n');

    // Create 20 users with projects
    console.log('👥 Creating 20 users with projects...');
    const users = [];
    const projects = [];

    for (let i = 0; i < 20; i++) {
      const firstName = getRandomItem(firstNames);
      const lastName = getRandomItem(lastNames);
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@testsynqit.com`;
      const hashedPassword = await bcrypt.hash('TestPassword123!', 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          userType: getRandomItem(['STARTUP', 'INVESTOR', 'ECOSYSTEM_PLAYER']),
          isEmailVerified: Math.random() > 0.3, // 70% verified
          bio: `Passionate blockchain developer and entrepreneur focused on ${getRandomItem(developmentFocuses)}.`,
          profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
        }
      });

      users.push(user);

      // Create project for user
      const projectName = getRandomItem(companyNames);
      const projectType = getRandomItem(projectTypes);
      const developmentFocus = getRandomItem(developmentFocuses);
      
      const project = await prisma.project.create({
        data: {
          name: `${projectName} ${i + 1}`,
          description: getRandomItem(descriptions),
          ownerId: user.id,
          projectType: projectType as any,
          developmentFocus,
          website: `https://${projectName.toLowerCase().replace(/\s+/g, '')}.com`,
          logoUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${projectName}`,
          bannerUrl: `https://picsum.photos/1200/300?random=${i}`,
          projectStage: getRandomItem(['IDEA_STAGE', 'MVP', 'BETA_TESTING', 'LIVE', 'SCALING']) as any,
          teamSize: getRandomItem(teamSizes) as any,
          fundingStage: getRandomItem(fundingStages) as any,
          totalFunding: Math.random() > 0.5 ? getRandomNumber(50000, 5000000) : null,
          isLookingForFunding: Math.random() > 0.4,
          isLookingForPartners: Math.random() > 0.3,
          verificationLevel: getRandomItem(verificationLevels) as any,
          trustScore: Math.floor(Math.random() * 100),
          viewCount: getRandomNumber(0, 1000),
          country: getRandomItem(['United States', 'Canada', 'United Kingdom', 'Germany', 'Singapore', 'Estonia', 'Switzerland']),
          city: getRandomItem(['New York', 'San Francisco', 'London', 'Berlin', 'Singapore', 'Tallinn', 'Zurich']),
          contactEmail: email,
          twitterHandle: `@${firstName.toLowerCase()}${lastName.toLowerCase()}`,
          githubUrl: `https://github.com/${firstName.toLowerCase()}${lastName.toLowerCase()}`
        }
      });

      projects.push(project);

      // Add 3-5 random tags to each project
      const projectTags = getRandomItems(tags, getRandomNumber(3, 5));
      for (const tag of projectTags) {
        await prisma.projectTag.create({
          data: {
            projectId: project.id,
            tag
          }
        });
      }

      console.log(`  ✅ Created user: ${firstName} ${lastName} with project: ${project.name}`);
    }

    console.log(`\n🚀 Created ${users.length} users with projects\n`);

    // Create partnerships between random projects
    console.log('🤝 Creating partnerships...');
    const partnerships = [];

    for (let i = 0; i < 15; i++) {
      const requester = getRandomItem(users);
      const receiver = getRandomItem(users);
      
      if (requester.id === receiver.id) continue; // Skip self-partnerships

      const requesterProject = projects.find(p => p.ownerId === requester.id);
      const receiverProject = projects.find(p => p.ownerId === receiver.id);

      if (!requesterProject || !receiverProject) continue;

      const partnership = await prisma.partnership.create({
        data: {
          title: getRandomItem(partnershipTitles),
          description: `Partnership proposal between ${requesterProject.name} and ${receiverProject.name}.`,
          requesterId: requester.id,
          receiverId: receiver.id,
          requesterProjectId: requesterProject.id,
          receiverProjectId: receiverProject.id,
          partnershipType: getRandomItem(['TECHNICAL_INTEGRATION', 'MARKETING_COLLABORATION', 'FUNDING_OPPORTUNITY', 'ADVISORY_PARTNERSHIP', 'ECOSYSTEM_PARTNERSHIP']) as any,
          status: getRandomItem(['PENDING', 'ACCEPTED', 'REJECTED']) as any,
          proposedTerms: 'Mutual collaboration with shared resources and marketing support.',
          respondedAt: Math.random() > 0.3 ? new Date() : null
        }
      });

      partnerships.push(partnership);
      console.log(`  ✅ Created partnership: ${partnership.title}`);
    }

    console.log(`\n💬 Created ${partnerships.length} partnerships\n`);

    // Create messages for some partnerships
    console.log('💬 Creating messages...');
    const acceptedPartnerships = partnerships.filter(p => p.status === 'ACCEPTED');
    
    for (const partnership of acceptedPartnerships.slice(0, 8)) {
      // Create 2-5 messages per partnership
      const messageCount = getRandomNumber(2, 5);
      
      for (let j = 0; j < messageCount; j++) {
        const sender = Math.random() > 0.5 ? partnership.requesterId : partnership.receiverId;
        const receiver = sender === partnership.requesterId ? partnership.receiverId : partnership.requesterId;
        
        const messageContents = [
          'Great to be working together on this partnership!',
          'When can we schedule our next sync meeting?',
          'I\'ve shared the technical specifications with the team.',
          'Looking forward to the joint marketing campaign.',
          'The integration is progressing well on our side.',
          'Should we set up a shared Slack channel?',
          'The community is excited about this collaboration!',
          'Let\'s discuss the timeline for the next milestone.'
        ];

        await prisma.message.create({
          data: {
            content: getRandomItem(messageContents),
            senderId: sender,
            receiverId: receiver,
            partnershipId: partnership.id,
            messageType: 'TEXT',
            isRead: Math.random() > 0.4, // 60% read
            createdAt: new Date(Date.now() - getRandomNumber(1, 30) * 24 * 60 * 60 * 1000) // Random date in last 30 days
          }
        });
      }
      
      console.log(`  ✅ Created ${messageCount} messages for partnership: ${partnership.title}`);
    }

    // Create notifications
    console.log('\n🔔 Creating notifications...');
    for (let i = 0; i < 25; i++) {
      const user = getRandomItem(users);
      const partnership = getRandomItem(partnerships);
      
      const notificationTypes = ['PARTNERSHIP_REQUEST', 'PARTNERSHIP_ACCEPTED', 'PARTNERSHIP_REJECTED', 'SYSTEM_UPDATE'];
      const titles = ['New Partnership Request', 'Partnership Accepted', 'Partnership Rejected', 'System Update'];
      const contents = [
        'You have received a new partnership request.',
        'Your partnership request has been accepted!',
        'Your partnership request was declined.',
        'Your account has been updated.'
      ];

      const typeIndex = getRandomNumber(0, notificationTypes.length - 1);

      await prisma.notification.create({
        data: {
          userId: user.id,
          title: titles[typeIndex],
          content: contents[typeIndex],
          notificationType: notificationTypes[typeIndex] as any,
          partnershipId: Math.random() > 0.5 ? partnership.id : null,
          isRead: Math.random() > 0.6, // 40% read
          createdAt: new Date(Date.now() - getRandomNumber(1, 7) * 24 * 60 * 60 * 1000) // Random date in last 7 days
        }
      });
    }

    console.log('✅ Created 25 notifications\n');

    // Ensure test user has a project for recommendations
    console.log('🎯 Ensuring test user has a project...');
    const testUser = await prisma.user.findUnique({ where: { email: 'test@synqit.com' } });
    if (testUser) {
      const existingProject = await prisma.project.findFirst({ where: { ownerId: testUser.id } });
      if (!existingProject) {
        await prisma.project.create({
          data: {
            name: 'Test DeFi Project',
            description: 'A test project for endpoint testing and validation.',
            ownerId: testUser.id,
            projectType: 'DEFI',
            developmentFocus: 'Decentralized Finance',
            website: 'https://testproject.synqit.com',
            logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=testproject',
            projectStage: 'MVP',
            teamSize: 'SMALL_2_10',
            fundingStage: 'SEED',
            isLookingForFunding: true,
            isLookingForPartners: true,
            verificationLevel: 'BASIC',
            trustScore: 75,
            viewCount: 50,
            contactEmail: 'test@synqit.com'
          }
        });
        console.log('✅ Created project for test user');
      } else {
        console.log('✅ Test user already has a project');
      }
    }

    // Final statistics
    console.log('\n📊 Seeding Summary');
    console.log('=================');
    const userCount = await prisma.user.count();
    const projectCount = await prisma.project.count();
    const partnershipCount = await prisma.partnership.count();
    const messageCount = await prisma.message.count();
    const notificationCount = await prisma.notification.count();
    const tagCount = await prisma.projectTag.count();

    console.log(`👥 Total Users: ${userCount}`);
    console.log(`🚀 Total Projects: ${projectCount}`);
    console.log(`🤝 Total Partnerships: ${partnershipCount}`);
    console.log(`💬 Total Messages: ${messageCount}`);
    console.log(`🔔 Total Notifications: ${notificationCount}`);
    console.log(`🏷️  Total Tags: ${tagCount}`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('💡 You can now test all endpoints with rich data.');
    console.log('\n🔗 Quick Links:');
    console.log('   📊 View data: npm run db:studio');
    console.log('   🧪 Test endpoints: node test-endpoints.js');
    console.log('   📷 Test file uploads: node test-file-uploads.js [auth-token]');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedDatabase().catch((error) => {
  console.error('💥 Fatal error during seeding:', error);
  process.exit(1);
});