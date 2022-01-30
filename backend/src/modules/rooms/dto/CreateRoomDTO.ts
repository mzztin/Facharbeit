import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateRoomDTO {
    @MinLength(3)
    @MaxLength(16)
    @IsString()
    name: string;
}