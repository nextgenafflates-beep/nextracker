import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin@12345', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@geotrackr.local' },
    update: {},
    create: { email: 'admin@geotrackr.local', fullName: 'Admin', passwordHash }
  });

  const ws = await prisma.workspace.create({ data: { name: 'Default Workspace' } });

  await prisma.workspaceMember.create({
    data: { userId: user.id, workspaceId: ws.id, role: 'owner' }
  });

  const domain = await prisma.domain.create({
    data: { workspaceId: ws.id, hostname: 'go.localhost', isActive: true }
  });

  await prisma.link.create({
    data: {
      workspaceId: ws.id,
      domainId: domain.id,
      name: 'Sample Campaign',
      slug: 'sample-campaign',
      defaultUrl: 'https://example.com/default',
      geoRules: {
        create: [
          { countryCode: 'US', url: 'https://example.com/us', priority: 1, isActive: true },
          { countryCode: 'GB', url: 'https://example.com/uk', priority: 2, isActive: true }
        ]
      }
    }
  });
}

main().finally(() => prisma.$disconnect());
