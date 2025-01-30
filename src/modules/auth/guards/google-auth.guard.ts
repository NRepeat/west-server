import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGIES_NAMES } from 'shared/constants';

@Injectable()
export class GoogleOauthGuard extends AuthGuard(STRATEGIES_NAMES.google) {}
