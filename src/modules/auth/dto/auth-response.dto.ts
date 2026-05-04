export class RegisterResponseDto {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  account: {
    id: string;
    email: string;
    roles: string[];
  };
}
