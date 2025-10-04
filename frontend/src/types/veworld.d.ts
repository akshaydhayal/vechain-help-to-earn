// Type declarations for VeWorld wallet
declare global {
  interface Window {
    vechain?: {
      newConnexSigner?: (genesisId: string) => {
        connect: () => Promise<{ account: string; verified: boolean }>;
        signTx: (tx: unknown) => Promise<unknown>;
        signCert: (cert: unknown) => Promise<unknown>;
      };
      connect?: () => Promise<{ account: string; verified: boolean }>;
      request?: (params: { method: string; params?: unknown[] }) => Promise<string[]>;
      isInAppBrowser?: boolean;
      isConnected?: boolean;
      account?: string;
    };
  }
}

export {};
