// https://github.com/nestjs/nest/issues/445

// @ts-ignore
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as sharedsession from 'express-socket.io-session'

/**
 * Enable session tokens for web sockets by using express-socket.io-session
 */
export class MyAdapter extends IoAdapter {
  private app : NestExpressApplication;

  constructor(app : NestExpressApplication) {
      super();
      this.app = app
  }

  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options);
    server.use(sharedsession(this.app.getHttpServer().session));
    return server;
  }
}