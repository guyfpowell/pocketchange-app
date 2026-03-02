// ─── atob polyfill (used by auth.service JWT decoder) ────────────────────────
if (typeof global.atob === 'undefined') {
  global.atob = (b64: string) => Buffer.from(b64, 'base64').toString('binary');
}

// ─── Silence known noisy warnings in test output ──────────────────────────────
const originalWarn = console.warn.bind(console);
beforeAll(() => {
  console.warn = (msg: string, ...args: unknown[]) => {
    if (
      typeof msg === 'string' &&
      (msg.includes('ReactCurrentDispatcher') ||
        msg.includes('act(') ||
        msg.includes('Warning: An update to'))
    ) {
      return;
    }
    originalWarn(msg, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
});
