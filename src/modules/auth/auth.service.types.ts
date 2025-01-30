import { INormalizedUser } from 'shared/types';
import { UserToSignupDto } from './dto/user-to-signup.dto';

export interface SignupParams {
  userToSignup: UserToSignupDto;
}

export interface LoginParams {
  userToLogin: INormalizedUser;
}
