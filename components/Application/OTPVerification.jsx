import React, { useState } from "react";
import ButtonLoading from "./ButtonLoading";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import {toast} from 'react-hot-toast'




// ✅ Define schema directly here or import from zodSchema if already defined
const otpSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
});

const OTPVerification = ({ email, onSubmit, loading }) => {
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
      email: email || ""
    }
  });

  const handleOtpVerification = async (values) => {
    onSubmit(values); // Pass values to parent
  };

  const resendOtp = async () => {
    try {
      setIsResendingOtp(true);
      const { data : resendOtpResponse} = await axios.post("/api/auth/resend-otp", { email });

      if (!resendOtpResponse.success) {
        throw new Error(resendOtpResponse.message);
      }

      toast.success(resendOtpResponse.message);

    } catch (error) {
      console.error(error);
      alert(error)
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setIsResendingOtp(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOtpVerification)}>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Please complete verification</h1>
            <p className="text-md">
              We have sent a One-time password (OTP) to your registered email address.
              The OTP is valid for 10 minutes only
            </p>
          </div>

          <div className="mb-6 mt-5 flex justify-center">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">One-time password (OTP)</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={field.value ?? ""} // Ensure controlled value
                      onChange={field.onChange}
                    >
                      <InputOTPGroup>
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <InputOTPSlot key={index} className="text-xl size-10" index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mb-3">
            <ButtonLoading
              className="w-full cursor-pointer"
              type="submit"
              text="Login"
              loading={loading}
            />
            <div className="text-center mt-5">
              {!isResendingOtp ? (
                <button
                  onClick={resendOtp}
                  type="button"
                  className="text-blue-500 mt-4 cursor-pointer hover:underline"
                  disabled={isResendingOtp}
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-md">Resending...</span>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OTPVerification;
