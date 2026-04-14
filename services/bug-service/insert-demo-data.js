const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Generate realistic demo data
async function createBugsDemoData() {
  try {
    console.log('Starting to seed bugs database...');

    // First, let's get the organization ID from auth service
    // We'll use direct queries since we're in the bug service

    // For now, let's assume we're using the auth service to get users
    // In a real scenario, these would come from the auth service

    // Sample users that would exist from auth service
    const users = [
      {
        email: 'harshitabhanusalugu@gmail.com',
        username: 'harshita',
        firstName: 'Harshita',
        lastName: 'Bhanu'
      },
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

    // Create users in bug service
    const createdUsers = [];
    for (const userData of users) {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          email: userData.email,
          username: userData.username,
          firstName: userData.firstName,
          lastName: userData.lastName,
          emailVerified: true
        }
      });
      createdUsers.push(user);
      console.log(`Created/Found user: ${user.email}`);
    }

    // Get organization data - assuming it exists in auth service
    // We'll create it here for the bug service
    const org = await prisma.organization.upsert({
      where: { slug: 'acme-corp' },
      update: {},
      create: {
        name: 'Acme Corp',
        slug: 'acme-corp',
        description: 'Leading enterprise software solutions provider'
      }
    });

    console.log(`Using organization: ${org.name}`);

    // Create organization members
    for (const user of createdUsers) {
      await prisma.organizationMember.upsert({
        where: { userId_organizationId: { userId: user.id, organizationId: org.id } },
        update: {},
        create: {
          userId: user.id,
          organizationId: org.id,
          role: user.email === 'harshitabhanusalugu@gmail.com' ? 'ADMIN' : 'DEVELOPER'
        }
      });
    }

    const harshita = createdUsers[0];
    const alex = createdUsers[1];
    const maria = createdUsers[2];
    const john = createdUsers[3];
    const sarah = createdUsers[4];

    console.log('Creating 12 realistic bugs...');

    // Create 12 bugs with realistic data
    const bugsData = [
      {
        title: 'Login page not loading on mobile',
        description: 'Users report the login page takes 10+ seconds to load on mobile devices. This is affecting our conversion rates significantly.',
        status: 'OPEN',
        priority: 'CRITICAL',
        creatorId: harshita.id,
        assigneeId: alex.id
      },
      {
        title: 'Fix typo in dashboard header',
        description: 'The dashboard header displays "Dashbaord" instead of "Dashboard". Simple typo fix.',
        status: 'IN_PROGRESS',
        priority: 'LOW',
        creatorId: alex.id,
        assigneeId: maria.id
      },
      {
        title: 'Database query optimization needed',
        description: 'The user list query is slow in large organizations. Query times exceed 5 seconds for organizations with 10k+ users.',
        status: 'OPEN',
        priority: 'HIGH',
        creatorId: sarah.id,
        assigneeId: john.id
      },
      {
        title: 'Email notifications not sending',
        description: 'Users are not receiving email notifications for bug updates. Checked logs - email service is throwing errors.',
        status: 'OPEN',
        priority: 'HIGH',
        creatorId: harshita.id,
        assigneeId: alex.id
      },
      {
        title: 'Fix styling issues in dark mode',
        description: 'Dark mode has several styling issues: text not visible in certain components, contrast issues.',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        creatorId: maria.id,
        assigneeId: maria.id
      },
      {
        title: 'Implement two-factor authentication',
        description: 'Add support for 2FA using TOTP apps. This is a security requirement from our enterprise customers.',
        status: 'IN_REVIEW',
        priority: 'HIGH',
        creatorId: harshita.id,
        assigneeId: john.id
      },
      {
        title: 'API rate limiting issues',
        description: 'Our API is not properly enforcing rate limits. High-volume clients are bypassing limits and causing performance issues.',
        status: 'OPEN',
        priority: 'CRITICAL',
        creatorId: john.id,
        assigneeId: alex.id
      },
      {
        title: 'Bug tracker export as CSV not working',
        description: 'Export functionality returns empty CSV files. Affected users cannot export their bug reports.',
        status: 'RESOLVED',
        priority: 'MEDIUM',
        creatorId: sarah.id,
        assigneeId: maria.id
      },
      {
        title: 'Improve search performance',
        description: 'Full-text search is slow when searching across large bug databases. Need to optimize indexing strategy.',
        status: 'OPEN',
        priority: 'MEDIUM',
        creatorId: maria.id,
        assigneeId: john.id
      },
      {
        title: 'Fix broken links in documentation',
        description: 'Several documentation links are broken, pointing to 404 pages. Affects onboarding experience.',
        status: 'RESOLVED',
        priority: 'LOW',
        creatorId: alex.id,
        assigneeId: sarah.id
      },
      {
        title: 'Implement role-based access control improvements',
        description: 'Current RBAC is too basic. Need granular permissions for different team roles and project-level access control.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        creatorId: harshita.id,
        assigneeId: john.id
      },
      {
        title: 'Add support for custom fields in bugs',
        description: 'Enterprise customers need ability to add custom fields to bugs for their specific workflows.',
        status: 'OPEN',
        priority: 'MEDIUM',
        creatorId: harshita.id,
        assigneeId: alex.id
      }
    ];

    const createdBugs = [];
    for (const bugData of bugsData) {
      const bug = await prisma.bug.create({
        data: {
          ...bugData,
          organizationId: org.id
        }
      });
      createdBugs.push(bug);
      console.log(`Created bug: "${bug.title.substring(0, 40)}..." (${bug.id})`);
    }

    // Add comments to bugs to show activity
    console.log('Adding comments to bugs...');

    const comments = [
      { bugId: 0, authorId: harshita.id, content: 'This is blocking our mobile release. Should be our top priority.' },
      { bugId: 0, authorId: alex.id, content: 'I\'ve started investigating. Looks like a CSS/JS bundle size issue.' },
      { bugId: 2, authorId: sarah.id, content: 'I ran the profiler and identified the slow query. Need to add an index.' },
      { bugId: 2, authorId: john.id, content: 'Index added on `users.organization_id`. Query now runs in 200ms.' },
      { bugId: 3, authorId: harshita.id, content: 'This is urgent - customers are complaining about missing notifications.' },
      { bugId: 4, authorId: maria.id, content: 'Fixed the main contrast issues. Waiting for design review.' },
      { bugId: 5, authorId: john.id, content: '2FA implementation complete. Ready for QA testing.' },
      { bugId: 5, authorId: sarah.id, content: 'Tested on multiple devices. Looks good! Approving.' },
      { bugId: 6, authorId: john.id, content: 'Rate limiter is not properly updating Redis counters.' },
      { bugId: 6, authorId: alex.id, content: 'Found the issue - race condition in the rate limiting logic. Fixed in PR #342.' },
      { bugId: 7, authorId: maria.id, content: 'CSV export fixed. The query was returning null values incorrectly.' },
      { bugId: 9, authorId: sarah.id, content: 'All broken links have been fixed and tested.' },
      { bugId: 10, authorId: harshita.id, content: 'John, can you review the RBAC implementation proposal?' },
      { bugId: 10, authorId: john.id, content: 'Proposal looks good. Starting implementation.' },
    ];

    for (const commentData of comments) {
      const bug = createdBugs[commentData.bugId];
      await prisma.comment.create({
        data: {
          content: commentData.content,
          bugId: bug.id,
          authorId: commentData.authorId
        }
      });
    }

    console.log('Added comments to bugs');

    // Update the resolvedAt field for resolved bugs
    const resolvedBugs = createdBugs.filter(b => b.status === 'RESOLVED');
    for (const bug of resolvedBugs) {
      await prisma.bug.update({
        where: { id: bug.id },
        data: { resolvedAt: new Date() }
      });
    }

    console.log('\n✅ Demo data created successfully!');
    console.log(`\nSummary:`);
    console.log(`- Organization: ${org.name}`);
    console.log(`- Team Members: ${createdUsers.length}`);
    console.log(`- Total Bugs Created: ${createdBugs.length}`);
    console.log(`- Bug Status Distribution:`);
    console.log(`  - OPEN: ${createdBugs.filter(b => b.status === 'OPEN').length}`);
    console.log(`  - IN_PROGRESS: ${createdBugs.filter(b => b.status === 'IN_PROGRESS').length}`);
    console.log(`  - IN_REVIEW: ${createdBugs.filter(b => b.status === 'IN_REVIEW').length}`);
    console.log(`  - RESOLVED: ${createdBugs.filter(b => b.status === 'RESOLVED').length}`);

  } catch (error) {
    console.error('❌ Error creating demo data:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createBugsDemoData();
