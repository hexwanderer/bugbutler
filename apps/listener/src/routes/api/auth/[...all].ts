import { defineEventHandler } from 'h3';
import { auth } from '@/auth';

export default defineEventHandler((event) => {
  return auth.handler(event.req);
});
