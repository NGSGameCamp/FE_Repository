interface signInRequest {
  email: string;
  pwd: string;
}

interface signInResponse {
  accessToken: string;
  userId: string;
  nickname: string;
  email: string;
}

interface signUpRequest {
  email: string;
  pwd: string;
  pwdCheck: string;
  name: string;
}

export type { signInRequest, signInResponse, signUpRequest };
