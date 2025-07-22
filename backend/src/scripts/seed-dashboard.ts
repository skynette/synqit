import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedDashboard() {
  try {
    console.log('🌱 Starting dashboard seed...');

    // Create test users if they don't exist
    const testUser = await prisma.user.upsert({
      where: { email: 'test@synqit.com' },
      update: {},
      create: {
        email: 'test@synqit.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Test',
        lastName: 'User',
        userType: 'STARTUP',
        isEmailVerified: true,
        isVerified: true,
      },
    });

    // Create some test companies
    const companies = [
      {
        name: 'Arweave',
        description: 'Permanent decentralized data storage network designed to enable the permanent storage of data.',
        website: 'https://www.arweave.org',
        projectType: 'Infrastructure',
        projectStage: 'Live',
        isLookingForFunding: false,
        isLookingForPartners: true,
        tags: ['Storage', 'Infrastructure', 'Web3'],
        blockchains: ['Arweave'],
      },
      {
        name: 'Aave',
        description: 'Open source and non-custodial liquidity protocol for earning interest on deposits and borrowing assets.',
        website: 'https://aave.com',
        projectType: 'DeFi',
        projectStage: 'Live',
        isLookingForFunding: false,
        isLookingForPartners: true,
        tags: ['DeFi', 'Lending', 'Protocol'],
        blockchains: ['Ethereum', 'Polygon', 'Avalanche'],
      },
      {
        name: 'Audius',
        description: 'Decentralized music streaming protocol that connects artists directly with their fans.',
        website: 'https://audius.co',
        projectType: 'SocialFi',
        projectStage: 'Live',
        isLookingForFunding: true,
        isLookingForPartners: true,
        tags: ['Music', 'SocialFi', 'Entertainment'],
        blockchains: ['Solana', 'Ethereum'],
      },
      {
        name: 'The Graph',
        description: 'Indexing protocol for querying networks like Ethereum and IPFS.',
        website: 'https://thegraph.com',
        projectType: 'Infrastructure',
        projectStage: 'Live',
        isLookingForFunding: false,
        isLookingForPartners: true,
        tags: ['Infrastructure', 'Data', 'Protocol'],
        blockchains: ['Ethereum', 'Arbitrum', 'Polygon'],
      },
      {
        name: 'Chainlink',
        description: 'Decentralized oracle network that provides real-world data to smart contracts.',
        website: 'https://chain.link',
        projectType: 'Infrastructure',
        projectStage: 'Live',
        isLookingForFunding: false,
        isLookingForPartners: true,
        tags: ['Oracle', 'Infrastructure', 'Data'],
        blockchains: ['Ethereum', 'Polygon', 'BSC', 'Avalanche'],
      },
      {
        name: 'Uniswap',
        description: 'Leading decentralized crypto trading protocol.',
        website: 'https://uniswap.org',
        projectType: 'DeFi',
        projectStage: 'Live',
        isLookingForFunding: false,
        isLookingForPartners: false,
        tags: ['DeFi', 'DEX', 'Protocol'],
        blockchains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
      },
      {
        name: 'Sandbox',
        description: 'Virtual world where players can build, own, and monetize their gaming experiences.',
        website: 'https://www.sandbox.game',
        projectType: 'GameFi',
        projectStage: 'Beta Testing',
        isLookingForFunding: false,
        isLookingForPartners: true,
        tags: ['GameFi', 'Metaverse', 'NFT'],
        blockchains: ['Ethereum', 'Polygon'],
      },
      {
        name: 'Filecoin',
        description: 'Decentralized storage network designed to store humanitys most important information.',
        website: 'https://filecoin.io',
        projectType: 'Infrastructure',
        projectStage: 'Live',
        isLookingForFunding: false,
        isLookingForPartners: true,
        tags: ['Storage', 'Infrastructure', 'Protocol'],
        blockchains: ['Filecoin'],
      },
    ];

    // Create companies for the test user
    for (const companyData of companies) {
      const company = await prisma.company.upsert({
        where: { 
          id: `company_${companyData.name.replace(/\s+/g, '_').toLowerCase()}_${testUser.id}`
        },
        update: {},
        create: {
          ...companyData,
          ownerId: testUser.id,
          foundedYear: 2020 + Math.floor(Math.random() * 4),
          totalFunding: Math.floor(Math.random() * 50) * 1000000,
          country: ['USA', 'UK', 'Singapore', 'Switzerland'][Math.floor(Math.random() * 4)],
        },
      });

      console.log(`✅ Created company: ${company.name}`);
    }

    // Create additional test users with companies
    const additionalUsers = [
      { email: 'startup1@synqit.com', firstName: 'Alice', lastName: 'Startup', userType: 'STARTUP' },
      { email: 'investor1@synqit.com', firstName: 'Bob', lastName: 'Investor', userType: 'INVESTOR' },
      { email: 'ecosystem1@synqit.com', firstName: 'Carol', lastName: 'Ecosystem', userType: 'ECOSYSTEM_PLAYER' },
    ];

    for (const userData of additionalUsers) {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          userType: userData.userType as any,
          password: await bcrypt.hash('password123', 12),
          isEmailVerified: true,
          isVerified: true,
        },
      });

      // Create a company for each user
      const companyIndex = Math.floor(Math.random() * companies.length);
      const baseCompany = companies[companyIndex];
      
      await prisma.company.create({
        data: {
          name: `${userData.firstName}'s ${baseCompany.name} Clone`,
          description: `${userData.firstName}'s version of ${baseCompany.description}`,
          website: `https://${userData.firstName.toLowerCase()}.example.com`,
          teamSize: 'SMALL_2_10',
          fundingStage: 'SEED',
          isLookingForFunding: true,
          isLookingForPartners: true,
          ownerId: user.id,
          foundedYear: 2023,
          totalFunding: Math.floor(Math.random() * 10) * 100000,
          country: 'USA',
        },
      });

      console.log(`✅ Created user and company for: ${userData.email}`);
    }

    console.log('✅ Dashboard seed completed successfully!');
    console.log('📝 Test credentials:');
    console.log('   Email: test@synqit.com');
    console.log('   Password: password123');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
seedDashboard()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });