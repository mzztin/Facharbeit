import { Controller, Get, Post, Session } from '@nestjs/common';
import { MySession } from '../../context';

@Controller('rooms')
export class RoomController {
  @Get()
  async myRooms(@Session() session: MySession) {
    if (!session.userId) {
      return [];
    }
  }

  @Post()
  async create(@Session() session: MySession) {
    session.userId;
  }
}
