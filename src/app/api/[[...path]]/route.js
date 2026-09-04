import handler from '@/server/next-handler';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = handler.handle;
export const POST = handler.handle;
export const PUT = handler.handle;
export const PATCH = handler.handle;
export const DELETE = handler.handle;
export const OPTIONS = handler.handle;
