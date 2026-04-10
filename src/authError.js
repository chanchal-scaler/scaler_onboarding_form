export class AuthError extends Error {
  constructor(message = "Authentication required.", status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

export function isAuthError(error) {
  return error instanceof AuthError || error?.name === "AuthError";
}
