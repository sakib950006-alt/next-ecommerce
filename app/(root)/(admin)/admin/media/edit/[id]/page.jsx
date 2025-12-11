"use client"
import React, { useEffect, useState } from "react"
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/useFetch'
import { zSchema } from '@/lib/zodSchema'
import { ADMIN_DASHBORD, ADMIN_MEDIA_SHOW } from '@/routes/adminPanelRoute'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import imgplaceholder from '@/public/assets/images/img-placeholder.webp'
import axios from "axios"
import toast from "react-hot-toast"

// ✅ Breadcrumb data
const breadCrumbData = [
  { href: ADMIN_DASHBORD, label: 'Home' },
  { href: ADMIN_MEDIA_SHOW, label: 'Media' },
  { href: "", label: "Edit Media" }
]

export default function EditMedia({ params }) {
  // ✅ Next.js 15+ params is Promise → unwrap with React.use()
  const { id } = React.use(params)

  const { data: mediaData } = useFetch(`/api/media/get/${id}`)
  const [loading, setLoading] = useState(false)

  // ✅ Schema for validation
  const formSchema = zSchema.pick({
    _id: true,
    alt: true,
    title: true
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: "",
      alt: "",
      title: ""
    },
  });

  // ✅ Reset form when data loads
  useEffect(() => {
    if (mediaData && mediaData.success) {
      const data = mediaData.data
      form.reset({
        _id: data._id,
        alt: data.alt,
        title: data.title
      })
    }
  }, [mediaData, form])

  // ✅ Submit handler
  const onSubmit = async (values) => {
    try {
      setLoading(true)
      const { data: response } = await axios.put('/api/media/update', values)

      if (!response.success) {
        throw new Error(response.message)
      }
      toast.success(response.message || "Media updated successfully ✅")
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <BreadCrumb breadcrumbData={breadCrumbData} />

      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <h4 className='text-xl font-semibold'>Edit Media</h4>
        </CardHeader>

        <CardContent className='mb-5'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* ✅ Image Preview */}
              <div className='mb-5'>
                <Image
                  src={mediaData?.data?.path || imgplaceholder}
                  width={200}
                  height={200}
                  alt={mediaData?.data?.alt || "Image"}
                />
              </div>

              {/* ✅ Alt field */}
              <div className='mb-6'>
                <FormField
                  control={form.control}
                  name="alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter Alt" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ✅ Title field */}
              <div className='mb-6'>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ✅ Submit Button */}
              <div className='mb-3'>
                <ButtonLoading
                  className="cursor-pointer"
                  type="submit"
                  text="Update Media"
                  loading={loading}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
