import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export default class MessageDTO {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
