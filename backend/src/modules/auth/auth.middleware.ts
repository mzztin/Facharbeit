import { NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { NextFunction } from "express";
import { MySession } from "../../../dist/context";
import { UsersService } from "../users/users.service";

export class AuthMiddleware implements NestMiddleware {
	constructor(private usersService: UsersService) {}

	async use(req: Request, _res: Response, next: NextFunction) {
		try {
			// @ts-expect-error
			const session: MySession = req.session;

			if (!session.userId) {
				throw new UnauthorizedException("Not logged in");
			}

			if (await this.usersService.getUserById(session.userId)) {
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
