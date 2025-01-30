export class RefreshResponseDto {
  refreshToken: string;
  accessToken: string;

  constructor(partial: Partial<RefreshResponseDto>) {
    Object.assign(this, partial);
  }
}
