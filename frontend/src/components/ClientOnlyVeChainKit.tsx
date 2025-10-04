'use client';

import dynamic from 'next/dynamic';

const VeChainKitProvider = dynamic(
  async () => (await import('@/components/VeChainKitProvider')).VeChainKitProviderWrapper,
  { ssr: false }
);

export function ClientOnlyVeChainKit({ children }: { children: React.ReactNode }) {
  return (
    <VeChainKitProvider>
      {children}
    </VeChainKitProvider>
  );
}
