import {
  IsEmail,
  IsNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { MESSAGES } from 'shared/constants';
import { IUser } from 'shared/types';

export class UserToLoginDto {
  @IsEmail()
  email: IUser['email'];

  @IsNumber()
  telephone: IUser['telephone'];

  @IsString()
  @MinLength(5)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: MESSAGES.weakPassword,
  })
  password: IUser['password'];
}
