import { fetchApi } from "../fetchApi";
import type { signInRequest, signInResponse, signUpRequest } from "./types";

const signIn = (request: signInRequest): Promise<signInResponse> => {
  return fetchApi<signInResponse>(`/auth/signin`, {
    method: "POST",
    body: JSON.stringify(request),
  });
};

const signUp = (request: signUpRequest): Promise<boolean> => {
  return fetchApi<boolean>(
    `/auth/signup`,
    {
      method: "POST",
      body: JSON.stringify(request),
    },
    true
  );
};

export { signIn, signUp };
