"use client"
import { Card, CardContent } from '@/components/ui/card';
import React, { useState } from 'react';
import Logo from '@/public/assets/images/logo-black.png';
import Image from 'next/image';
import { zodResolver } from "@hookform/resolvers/zod";
import { zSchema } from '@/lib/zodSchema';

import { toast } from 'react-hot-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import ButtonLoading from '@/components/Application/ButtonLoading';

import Link from 'next/link';
import { WEBSITE_LOGIN } from '@/routes/websiteRoute';
import axios from 'axios';
import OTPVerification from '@/components/Application/OTPVerification';
import UpdatePassword from '@/components/Application/UpdatePassword';


const ResetPassword = () => {
  const [emailVerificationLoading, setEmailVerificationLoading] = useState(false)
  const [OTPVerificationLoading, setOTPVerificationLoading] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false)

  const formSchema = zSchema.pick({
    email: true
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  })

  // Step 1: Send OTP
  const handleEmailVerification = async (values) => {
    try {
      setEmailVerificationLoading(true);
      const { data: sendOtpResponse } = await axios.post('/api/auth/reset-password/send-otp', values);

      if (!sendOtpResponse.success) {
        throw new Error(sendOtpResponse.message);
      }

      setOtpEmail(values.email);  // ✅ email set karna hai
      toast.success(sendOtpResponse.message);

    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setEmailVerificationLoading(false); // ✅ sahi variable update
    }
  }

  // Step 2: Verify OTP
  const handleOtpVerification = async (values) => {
    try {
      setOTPVerificationLoading(true);
      const { data: otpResponse } = await axios.post('/api/auth/reset-password/verify-otp', values);

      if (!otpResponse.success) {
        throw new Error(otpResponse.message);
      }

      toast.success(otpResponse.message);
      setIsOtpVerified(true);  // ✅ OTP sahi hone par password form dikhega

    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setOTPVerificationLoading(false);
    }
  };

  return (
    <Card className='w-[400px]'>
      <CardContent>
        <div className='flex justify-center'>
          <Image src={Logo.src} width={Logo.width} height={Logo.height} alt='logo' className='max-w-[150px]' />
        </div>

        {/* Step 1: Email Form */}
        {!otpEmail ? (
          <>
            <div className='text-center mb-6'>
              <h1 className='text-3xl font-bold'>Reset Password</h1>
              <p>Enter your email for password reset.</p>
            </div>

            <div className="mt-5">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleEmailVerification)}>
                  <div className='mb-6'>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="example@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='mb-3'>
                    <ButtonLoading
                      className="w-full cursor-pointer"
                      type="submit"
                      text="Send OTP"
                      loading={emailVerificationLoading}
                    />
                  </div>

                  <div className='text-center'>
                    <Link href={WEBSITE_LOGIN} className='text-primary underline'>
                      Back to Login
                    </Link>
                  </div>
                </form>
              </Form>
            </div>
          </>
        ) : (
          <>
            {/* Step 2: OTP Verification */}
            {!isOtpVerified ? (
              <OTPVerification
                email={otpEmail}
                onSubmit={handleOtpVerification}
                loading={OTPVerificationLoading}
              />
            ) : (
              /* Step 3: Update Password */
              <UpdatePassword email={otpEmail} />
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default ResetPassword
