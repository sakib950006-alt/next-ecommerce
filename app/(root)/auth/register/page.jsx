"use client"
import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Logo from '@/public/assets/images/logo-black.png'
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { zSchema } from '@/lib/zodSchema'
import { FaRegEyeSlash } from "react-icons/fa"
import { FaRegEye } from 'react-icons/fa6'
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { IoMdCheckbox } from "react-icons/io";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import ButtonLoading from '@/components/Application/ButtonLoading'
import z from 'zod'
import Link from 'next/link'
import { WEBSITE_LOGIN } from '@/routes/websiteRoute'
import axios from 'axios'

const RegisterPage = () => {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const formSchema = zSchema.pick({
    name: true,
    email: true,
    password: true
  }).extend({
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password must be same",
    path: ['confirmPassword']
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const handleRegisterSubmit = async (value) => {
    try {
      setLoading(true)
      const { data: registerResponse } = await axios.post('/api/auth/register', value)

      if (!registerResponse.success) {
        throw new Error(registerResponse.message)
      }
       
      form.reset()  
      
      toast.success(registerResponse.message || "Registration successful, please check your email for verification link.")
     
      
    } catch (error) {
      console.error(error)
      toast.error(error.message || "Something went wrong")
      
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className='w-[400px]'>
      <CardContent>
        <div className='flex justify-center'>
          <Image src={Logo.src} width={Logo.width} height={Logo.height} alt='logo' className='max-w-[150px]' />
        </div>
        <div className='text-center mb-6'>
          <h1 className='text-3xl font-bold'>Create Account!</h1>
          <p>Create new account by filling out the form below.</p>
        </div>

        <div className="mt-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegisterSubmit)}>

              {/* Name Field */}
              <div className='mb-6'>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Developer Shakib" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email Field */}
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

              {/* Password Field */}
              <div className='mb-6'>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type={showPassword ? 'text' : 'password'} placeholder="******" {...field} />
                      </FormControl>
                      <button
                        className='absolute top-9 right-3 cursor-pointer text-gray-500'
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                      </button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Confirm Password Field */}
              <div className='mb-6'>
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="******" {...field} />
                      </FormControl>
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          {showConfirmPassword ? <IoMdCheckbox /> : <MdCheckBoxOutlineBlank />}
                          <span>Show Password</span>
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>     
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className='mb-3'>
                <ButtonLoading
                  className="w-full cursor-pointer"
                  type="submit"
                  text="Create Account"
                  loading={loading}
                />
              </div>

              {/* Login Link */}
              <div className='text-center'>
                <div className='flex justify-center items-center gap-1'>
                  <p>Already have an account?</p>
                  <Link href={WEBSITE_LOGIN} className='text-primary underline'>Login!</Link>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  )
}

export default RegisterPage
