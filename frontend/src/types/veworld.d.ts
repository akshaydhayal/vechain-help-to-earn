// Type declarations for VeWorld wallet
declare global {
  interface Window {
    vechain?: {
      newConnexSigner?: (genesisId: string) => {
        connect: () => Promise<{ account: string; verified: boolean }>;
        signTx: (tx: unknown) => Promise<unknown>;
        signCert: (cert: unknown) => Promise<unknown>;
        request?: (params: { method: string; params?: unknown[] }) => Promise<string[]>;
        getAccount?: () => Promise<string>;
      };
      connect?: () => Promise<{ account: string; verified: boolean }>;
      request?: (params: { method: string; params?: unknown[] }) => Promise<string[]>;
      isInAppBrowser?: boolean;
      isConnected?: boolean;
      account?: string;
      [key: string]: unknown; // Allow any additional properties
    };
  }
}

export {};
