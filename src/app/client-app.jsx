'use client';

import dynamic from 'next/dynamic';

const LegacyApp = dynamic(() => import('@/legacy-app'), { ssr: false });

export default function ClientApp() {
  return <LegacyApp />;
}
