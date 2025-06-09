import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowLeft, CheckCircle, Loader, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVerificationMutation } from "@/hooks/useAuth";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const token = searchParams.get("token");
  const { mutate, isPending: isVerifying } = useVerificationMutation();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      toast.error("Invalid or missing token");
      setIsSuccess(false);
      return;
    }

    mutate(
      { token },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message || "Verification failed";
          setIsSuccess(false);
          console.error(error);
          toast.error(errorMessage);
        },
      }
    );
  }, [searchParams, mutate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">VerifyEmail</h1>
      <p className="text-sm text-gray-500">Verifying your email...</p>
      <Card className="w-full max-w-md">
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            {isVerifying ? (
              <>
                <Loader className="w-10 h-10 text-gray-500 animate-spin" />
                <h3 className="text-lg font-semibold">Verifying Email...</h3>
                <p className="text-sm text-gray-500">
                  Please wait while we verify your email
                </p>
              </>
            ) : isSuccess === true ? (
              <>
                <CheckCircle className="w-10 h-10 text-green-500" />
                <h3 className="text-lg font-semibold">Email Verified</h3>
                <p className="text-sm text-gray-500">
                  Your email has been verified successfully
                </p>
                <Link className="text-sm text-blue-500 mt-6" to="/sign-in">
                  <Button variant="outline">Back to sign in</Button>
                </Link>
              </>
            ) : isSuccess === false ? (
              <>
                <XCircle className="w-10 h-10 text-red-500" />
                <h3 className="text-lg font-semibold">
                  Email Verification Failed
                </h3>
                <p className="text-sm text-gray-500">
                  Your email verification failed. Please try again
                </p>
                <Link className="text-sm text-blue-500 mt-6" to="/sign-in">
                  <Button variant="outline">Back to sign in</Button>
                </Link>
              </>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
