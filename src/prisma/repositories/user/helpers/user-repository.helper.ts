import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { CustomConfigService } from 'common/config/config.service';
import { IUser } from 'shared/types';

@Injectable()
export class UserRepositoryHelper {
  constructor(private customConfigService: CustomConfigService) {}
  getHashedRefreshToken({
    refreshToken,
  }: Pick<IUser, 'refreshToken'>): Promise<string> {
    return hash(
      refreshToken ?? '',
      this.customConfigService.BCRYPT_SALT_ROUNDS,
    );
  }
  async getHashedPassword({
    password,
  }: Pick<IUser, 'password'>): Promise<string> {
    return hash(password ?? '', this.customConfigService.BCRYPT_SALT_ROUNDS);
  }
}
