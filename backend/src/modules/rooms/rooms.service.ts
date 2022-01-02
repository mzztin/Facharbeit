import { Injectable } from '@nestjs/common';
import RoomEntity from './room.entity';

@Injectable()
export class RoomsService {
  async getOwnRooms(userId: string): Promise<RoomEntity[]> {
    return await RoomEntity.find({
      where: {
        ownerId: userId,
      },
    });
  }
}
