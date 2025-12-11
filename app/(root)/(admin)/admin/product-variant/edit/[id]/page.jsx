"use client"
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_DASHBORD, ADMIN_PRODUCT_SHOW } from '@/routes/adminPanelRoute'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zSchema } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import ButtonLoading from '@/components/Application/ButtonLoading'
import slugify from 'slugify'
import toast from 'react-hot-toast'
import axios from 'axios'
import useFetch from '@/hooks/useFetch'
import Select from '@/components/Application/Select'
import Editor from '@/components/Application/Admin/Editor'
import MediaModel from '@/components/Application/Admin/MediaModel'
import Image from 'next/image'

const breadcrumbData = [
  { href: ADMIN_DASHBORD, label: 'home' },
  { href: ADMIN_PRODUCT_SHOW, label: 'products' },
  { href: '', label: 'Edit Product' }
]

const EditProduct = ({ params }) => {
  const { id } = React.use(params);

  const [loading, setLoading] = useState(false)
  const [categoryOption, setCategoryOption] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState([])

  const { data: getCategory } = useFetch('/api/category?deleteType=SD&&size=10000')
  const { data: getProduct, loading: getProductLoading } = useFetch(`/api/product/get/${id}`)

  useEffect(() => {
    if (getCategory?.success) {
      const options = getCategory.data.map((cat) => ({
        label: cat.name,
        value: cat._id
      }))
      setCategoryOption(options)
    }
  }, [getCategory])

  const formSchema = zSchema.pick({
    _id: true,
    name: true,
    slug: true,
    category: true,
    mrp: true,
    sellingPrice: true,
    discountPercentage: true,
    description: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: id,
      name: '',
      slug: '',
      category: '',
      mrp: '',
      sellingPrice: '',
      discountPercentage: '',
      description: ''
    }
  })

  useEffect(() => {
    if (getProduct?.success) {
      const product = getProduct.data

      form.reset({
        _id: product?._id,
        name: product?.name,
        slug: product?.slug,
        category: product?.category,
        mrp: product?.mrp,
        sellingPrice: product?.sellingPrice,
        discountPercentage: product?.discountPercentage,
        description: product?.description
      })

      if (product?.media) {
        const media = product.media
          .map(m => ({
            _id: m._id,
            url: m.secure_url || m.url || null
          }))
          .filter(m => m.url)  // remove invalid/null urls

        setSelectedMedia(media)
      }
    }
  }, [getProduct])

  useEffect(() => {
    const name = form.getValues("name")
    if (name) {
      form.setValue("slug", slugify(name).toLowerCase())
    }
  }, [form.watch("name")])

  useEffect(() => {
    const mrp = form.getValues('mrp') || 0
    const sellingPrice = form.getValues('sellingPrice') || 0
    const discountPercentage = mrp > 0 ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0
    form.setValue("discountPercentage", discountPercentage)
  }, [form.watch('mrp'), form.watch('sellingPrice')])

  const editor = (e, editor) => {
    const data = editor.getData()
    form.setValue('description', data)
  }

  const onSubmit = async (values) => {
    setLoading(true)

    try {
      if (selectedMedia.length <= 0) {
        setLoading(false)
        return toast.error("Please select media for product")
      }

      values.media = selectedMedia.map(media => media._id)

      const { data: response } = await axios.put(`/api/product/update`, values)

      if (!response.success) throw new Error(response.message)

      toast.success(response.message)

    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <h4 className='text-xl font-semibold'>Edit Product</h4>
        </CardHeader>

        <CardContent className='mb-5'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} >

              <div className='grid md:grid-cols-2 grid-cols-1 gap-5'>
                <FormField name="name" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="slug" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="category" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <FormControl>
                      <Select options={categoryOption} selected={field.value} setSelected={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="mrp" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>MRP *</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="sellingPrice" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Price *</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="discountPercentage" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount %</FormLabel>
                    <FormControl><Input readOnly {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className='md:col-span-2'>
                  <FormLabel>Description *</FormLabel>
                  {!getProductLoading && (
                    <Editor
                      key={form.watch("description")}
                      onChange={editor}
                      initialData={form.getValues("description")}
                    />
                  )}
                  <FormMessage />
                </div>
              </div>

              <div className='md:col-span-2 border border-dashed rounded p-5 text-center mt-5'>
                <MediaModel
                  open={open}
                  setOpen={setOpen}
                  selectedMedia={selectedMedia}
                  setSelectedMedia={setSelectedMedia}
                  isMultiple={true}
                />

                {selectedMedia.length > 0 && (
                  <div className='flex justify-center flex-wrap mb-3 gap-2'>
                    {selectedMedia.map(media => (
                      media?.url && (
                        <div key={media._id} className='h-24 w-24 border'>
                          <Image
                            src={media.url}
                            alt={media._id}
                            width={100} height={100}
                            className='size-full object-cover'
                          />
                        </div>
                      )
                    ))}
                  </div>
                )}

                <div
                  onClick={() => setOpen(true)}
                  className='bg-gray-50 border w-[200px] mx-auto p-5 cursor-pointer'
                >
                  <span className='font-semibold'>Select Media</span>
                </div>
              </div>

              <div className='mb-3 mt-5'>
                <ButtonLoading type="submit" text="Update Product" loading={loading} />
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditProduct
