import {
	Body,
	Controller,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Post,
	Session,
	UnauthorizedException
} from "@nestjs/common";
import { MySession } from "../../context";
import { HashService } from "../hash/hash.service";
import { StoreService } from "../store/store.service";
import { LoginDTO } from "./dto/login.dto";
import { SignUpDTO } from "./dto/signup.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
	constructor(
		private usersService: UsersService,
		private hashService: HashService,
		private storeService: StoreService
	) {}

	@Get()
	async findAll() {
		return (await this.usersService.getUsers()).map((user) => {
			const { password, recievedMessages, sentMessages, ...userData } = user;

			const result = {
				...userData,
				stats: {
					messagesSent: sentMessages?.length ?? 0
				}
			};

			return result;
		});
	}

	@Get("/@me")
	async me(@Session() session: MySession) {
		if (session.userId) {
			const user = await this.usersService.getUserById(session.userId);
			if (!user) {
				throw new UnauthorizedException("You are not logged in");
			}

			this.storeService.addSession(session.id, user.id);

			const { sentMessages, recievedMessages, password, ...result }: any = user;

			result["sessionId"] = this.hashService.encryptSessionId(session.id);

			return result;
		}

		throw new UnauthorizedException("You are not logged in");
	}

	@Get("/:username")
	async findOneByUsername(@Param("username") username: string) {
		if (parseInt(username)) {
			return this.findOne(parseInt(username));
		}

		const user = await this.usersService.getUser(username);
		if (!user) {
			throw new NotFoundException("User with given username not found");
		}

		const { password, recievedMessages, sentMessages, ...result } = user;
		return result;
	}

	@Get("/:id")
	async findOne(@Param("id") id: number) {
		const user = await this.usersService.getUserById(id);
		if (!user) {
			throw new NotFoundException("User with given ID not found");
		}

		const { password, recievedMessages, sentMessages, ...result } = user;

		return result;
	}

	@Post("/signup")
	async signup(@Body() { username, password }: SignUpDTO, @Session() session: MySession) {
		try {
			const user = await this.usersService.createUser(username, password);
			console.log("user", user);

			session.regenerate((err) => {
				if (err) console.log(err);
			});
			session.userId = user.id;
			session.save();

			this.storeService.addSession(session.id, user.id);

			return true;
		} catch (e) {
			return false;
		}
	}

	@Post("/logout")
	async logout(@Session() session: MySession) {
		if (session.userId !== undefined) {
			this.storeService.removeSession(session.id);

			session.destroy((err) => {
				if (err) console.error(err);
			});
			return true;
		}

		return false;
	}

	@Post("/login")
	@HttpCode(201)
	async login(@Body() body: LoginDTO, @Session() session: MySession) {
		const user = await this.usersService.validateLogin(body.username, body.password);

		this.storeService.addSession(session.id, user.id);

		session.userId = user.id;
		session.save();

		return true;
	}
}
