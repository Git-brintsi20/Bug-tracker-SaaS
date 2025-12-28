const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create test users
  const hashedPassword = await bcrypt.hash('TestPass123!', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@bugtracker.com' },
    update: {},
    create: {
      email: 'admin@bugtracker.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      emailVerified: true,
    },
  })

  const devUser = await prisma.user.upsert({
    where: { email: 'developer@bugtracker.com' },
    update: {},
    create: {
      email: 'developer@bugtracker.com',
      username: 'developer',
      password: hashedPassword,
      firstName: 'Developer',
      lastName: 'User',
      emailVerified: true,
    },
  })

  const viewerUser = await prisma.user.upsert({
    where: { email: 'viewer@bugtracker.com' },
    update: {},
    create: {
      email: 'viewer@bugtracker.com',
      username: 'viewer',
      password: hashedPassword,
      firstName: 'Viewer',
      lastName: 'User',
      emailVerified: true,
    },
  })

  console.log('✅ Created test users')

  // Create test organization
  const organization = await prisma.organization.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corporation',
      slug: 'acme-corp',
      description: 'Sample organization for testing',
      allowPublicSignup: false,
    },
  })

  console.log('✅ Created test organization')

  // Add members with different roles
  await prisma.organizationMember.upsert({
    where: {
      userId_organizationId: {
        userId: adminUser.id,
        organizationId: organization.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      organizationId: organization.id,
      role: 'ADMIN',
    },
  })

  await prisma.organizationMember.upsert({
    where: {
      userId_organizationId: {
        userId: devUser.id,
        organizationId: organization.id,
      },
    },
    update: {},
    create: {
      userId: devUser.id,
      organizationId: organization.id,
      role: 'DEVELOPER',
    },
  })

  await prisma.organizationMember.upsert({
    where: {
      userId_organizationId: {
        userId: viewerUser.id,
        organizationId: organization.id,
      },
    },
    update: {},
    create: {
      userId: viewerUser.id,
      organizationId: organization.id,
      role: 'VIEWER',
    },
  })

  console.log('✅ Added organization members')

  // Create sample bugs
  const bug1 = await prisma.bug.create({
    data: {
      title: 'Dashboard not loading on mobile devices',
      description: 'When accessing the dashboard from mobile devices, the page fails to load properly. Users see a blank screen.',
      status: 'IN_PROGRESS',
      priority: 'CRITICAL',
      organizationId: organization.id,
      creatorId: adminUser.id,
      assigneeId: devUser.id,
    },
  })

  const bug2 = await prisma.bug.create({
    data: {
      title: 'Login page CSS broken on Safari',
      description: 'The login form styling is broken when viewed in Safari browser. Buttons are misaligned.',
      status: 'OPEN',
      priority: 'HIGH',
      organizationId: organization.id,
      creatorId: devUser.id,
      assigneeId: devUser.id,
    },
  })

  const bug3 = await prisma.bug.create({
    data: {
      title: 'API timeout issues on slow networks',
      description: 'API requests timeout when users have slow network connections. Need to implement better timeout handling.',
      status: 'IN_REVIEW',
      priority: 'MEDIUM',
      organizationId: organization.id,
      creatorId: adminUser.id,
    },
  })

  const bug4 = await prisma.bug.create({
    data: {
      title: 'Fix typo in footer',
      description: 'There is a typo in the footer text that needs to be corrected.',
      status: 'CLOSED',
      priority: 'LOW',
      organizationId: organization.id,
      creatorId: devUser.id,
      assigneeId: devUser.id,
      resolvedAt: new Date(),
      closedAt: new Date(),
    },
  })

  console.log('✅ Created sample bugs')

  // Create comments
  await prisma.comment.create({
    data: {
      content: 'I can reproduce this issue on iOS devices. Working on a fix.',
      bugId: bug1.id,
      authorId: devUser.id,
    },
  })

  await prisma.comment.create({
    data: {
      content: 'This is blocking our mobile users. High priority!',
      bugId: bug1.id,
      authorId: adminUser.id,
    },
  })

  await prisma.comment.create({
    data: {
      content: 'Only happens on Safari 15+. Chrome and Firefox work fine.',
      bugId: bug2.id,
      authorId: devUser.id,
    },
  })

  console.log('✅ Created sample comments')

  // Create labels
  await prisma.label.createMany({
    data: [
      { name: 'bug', color: '#d73a4a', bugId: bug1.id },
      { name: 'mobile', color: '#0075ca', bugId: bug1.id },
      { name: 'bug', color: '#d73a4a', bugId: bug2.id },
      { name: 'ui', color: '#e99695', bugId: bug2.id },
      { name: 'enhancement', color: '#a2eeef', bugId: bug3.id },
    ],
  })

  console.log('✅ Created sample labels')

  console.log('\n🎉 Database seeded successfully!')
  console.log('\n📊 Test Accounts:')
  console.log('  Admin: admin@bugtracker.com / TestPass123!')
  console.log('  Developer: developer@bugtracker.com / TestPass123!')
  console.log('  Viewer: viewer@bugtracker.com / TestPass123!')
  console.log('\n🏢 Test Organization: Acme Corporation (acme-corp)')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
