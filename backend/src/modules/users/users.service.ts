import {
	ConflictException,
	Injectable,
	UnauthorizedException
} from "@nestjs/common";
import { Socket } from "socket.io";
import { HashService } from "../hash/hash.service";
import UserEntity from "./user.entity";

@Injectable()
export class UsersService {
	constructor(private readonly hashService: HashService) {}

	async existsUser(username: string): Promise<boolean> {
		const user = await this.getUser(username);
		if (user) return true;

		return false;
	}

	async createUser(username: string, password: string): Promise<UserEntity> {
		if (await this.existsUser(username)) {
			throw new ConflictException("User with given username already exists");
		}

		const user = new UserEntity();
		user.username = username;
		user.password = this.hashService.hashPassword(password);
		user.createdAt = new Date();
		user.sentMessages = [];
		user.recievedMessages = [];

		return user.save();
	}

	async getUserById(id: number) {
		const user = UserEntity.findOne(id);

		if (!user) {
			return undefined;
		}

		return user;
	}

	async getUser(username: string): Promise<UserEntity | undefined> {
		const users = await UserEntity.createQueryBuilder("user")
			.where("LOWER(user.username) = LOWER(:username)", { username })
			.getMany();

		if (users.length == 0) {
			return undefined;
		}

		return users[0];
	}

	async getUsers() {
		return await UserEntity.find();
	}

	async validateLogin(username: string, password: string) {
		const user = await this.getUser(username);

		if (!user) {
			throw new UnauthorizedException("User does not exist");
		}

		if (!this.hashService.matches(user.password, password)) {
			throw new UnauthorizedException("Password does not match with user");
		}

		return user;
	}

	async getSocketUserByCookie(socket: Socket) {
		const cookie = socket.handshake.headers.cookie;

		if (!cookie) {
			return null;
		}

		return "TODO";
	}
}
