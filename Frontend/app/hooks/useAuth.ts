import { postData } from "@/lib/fetch-util";
import type { SignUpFormData } from "@/routes/auth/sign-up";
import { useMutation } from "@tanstack/react-query";

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: (data: SignUpFormData) => postData("/auth/register", data),
  });
};

export const useVerificationMutation = () => {
  return useMutation({
    mutationFn: (data: { token: string }) =>
      postData("/auth/verify-email", data),
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      postData("/auth/login", data),
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      postData("/auth/reset-password-request", data),
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: {
      token: string;
      newPassword: string;
      confirmNewPassword: string;
    }) => postData("/auth/reset-password", data),
  });
};
