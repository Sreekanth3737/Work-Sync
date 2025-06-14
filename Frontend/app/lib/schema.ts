import { ProjectStatus } from "@/types";
import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password is required"),
});
export const signUpSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be 8 characters"),
    confirmPassword: z.string().min(8, "Confirm Password is required"),

    name: z.string().min(3, "Name must be at least 3 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "New Password must be 8 characters"),
    confirmNewPassword: z.string().min(8, "Confirm New Password is required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords must match",
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const workspaceSchema = z.object({
  name: z.string().min(3, "name must be at least 3 characters"),
  description: z.string().optional(),
  color: z.string().min(3, "color must be at least 3 characters"),
});

export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  status: z.nativeEnum(ProjectStatus),
  dateGroup: z.object({
    startDate: z.string().min(10, "Start date is required"),
    dueDate: z.string().min(10, "Due date is required"),
  }),
  members: z
    .array(
      z.object({
        value: z.string(),
        role: z.enum(["manager", "contributor", "viewer"]),
      })
    )
    .optional(),
  tags: z
    .array(
      z.object({
        tag: z.string(),
        color: z.string(),
      })
    )
    .optional(),
});
