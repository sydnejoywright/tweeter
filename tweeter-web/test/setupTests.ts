// test/setupTests.ts

// 1) Mock FontAwesome so brand icons don't spam console.error in tests
jest.mock("@fortawesome/react-fontawesome", () => ({
    __esModule: true,
    // Support both default and named imports without using JSX:
    default: () => null,
    FontAwesomeIcon: () => null,
  }));
  
  // 2) Optionally silence only the specific FA brand-icon messages
  const originalError: typeof console.error = console.error;
  
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (console as any).error = (...args: any[]) => {
      const msg = String(args[0] ?? "");
      if (msg.includes("Could not find icon { prefix: 'fab'")) return; // swallow FA warnings
      // Forward everything else
      originalError(...(args as Parameters<typeof originalError>));
    };
  });
  
  afterAll(() => {
    console.error = originalError;
  });
  