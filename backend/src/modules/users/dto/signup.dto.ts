import { IsEmail, IsNotEmpty, Min, Max, MinLength, MaxLength, Matches } from "class-validator";

export class SignUpDTO {
	@MinLength(2)
	@MaxLength(16)
	username: string;

	@IsNotEmpty()
	password: string;
}
