export class User {
  id: number;
  name: string;
  email: string;
  pictureUrl: string;
  isAdmin: boolean;
  language: string;
}

export class LoginResponse {
  token: string;
  user: User;
}

export class SetLanuageRequest {
  language: string;
}
