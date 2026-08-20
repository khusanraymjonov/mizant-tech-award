import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { resolveApiRuntimeConfig } from './runtime-config.js';

const runtime = resolveApiRuntimeConfig({
  NODE_ENV: process.env.NODE_ENV,
  API_PORT: process.env.API_PORT,
  API_HOST: process.env.API_HOST,
  WEB_ORIGINS: process.env.WEB_ORIGINS,
});
const app = await NestFactory.create(AppModule, {
  cors: { origin: [...runtime.corsOrigins], credentials: true },
});
app.setGlobalPrefix('v1');
await app.listen(runtime.port, runtime.host);
