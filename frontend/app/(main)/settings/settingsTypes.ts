import type { User } from "@/types/User";

export type ProfileForm = Pick<
  User,
  "firstName" | "lastName" | "email" | "phoneNumber"
>;

export type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
