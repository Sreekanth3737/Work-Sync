import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { signInSchema } from "@/lib/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { useLoginMutation } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useAuth } from "@/provider/auth-context";
import { Loader2 } from "lucide-react";

type SignInFormData = z.infer<typeof signInSchema>;

const FORM_DATA = [
  {
    name: "email",
    type: "email",
    placeholder: "Enter your email",
    label: "Email",
  },
  {
    name: "password",
    type: "password",
    placeholder: "*********",
    label: "Password",
  },
];

const SignIn = () => {
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const { mutate, isPending } = useLoginMutation();
  const { login } = useAuth();

  const handleOnSubmit = (values: SignInFormData) => {
    mutate(values, {
      onSuccess: (data) => {
        login(data);
        toast.success("Login successful");
        navigate("/dashboard");
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "Login failed";
        toast.error(errorMessage);
        console.error(error);
      },
    });
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="text-center mb-5">
          <CardTitle className="text-2xl font-bold"> Welcome back</CardTitle>

          <CardDescription className="text-sm text-muted-foreground">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(handleOnSubmit)}
            >
              {FORM_DATA.map((item) => {
                return (
                  <FormField
                    key={item.name}
                    control={form.control}
                    name={item.name as keyof SignInFormData}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>{item.label}</FormLabel>
                          {item.name === "password" && (
                            <Link
                              to="/forgot-password"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Forgot password?
                            </Link>
                          )}
                        </div>
                        <FormControl>
                          <Input
                            type={item.type}
                            placeholder={item.placeholder}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}
              <Button disabled={isPending} type="submit" className="w-full">
                {isPending ? <Loader2 className="w-4 h-4 mr-2" /> : "Sign in"}
              </Button>
            </form>
          </Form>
          <CardFooter className="flex items-center justify-center mt-5">
            <div className="flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  className="text-sm text-blue-600 hover:underline"
                  to="/sign-up"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
