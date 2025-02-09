export const MESSAGES = {
  weakPassword: 'Password is too weak',
  notMatch: ({
    property,
    propertyToMatch,
  }: {
    property: string;
    propertyToMatch: string;
  }) => `${property} does not match ${propertyToMatch}`,
  notExist: ({ property }: { property: string }) =>
    `${property} does not exist`,
  doesExist: ({ property }: { property: string }) =>
    `${property} does already exist`,
  notFond: ({ property }: { property: string }) => `No ${property} found`,
  notValid: ({ property }: { property: string }) => `${property} is not valid`,
} as const;

export const STRATEGIES_NAMES = {
  accessToken: 'jwt',
  refreshToken: 'jwt-refresh',
  google: 'google',
} as const;

export const DECORATORS_KEYS = {
  public: 'public',
} as const;
