import {
	Body,
	Controller,
	Get,
	HttpException,
	NotFoundException,
	Param,
	Post,
	Session,
	UnauthorizedException
} from "@nestjs/common";
import { MySession } from "../../context";
import { LoginDTO } from "./dto/login.dto";
import { SignUpDTO } from "./dto/signup.dto";
import { JoinedRoomEntity } from "./joinedrooms.entity";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get()
	async findAll() {
		return await this.usersService.mapAllUsers();
	}

	@Get("/@me")
	async me(@Session() session: MySession) {
		if (session.userId) {
			return this.usersService.getMyself(session.userId, session.id);
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

		return this.usersService.getUserData(user);
	}

	@Get("/:id")
	async findOne(@Param("id") id: number) {
		const user = await this.usersService.getUserById(id);
		if (!user) {
			throw new NotFoundException("User with given ID not found");
		}

		return this.usersService.getUserData(user);
	}

	@Post("/joinedRoom/:room")
	async addToLog(@Param("room") room: string, @Session() session: MySession) {
		if (!session.userId) {
			throw new UnauthorizedException();
		}

		const entity = await this.usersService.getUserById(session.userId);
		if (!entity) {
			throw new UnauthorizedException();
		}

		const joinedRoom = await JoinedRoomEntity.findOne({
			where: {
				roomCode: room,
				user: entity
			}
		});

		if (joinedRoom) {
			joinedRoom.time = new Date();
			return await joinedRoom.save();
		}

		const create = new JoinedRoomEntity();
		create.user = entity;
		create.roomCode = room;
		create.time = new Date();
		return await create.save();
	}

	@Get("/joinedRoom/list")
	async getPastRooms(@Session() session: MySession) {
		const user = await this.usersService.getUserById(Number(session?.userId));
		if (!user) {
			console.log("unauth");
			throw new UnauthorizedException();
		}

		return await this.usersService.getPastRooms(user);
	}

	@Post("/signup")
	async signup(@Body() { username, password }: SignUpDTO, @Session() session: MySession) {
		try {
			const user = await this.usersService.createUser(username, password);
			this.usersService.safeSession(session, user);
			return true;
		} catch (e) {
			return false;
		}
	}

	@Post("/logout")
	async logout(@Session() session: MySession) {
		if (session.userId) {
			this.usersService.destroySession(session);
			return true;
		}

		throw new HttpException("Not logged in", 400);
	}

	@Post("/login")
	async login(@Body() body: LoginDTO, @Session() session: MySession) {
		const user = await this.usersService.validateLogin(body.username, body.password);

		this.usersService.addSessionToStore(session.id, user.id);
		this.usersService.addUserToSession(session, user);

		return true;
	}
}
