import { Hono } from 'hono';
import { githubAuth } from '@hono/oauth-providers/github';
import { sign } from 'hono/jwt';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';

const auth = new Hono();

// 1. Apply the GitHub middleware to the root of this sub-app
auth.use('/', githubAuth({
  client_id: process.env.GITHUB_ID!,
  client_secret: process.env.GITHUB_SECRET!,
  scope: ['read:user', 'user:email'],
  oauthApp: true,
}));

// 2. The Callback Logic
auth.get('/', async (c) => {
  const githubUser = c.get('user-github');
  if (!githubUser?.id || !githubUser.login || githubUser?.id.toString() !== process.env.GITHUB_ALLOWED) return c.json({ error: 'Auth failed' }, 401);

  let user = await db.select().from(usersTable)
    .where(eq(usersTable.githubId, githubUser.id.toString()))
    .get();

  if (!user) {
    [user] = await db.insert(usersTable).values({
      githubId: githubUser.id.toString(),
      name: githubUser.name ?? githubUser.login,
    }).returning();
  }

  const sessionToken = await sign({ id: user.id }, process.env.JWT_SECRET!);

  // Redirect to your React Frontend (S3/CloudFront)
  return c.redirect(`${process.env.FRONTEND_URL}/auth-callback?token=${sessionToken}`);
});

export default auth;
