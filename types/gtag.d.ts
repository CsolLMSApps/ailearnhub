// TypeScript declarations for Google Analytics
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'consent',
      targetId: string | 'update',
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

export {};
