import { resolve } from 'node:path';
import { defineNitroConfig } from 'nitro/config';

// https://nitro.build/config
export default defineNitroConfig({
  compatibilityDate: 'latest',
  srcDir: 'src',
  imports: false,
  openAPI: {
    meta: {
      title: 'Nitro App',
      description:
        'This is the API documentation for the Nitro App. This spec is only intended for developer reference on localhost.',
      version: '0.0.1-alpha.0',
    },
    route: '/openapi.json',
    production: false,
    ui: {
      scalar: {
        route: '/docs',
        theme: 'solarized',
      },
    },
  },
  experimental: {
    openAPI: true,
  },
  alias: {
    '@': resolve(process.cwd(), 'src'),
  },
});
