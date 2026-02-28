import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts', // Path to your schema file
  out: './drizzle',             // Folder for migration files
  dialect: 'sqlite',
  dbCredentials: {
    url: 'file:./data/sqlite.db',           // Name of your local DB file
  },
});