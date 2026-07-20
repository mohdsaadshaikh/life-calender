import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users, globalSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  let evt: WebhookEvent;
  try {
    // Automatically uses CLERK_WEBHOOK_SIGNING_SECRET from environment
    evt = await verifyWebhook(req) as WebhookEvent;
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Verification failed', { status: 400 });
  }

  const { type, data } = evt;

  if (type === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = data;
    const email = email_addresses?.[0]?.email_address;
    if (!email) {
      return new Response('Missing email address', { status: 400 });
    }

    try {
      // 1. Sync User to Database
      await db.insert(users).values({
        clerkId: id,
        email,
        firstName: first_name ?? null,
        lastName: last_name ?? null,
        imageUrl: image_url ?? null,
      });

      // 2. Initialize Default Settings for this User
      await db.insert(globalSettings).values({
        userId: id,
        weekStartsOn: 1,
        showFutureWeeks: true,
        theme: 'light',
      });
    } catch (dbErr) {
      console.error('Failed to create user in database:', dbErr);
      return new Response('Database error', { status: 500 });
    }
  }

  if (type === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = data;
    const email = email_addresses?.[0]?.email_address;
    if (!email) {
      return new Response('Missing email address', { status: 400 });
    }

    try {
      await db.update(users)
        .set({
          email,
          firstName: first_name ?? null,
          lastName: last_name ?? null,
          imageUrl: image_url ?? null,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, id));
    } catch (dbErr) {
      console.error('Failed to update user in database:', dbErr);
      return new Response('Database error', { status: 500 });
    }
  }

  if (type === 'user.deleted') {
    const { id } = data;
    if (id) {
      try {
        // Cascading deletes will remove associated calendars, events, and settings
        await db.delete(users).where(eq(users.clerkId, id));
      } catch (dbErr) {
        console.error('Failed to delete user from database:', dbErr);
        return new Response('Database error', { status: 500 });
      }
    }
  }

  return new Response('Webhook handled successfully', { status: 200 });
}
