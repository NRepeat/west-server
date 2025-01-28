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

  @IsNotEmpty()
  @IsString()
  firstName: IUser['firstName'];

  @IsNotEmpty()
  @IsString()
  lastName: IUser['lastName'];

  @IsNumber()
  telephone: IUser['telephone'];

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: MESSAGES.weakPassword,
  })
  password!: NonNullable<IUser['password']>;
}
