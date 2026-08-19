const URL_POOL = [
  'https://example.com',
  'https://example.org',
  'https://github.com',
  'https://www.google.com',
  'https://www.wikipedia.org',
  'https://www.mozilla.org',
  'https://nodejs.org',
  'https://www.typescriptlang.org',
  'https://react.dev',
  'https://vuejs.org',
  'https://nestjs.com',
  'https://www.npmjs.com',
  'https://stackoverflow.com',
  'https://www.cloudflare.com',
  'https://httpbin.org/status/404',
  'https://httpbin.org/status/500',
  'https://httpbin.org/delay/2',
  'https://this-domain-should-not-exist-abc123.invalid',
];

/** Cycles through a curated pool of real, broken and slow URLs so demos show every outcome. */
export function generateTestUrls(count: number): string {
  const urls: string[] = [];

  for (let i = 0; i < count; i += 1) {
    const base = URL_POOL[i % URL_POOL.length];
    const cycle = Math.floor(i / URL_POOL.length);

    urls.push(cycle === 0 ? base : `${base}?t=${cycle}`);
  }

  return urls.join('\n');
}
