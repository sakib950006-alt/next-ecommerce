"use client";

import { Card, CardContent } from '@/components/ui/card';
import React, { useState } from 'react';
import Logo from '@/public/assets/images/logo-black.png';
import Image from 'next/image';
import { zodResolver } from "@hookform/resolvers/zod";
import { zSchema } from '@/lib/zodSchema';
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from 'react-icons/fa6';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
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
import z from 'zod';
import Link from 'next/link';
import { USER_DASHBORD, WEBSITE_REGISTER, WEBSITE_RESETPASSWORD } from '@/routes/websiteRoute';
import axios from 'axios';
import OTPVerification from '@/components/Application/OTPVerification';
import { useDispatch } from 'react-redux';
import { login } from '@/store/reducer/authReducer';
import { useRouter, useSearchParams } from 'next/navigation';
import { ADMIN_DASHBORD } from '@/routes/adminPanelRoute';

const LoginPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [OTPVerificationLoading, setOTPVerificationLoading] = useState(false);
  const [isTypePassword, setIsTypePassword] = useState(true);
  const [otpEmail, setOtpEmail] = useState('');

  const formSchema = zSchema.pick({
    email: true,
  }).extend({
    password: z.string().min(3, 'Password must be at least 3 characters'),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // ✅ Login submit
  const handleLoginSubmit = async (value) => {
    try {
      setLoading(true);
      console.log("🔹 Sending login request with payload:", value);

      const { data: otpResponse } = await axios.post('/api/auth/login', value);

      console.log("✅ Login API Response:", otpResponse);

      if (!otpResponse.success) {
        throw new Error(otpResponse.message);
      }

      setOtpEmail(value.email);
      form.reset();
      toast.success(otpResponse.message || "Login successful!");

    } catch (error) {
      console.error("❌ Login error (full):", error);

      if (error.response) {
        console.log("📌 Backend Status:", error.response.status);
        console.log("📌 Backend Data:", error.response.data);

        toast.error(error.response.data.message || "Something went wrong");
      } else {
        toast.error(error.message || "Something went wrong");
      }

    } finally {
      setLoading(false);
    }
  };

  // ✅ OTP Verification submit
  const handleOtpverification = async (values) => {
    try {
      setOTPVerificationLoading(true);
      console.log("🔹 Sending OTP verification payload:", values);

      const { data: otpResponse } = await axios.post('/api/auth/verify-otp', values);

      console.log("✅ OTP API Response:", otpResponse);

      if (!otpResponse.success) {
        throw new Error(otpResponse.message);
      }

      setOtpEmail('');
      toast.success(otpResponse.message);
      dispatch(login(otpResponse.data));

if(searchParams.has('callback')) {
router.push(searchParams.get('callback'));
}else {
  otpResponse.data.role ==='admin' ? router.push(ADMIN_DASHBORD) : router.push(USER_DASHBORD);
}


    } catch (error) {
      console.error("❌ OTP verification error (full):", error);

      if (error.response) {
        console.log("📌 Backend Status:", error.response.status);
        console.log("📌 Backend Data:", error.response.data);

        toast.error(error.response.data.message || "Something went wrong");
      } else {
        toast.error(error.message || "Something went wrong");
      }

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

        {!otpEmail ? (
          <>
            <div className='text-center mb-6'>
              <h1 className='text-3xl font-bold'>Login Into Account</h1>
              <p>Login into account by filling out the form below</p>
            </div>

            <div className="mt-5">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLoginSubmit)}>
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

                  <div className='mb-6'>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type={isTypePassword ? 'password' : 'text'}
                              placeholder="******"
                              {...field}
                            />
                          </FormControl>
                          <button
                            className='absolute top-1/2 right-2 cursor-pointer'
                            type='button'
                            onClick={() => setIsTypePassword(!isTypePassword)}
                          >
                            {isTypePassword ? <FaRegEyeSlash /> : <FaRegEye />}
                          </button>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='mb-3'>
                    <ButtonLoading
                      className="w-full cursor-pointer"
                      type="submit"
                      text="Login"
                      loading={loading}
                    />
                  </div>

                  <div className='text-center'>
                    <div className='flex justify-center items-center gap-1'>
                      <p>Don't have an account?</p>
                      <Link href={WEBSITE_REGISTER} className='text-primary underline'>
                        Create account!
                      </Link>
                    </div>
                    <div className='mt-3'>
                      <Link href={WEBSITE_RESETPASSWORD} className='text-primary underline'>
                        Forget password?
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </>
        ) : (
          <OTPVerification
            email={otpEmail}
            onSubmit={handleOtpverification}
            loading={OTPVerificationLoading}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default LoginPage;
