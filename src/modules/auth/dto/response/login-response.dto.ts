import { SignupResponseDto } from './signup-response.dto';

export class LoginResponseDto extends SignupResponseDto {
  constructor(partial: Partial<LoginResponseDto>) {
    super(partial);
  }
}
