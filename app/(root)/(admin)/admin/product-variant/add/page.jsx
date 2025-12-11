"use client"
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_DASHBORD, ADMIN_PRODUCT_VARIANT_SHOW } from '@/routes/adminPanelRoute'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zSchema } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import ButtonLoading from '@/components/Application/ButtonLoading'
import toast from 'react-hot-toast'
import axios from 'axios'
import useFetch from '@/hooks/useFetch'
import Select from '@/components/Application/Select'
import MediaModel from '@/components/Application/Admin/MediaModel'
import Image from 'next/image'
import { sizes } from '@/lib/utils'

const breadcrumbData = [
  { href: ADMIN_DASHBORD, label: 'home' },
  { href: ADMIN_PRODUCT_VARIANT_SHOW, label: 'Product Variants' },
  { href: '', label: 'Add Product Variant' },
]

const AddProduct = () => {
  const [loading, setLoading] = useState(false)
  const [productOption, setproductOption] = useState([])
  const { data: getProduct } = useFetch('/api/product?deleteType=SD&&size=10000')
  const [open, setOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState([])

  useEffect(() => {
    if (getProduct?.success) {
      const options = getProduct.data.map(product => ({
        label: product.name,
        value: product._id,
        key: product._id
      }))
      setproductOption(options)
    }
  }, [getProduct])

  const formSchema = zSchema.pick({
    product: true,
    sku: true,
    color: true,
    size: true,
    mrp: true,
    sellingPrice: true,
    discountPercentage: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: "",
      sku: "",
      color: "",
      size: "",
      mrp: "",
      sellingPrice: "",
      discountPercentage: "",
    },
  })

  // ✅ Discount calculation
  const mrpWatch = form.watch("mrp")
  const sellingPriceWatch = form.watch("sellingPrice")

  useEffect(() => {
    const mrp = Number(mrpWatch) || 0
    const selling = Number(sellingPriceWatch) || 0
    const discount = mrp > 0 ? Math.round(((mrp - selling) / mrp) * 100) : 0
    form.setValue("discountPercentage", discount)
  }, [mrpWatch, sellingPriceWatch])

  const onSubmit = async (values) => {
    setLoading(true)

    try {
      if (selectedMedia.length <= 0) {
        toast.error("Please select media for product")
        return
      }

      values.media = selectedMedia.map(media => media._id)

      const { data: response } = await axios.post('/api/product-variant/create', values)
      if (!response.success) throw new Error(response.message)

      form.reset()
      setSelectedMedia([])
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
          <h4 className="text-xl font-semibold">Add Product Variant</h4>
        </CardHeader>

        <CardContent className="mb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-5">

                {/* Product */}
                <FormField
                  control={form.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Select
                          options={productOption}
                          selected={field.value || ""}
                          setSelected={field.onChange}
                          isMulti={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SKU */}
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter SKU" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Color */}
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter Color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Size */}
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Select
                          options={sizes}
                          selected={field.value || ""}
                          setSelected={field.onChange}
                          isMulti={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* MRP */}
                <FormField
                  control={form.control}
                  name="mrp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MRP<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter MRP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Selling Price */}
                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter Selling Price" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Discount */}
                <FormField
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount %</FormLabel>
                      <FormControl>
                        <Input type="number" readOnly {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

              {/* Media Upload */}
              <div className="md:col-span-2 border border-dashed rounded p-5 text-center mt-5">
                <MediaModel
                  open={open}
                  setOpen={setOpen}
                  selectedMedia={selectedMedia}
                  setSelectedMedia={setSelectedMedia}
                  isMultiple={true}
                />

                {selectedMedia.length > 0 && (
                  <div className="flex justify-center items-center flex-wrap mb-3 gap-2">
                    {selectedMedia.map(media => (
                      <div key={media._id} className="h-24 w-24 border">
                        <Image
                          src={media.url}
                          alt=""
                          width={100}
                          height={100}
                          className="size-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div onClick={() => setOpen(true)} className="bg-gray-50 dark:bg-card border w-[200px] mx-auto p-5 cursor-pointer">
                  <span className="font-semibold">Select Media</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mb-3 mt-5">
                <ButtonLoading
                  className="cursor-pointer"
                  type="submit"
                  text="Add Product Variant"
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

export default AddProduct
