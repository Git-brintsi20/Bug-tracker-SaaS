const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const membership = await prisma.organizationMember.create({
    data: {
      organizationId: 'ba61c347-5300-4325-8222-0199afdaae80',
      userId: 'ee1d4bac-3af1-46c8-b373-f19d975c79b9',
      role: 'DEVELOPER'
    }
  });
  console.log('Added user to organization:', membership);
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
