import { registerAs } from '@nestjs/config';

export default registerAs('telegram', () => ({
  botToken: process.env.TELEGRAM_BOT_TOKEN,
  maxConcurrentJobs: parseInt(process.env.MAX_CONCURRENT_JOBS || '10'),
}));
