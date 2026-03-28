const fs = require('fs');
const path = require('path');

const provider = (process.env.DATABASE_PROVIDER || '').toLowerCase();
const targetFile = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const sqliteFile = path.join(__dirname, '..', 'prisma', 'schema.sqlite.prisma');
const postgresFile = path.join(__dirname, '..', 'prisma', 'schema.postgresql.prisma');

let source;
if (provider === 'postgresql' || provider === 'postgres') {
  source = postgresFile;
} else {
  source = sqliteFile;
}

if (!fs.existsSync(source)) {
  console.warn(`Prisma schema source file not found: ${source}`);
  console.warn('Skipping schema copy; keeping existing prisma/schema.prisma as-is.');
  return;
}

try {
  fs.copyFileSync(source, targetFile);
  console.log(`Copied Prisma schema ${path.basename(source)} -> schema.prisma`);
} catch (err) {
  console.error('Failed to copy Prisma schema file:', err);
  throw err;
}
