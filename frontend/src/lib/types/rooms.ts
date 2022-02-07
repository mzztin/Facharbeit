import type { User } from "./user";

export type Room = {
	id: number;
	name: string;
	ownerId: number;
	createdAt: string;
	code: string;
	messages: Array<Message>;
};

export type Message = {
	id: number;
	senderId: number;
	content: string;
	createdAt: string;
	room: Room;
};

export type MessageWithUser = Message & {
	user?: User;
}