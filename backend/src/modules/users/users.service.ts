import { ConflictException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Socket } from "socket.io";
import { MySession } from "src/context";
import { HashService } from "../hash/hash.service";
import RoomEntity from "../rooms/room.entity";
import { StoreService } from "../store/store.service";
import { JoinedRoomEntity } from "./joinedrooms.entity";
import UserEntity from "./user.entity";

@Injectable()
export class UsersService {
	constructor(private readonly hashService: HashService, private storeService: StoreService) {}

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

		return user.save();
	}

	async mapAllUsers() {
		return (await this.getUsers()).map((user) => {
			const { password, ...userData } = user;

			const result = {
				...userData,
				avatar: `https://avatars.dicebear.com/api/adventurer-neutral/css33d${user.id}.svg`
			};

			return result;
		});
	}

	async getMyself(userId: number, sessionId: string) {
		const user = await this.getUserById(userId);

		if (!user) {
			throw new UnauthorizedException("You are not logged in");
		}

		const encryptedSID = await this.addSessionToStore(sessionId, userId);

		const { sentMessages, recievedMessages, password, ...result }: any = user;

		result["sessionId"] = encryptedSID;
		result["avatar"] = this.getAvatar(userId);

		return result;
	}

	getAvatar(userId: number): string {
		return `https://avatars.dicebear.com/api/adventurer-neutral/css33d${userId}.svg`;
	}

	async addSessionToStore(sessionId: string, userId: number) {
		this.storeService.addSession(sessionId, userId);
		return this.hashService.encryptSessionId(sessionId);
	}

	async safeSession(session: MySession, user: UserEntity) {
		this.destroySession(session);
		this.setSessionAndSave(session, user);
		this.addSessionToStore(session.id, user.id);
	}

	async addUserToSession(session: MySession, user: UserEntity) {
		session.userId = user.id;
	}

	async getPastRooms(user: UserEntity) {
		const joinedRooms = await JoinedRoomEntity.find({
			where: {
				user
			}
		});

		const rooms: RoomEntity[] = [];

		for (const room of joinedRooms) {
			rooms.push(
				await RoomEntity.findOneOrFail({
					where: {
						code: room.roomCode
					}
				})
			);
		}

		return rooms.map((room) => {
			let { messages, ...rest }: any = room;
			rest["lastActivity"] = joinedRooms.find((jr) => jr.roomCode == room.code)?.time;
			return rest;
		});
	}

	async getUserById(id: number) {
		const user = UserEntity.findOne(id);

		if (!user) {
			return undefined;
		}

		return user;
	}

	getUserData(user: UserEntity) {
		const { password, ...userData } = user;

		const result = {
			...userData,
			avatar: `https://avatars.dicebear.com/api/adventurer-neutral/css33d${user.id}.svg`
		};

		return result;
	}

	destroySession(session: MySession) {
		this.storeService.removeSession(session.id);

		session.destroy((err) => {
			if (err) {
				Logger.warn(`Could not destroy session`);
			}
		});
	}

	setSessionAndSave(session: MySession, user: UserEntity) {
		session.userId = user.id;
		session.save();
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
