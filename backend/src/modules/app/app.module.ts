import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { MessagesModule } from '../messages/messages.module';
import { RoomsModule } from '../rooms/rooms.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { SessionModule } from 'nestjs-session';
import { Pool } from 'pg';
import * as pgConnect from 'connect-pg-simple';
import * as session from 'express-session';

const PGStore = pgConnect(session);

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          type: 'postgres' as 'postgres',
          host: config.get('POSTGRES_HOST'),
          database: config.get('POSTGRES_DATABASE'),
          port: Number(config.get('POSTGRES_PORT')),
          username: config.get('POSTGRES_USERNAME'),
          password: config.get('POSTGRES_PASSWORD'),
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: config.get('dev') ? true : false,
          keepConnectionAlive: true,
        } as ConnectionOptions;
      },
    }),
    SessionModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const pool = new Pool({
          database: config.get('POSTGRES_DATABASE'),
          port: Number(config.get('POSTGRES_PORT')),
          user: config.get('POSTGRES_USERNAME'),
          password: config.get('POSTGRES_PASSWORD'),
        });

        return {
          session: {
            name: 'session',
            secret: config.get('SESSION_SECRET'),
            resave: false,
            saveUninitialized: true,
            cookie: {
              httpOnly: false,
              secure: false,
              maxAge: 1000 * 60 * 60 * 24 * 365,
              sameSite: 'lax',
            },
            store: new PGStore({
              pool: pool,
              tableName: 'session',
            }),
          },
        };
      },
    }),
    ConfigModule,
    UsersModule,
    MessagesModule,
    RoomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
