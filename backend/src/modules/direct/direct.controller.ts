import { Body, Controller, Get, Param, Post, Session, UnauthorizedException } from "@nestjs/common";
import { MySession } from "src/context";
import { DirectService } from "./direct.service";

@Controller("direct")
export class DirectController {
    constructor(private directService: DirectService) {}

    @Get(":user")
    async getMessages(@Param("user") targetId: number, @Session() session: MySession) {
        if (!session.userId) {
            throw new UnauthorizedException();
        }

        return this.directService.getMessages(session.userId, targetId);
    }

    @Post()
    async post(@Body() text: string, @Session() session: MySession) {
        console.log("called")
        return this.directService.createMessage(session.userId as number, 2, text);
    }
}