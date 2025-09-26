import { API_BASE_URL, fetchApi } from "../fetchApi";
import type { signInRequest, signInResponse, signUpRequest } from "./types";

const signIn = (request: signInRequest): Promise<signInResponse> => {
  return fetchApi<signInResponse>(`${API_BASE_URL}/auth/signin`, {
    method: "POST",
    body: JSON.stringify(request),
  });
};

const signUp = (request: signUpRequest): Promise<boolean> => {
  return fetchApi<boolean>(
    `${API_BASE_URL}/auth/signup`,
    {
      method: "POST",
      body: JSON.stringify(request),
    },
    true
  );
};

export { signIn, signUp };
