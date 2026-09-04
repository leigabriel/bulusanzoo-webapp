import handler from '@/server/next-handler';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = handler.handle;
export const POST = handler.handle;
