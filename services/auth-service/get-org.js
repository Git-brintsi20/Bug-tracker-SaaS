const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.findFirst({
    where: { name: 'Acme Corp' }
  });
  if (org) {
    console.log(org.id);
  }
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
