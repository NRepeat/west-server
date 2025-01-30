import { UserToLoginDto } from './dto/user-to-login.dto';
import { UserToSignupDto } from './dto/user-to-signup.dto';

export interface SignupParams {
  userToSignup: UserToSignupDto;
}

export interface LoginParams {
  userToLogin: UserToLoginDto;
}
