"use client"
import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

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

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { WEBSITE_LOGIN } from '@/routes/websiteRoute'

const UpdatePassword = ({ email }) => {
    const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const formSchema = zSchema.pick({
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
   email : email,
      password: '',
      confirmPassword: '',
    },
  })

  const handlePasswordUpdate = async (value) => {
    try {
      setLoading(true)
      const { data: passwordUpdate } = await axios.put('/api/auth/reset-password/update-password', value)

      if (!passwordUpdate.success) {
        throw new Error(passwordUpdate.message)
      }
       
      form.reset()  
      
      toast.success( "Registration successful, please check your email for verification link.")
     router.push(WEBSITE_LOGIN)
      
    } catch (error) {
      console.error(error)
      toast.error(error.message || "Something went wrong")
      
    } finally {
      setLoading(false)
    }
  }

  return (
    
      <div>
       
        <div className='text-center mb-6'>
          <h1 className='text-3xl font-bold'>Update Password</h1>
          <p>Create new password by filling below form.</p>
        </div>

        <div className="mt-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePasswordUpdate)}>

              {/* Name Field */}
            

              {/* Email Field */}
          
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
                  text="Update Password"
                  loading={loading}
                />
              </div>

              {/* Login Link */}
             
            </form>
          </Form>
        </div>
      </div>
    
  )
}

export default UpdatePassword
