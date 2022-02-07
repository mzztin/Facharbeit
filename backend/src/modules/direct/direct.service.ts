import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { DirectMessageEntity } from "./direct.message.entity";

@Injectable()
export class DirectService {
    async disconnect(client: Socket) {
		client.disconnect(true);
	}

	async createMessage(sender: number, to: number, content: string) {
        const message = new DirectMessageEntity()
        message.from = sender;
        message.to = to;
        message.createdAt = new Date();
        message.content = content;

        return await message.save();
	}

	async reloadSocketUser(client: Socket) {
		client.emit("reload_page");
	}

	async getMessages(from: number, to: number) {
        const batch1 = await DirectMessageEntity.createQueryBuilder("dm")
            .where("dm.from = :from", { from })
            .where("dm.to = :to", { to })
            .getMany()
        

        
        return batch1;
        
        }

}