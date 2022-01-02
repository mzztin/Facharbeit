import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Session,
	UnauthorizedException,
	NotFoundException,
	ValidationPipe,
	Response,
	HttpCode
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { SignUpDTO } from "./dto/signup.dto";
import { LoginDTO } from "./dto/login.dto";
import { MySession } from "../../context";

@Controller("users")
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get()
	async findAll() {
		return (await this.usersService.getUsers()).map((user) => {
			let { password, recievedMessages, sentMessages, ...userData } = user;

			const result = {
				...userData,
				stats: {
					messagesSent: sentMessages?.length ?? 0
				}
			};

			return result;
		});
	}

	@Get("/me")
	async me(@Session() session: MySession) {
		if (session.userId) {
			const { sentMessages, recievedMessages, ...result } =
				await this.usersService.getUserById(session.userId);
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
	@HttpCode(201)
	async signup(@Body() { username, password }: SignUpDTO, @Session() session: MySession) {
		const user = await this.usersService.createUser(username, password);

		session.userId = user.id;

		return true;
	}

	@Post("/login")
	@HttpCode(201)
	async login(@Body() body: LoginDTO, @Session() session: MySession) {
		console.log("body", body);

		const user = await this.usersService.validateLogin(body.username, body.password);

		session.userId = user.id;

		return true;
	}
}
