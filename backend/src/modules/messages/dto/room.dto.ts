import { IsNotEmpty, IsString } from "class-validator";

export class EnterRoomDTO {
    @IsString()
    @IsNotEmpty()
    code: string;
}