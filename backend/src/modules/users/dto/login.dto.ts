import {
  IsEmail,
  IsNotEmpty,
  Min,
  Max,
  MinLength,
  MaxLength,
  Matches,
  IsString,
} from 'class-validator';

export class LoginDTO {
  @MinLength(2, {
    message: 'The username can not be shorter than 2 chars',
  })
  @MaxLength(16, {
    message: 'The username can not be bigger than 16 letters',
  })
  @Matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gim)
  username: string;

  @IsString()
  password: string;
}
