"use client";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import React, { useEffect, useState } from "react";
import verifiedImg from "@/public/assets/images/verified.gif";
import verificationFailedImg from "@/public/assets/images/verification-failed.gif";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WEBSITE_HOME } from "@/routes/websiteRoute";

const EmailVerification = ({ params }) => {
  const { token } = React.use(params); // ✅ use React.use() to unwrap params

  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const { data: verificationResponse } = await axios.post("/api/auth/verify-email", { token });
        if (verificationResponse.success) {
          setIsVerified(true);
        }
      } catch (err) {
        setIsVerified(false);
      }
    };
    verify();
  }, [token]);

  return (
    <Card className="w-[400px] mx-auto mt-20">
      <CardContent className="py-10">
        {isVerified ? (
          <div>
            <div className="flex justify-center items-center mb-4">
              <img src={verifiedImg.src} height={100} width={100} alt="Verified" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold my-5 text-green-500">Email Verified Successfully</h1>
              <Button asChild>
                <Link href={WEBSITE_HOME}>Continue Shopping</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-center items-center mb-4">
              <img src={verificationFailedImg.src} height={100} width={100} alt="Verification Failed" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold my-5 text-red-500">Email Verification Failed</h1>
              <Button asChild>
                <Link href={WEBSITE_HOME}>Continue Shopping</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailVerification;
