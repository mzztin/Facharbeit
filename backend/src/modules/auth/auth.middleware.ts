import { NestMiddleware, Session, UnauthorizedException } from '@nestjs/common';
import { NextFunction } from "express";
import { UsersService } from "../users/users.service";
import * as session from 'express-session';
import { MySession } from '../../../dist/context';

export class AuthMiddleware implements NestMiddleware {
    constructor(private usersService: UsersService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            // @ts-expect-error
            const session: MySession = req.session;

            if (!session.userId) {
                throw new UnauthorizedException("Not logged in");
            }

            if(this.usersService.getUserById(session.userId)) {
                next();
            } else {
                session.userId = undefined;
                throw new UnauthorizedException("Not logged in");
            }
        } catch (e) {
            throw new UnauthorizedException("Not logged in");
        }
    }
}