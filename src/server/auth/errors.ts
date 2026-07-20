import { CredentialsSignin } from "next-auth";

export class InvalidCredentialsError extends CredentialsSignin {
  error = "invalid_credentials";
}

export class UserNotFoundError extends CredentialsSignin {
  error = "user_not_found";
}

export class ValidationError extends CredentialsSignin {
  error = "validation_error";
}

export class UserNameTakeError extends CredentialsSignin {
  error = "user_name_taken";
}

export class DatabaseError extends CredentialsSignin {
  error = "database_error";
}
