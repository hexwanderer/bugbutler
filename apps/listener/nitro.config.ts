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
  routeRules: {
    // '/api/**': {
    //   cors: true,
    //   headers: {
    //     'Access-Control-Allow-Origin': 'http://localhost:57010',
    //     'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    //     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    //     'Access-Control-Allow-Credentials': 'true',
    //   },
    // },
  },
});
