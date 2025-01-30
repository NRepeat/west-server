import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { MESSAGES } from 'shared/constants';
import { IUser, IUserToSignup } from 'shared/types';

export class UserToSignupDto implements IUserToSignup {
  @IsNotEmpty()
  @IsEmail()
  email: IUser['email'];

  @IsString()
  firstName: IUser['firstName'];

  @IsString()
  lastName: IUser['lastName'];

  @IsNumber()
  telephone: IUser['telephone'];

  @IsString()
  @MinLength(5)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: MESSAGES.weakPassword,
  })
  password: IUser['password'];
}
