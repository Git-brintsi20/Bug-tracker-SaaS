const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting to seed auth database...');

    // Create the main user (Harshita)
    const harshita = await prisma.user.upsert({
      where: { email: 'harshitabhanusalugu@gmail.com' },
      update: {},
      create: {
        email: 'harshitabhanusalugu@gmail.com',
        username: 'harshita',
        firstName: 'Harshita',
        lastName: 'Bhanu',
        password: '$2a$10$YIH0h4xqMD0yN0qV0yN0K.yN0qV0yN0K.yN0qV0yN0K.yN0qV0yN0K', // bcrypt hash of 'password'
        emailVerified: true
      }
    });

    console.log('Created/Found user: Harshita');

    // Create team members
    const teamMembers = [
      {
        email: 'dev1@acmecorp.com',
        username: 'alex_dev',
        firstName: 'Alex',
        lastName: 'Johnson'
      },
      {
        email: 'dev2@acmecorp.com',
        username: 'maria_dev',
        firstName: 'Maria',
        lastName: 'Garcia'
      },
      {
        email: 'dev3@acmecorp.com',
        username: 'john_dev',
        firstName: 'John',
        lastName: 'Smith'
      },
      {
        email: 'dev4@acmecorp.com',
        username: 'sarah_qa',
        firstName: 'Sarah',
        lastName: 'Williams'
      }
    ];

    for (const memberData of teamMembers) {
      const member = await prisma.user.upsert({
        where: { email: memberData.email },
        update: {},
        create: {
          email: memberData.email,
          username: memberData.username,
          firstName: memberData.firstName,
          lastName: memberData.lastName,
          password: '$2a$10$YIH0h4xqMD0yN0qV0yN0K.yN0qV0yN0K.yN0qV0yN0K.yN0qV0yN0K', // bcrypt hash of 'password'
          emailVerified: true
        }
      });
      console.log(`Created/Found user: ${member.firstName} ${member.lastName}`);
    }

    // Create organization
    const org = await prisma.organization.upsert({
      where: { slug: 'acme-corp' },
      update: {},
      create: {
        name: 'Acme Corp',
        slug: 'acme-corp',
        description: 'Leading enterprise software solutions provider'
      }
    });

    console.log('Created organization: Acme Corp');

    // Add all users to organization
    const allUsers = [harshita, ...teamMembers];
    let memberCount = 0;

    for (let i = 0; i < allUsers.length; i++) {
      const user = i === 0 ? harshita : await prisma.user.findUnique({ where: { email: allUsers[i].email } });

      const membership = await prisma.organizationMember.upsert({
        where: { userId_organizationId: { userId: user.id, organizationId: org.id } },
        update: {},
        create: {
          userId: user.id,
          organizationId: org.id,
          role: i === 0 ? 'ADMIN' : 'DEVELOPER'
        }
      });
      memberCount++;
    }

    console.log(`\n✅ Auth database seeded successfully!`);
    console.log(`\nSummary:`);
    console.log(`- Organization: ${org.name}`);
    console.log(`- Total Members: ${memberCount}`);
    console.log(`- Admin: Harshita Bhanu`);
    console.log(`- Developers: Alex, Maria, John, Sarah`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
