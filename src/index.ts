import { serve } from '@hono/node-server';
import { Hono } from 'hono'
import github from './auth/github'
//import { db } from './db/index'
import { authMiddleware } from './middleware/auth';
import dotenv from 'dotenv';
dotenv.config();

const app = new Hono()

app.route('/auth/github', github)

app.get('/api/users', async (c) => {
  //const users = await db.select().from(usersTable).all()
   console.log('GitHub auth middleware initialized with config:', {
        client_id: process.env.GITHUB_ID,
        client_secret: process.env.GITHUB_SECRET,
        scope: ['read:user']
    });
  return c.json({ message: "Hello from Hono API!" })
})

// Protected Group
const api = new Hono<{ Variables: { user: any } }>()
api.use('/*', authMiddleware)

serve({
  fetch: app.fetch,
  port: 3000
});