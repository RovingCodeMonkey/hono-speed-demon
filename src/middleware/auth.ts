import { createMiddleware } from 'hono/factory'
import { jwt } from 'hono/jwt'
import { db } from '../db/index'
import { usersTable } from '../db/schema'
import { eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'

type AuthVariables = {
  user: typeof usersTable.$inferSelect
  jwtPayload: { id: number }
}

export const authMiddleware = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
  // 1. Use Hono's built-in JWT verification first
  const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET!, alg: 'HS256' })
  
  return jwtMiddleware(c, async () => {
    const payload = c.get('jwtPayload')
    
    // 2. Fetch the actual user from your SQLite DB
    const user = await db.select().from(usersTable)
      .where(eq(usersTable.id, payload.id as number))
      .get()
      

    if (!user) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }

    // 3. Set the user in the context for future routes
    c.set('user', user)
    await next()
  })
})
