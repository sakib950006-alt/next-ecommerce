"use client"
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBORD, ADMIN_PRODUCT_SHOW } from '@/routes/adminPanelRoute'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zSchema } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
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
    {href:ADMIN_DASHBORD, label : 'home'},
    {href : ADMIN_PRODUCT_SHOW, label : 'products'},
    {href : '', label : ' Add Product'}
]

const AddProduct = () => {
const [loading, setLoading] = useState(false)
const [categoryOption, setCategoryOption] = useState([])


const {data: getCategory} =useFetch('/api/category?deleteType=SD&&size=10000')
const [open , setOpen] = useState(false);
const [selectedMedia , setSelectedMedia] = useState([]);


useEffect(() => {
if(getCategory && getCategory.success){
const data = getCategory.data
const options = data.map((cat) =>({label: cat.name, value:cat._id}))
setCategoryOption(options)
}
},[getCategory])

 const formSchema = zSchema.pick({
    name:true,
    slug:true,
    category:true,
    mrp:true,
    sellingPrice:true,
    discountPercentage:true,
    description:true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
       name :'',
       slug :'',
       category: '',
       mrp:'',
       sellingPrice:'',
       discountPercentage:'',
       description:''

     
    },
  });

  const nameValue = form.watch('name')

useEffect(() => {
  if (nameValue) {
    form.setValue('slug', slugify(nameValue).toLowerCase())
  }
}, [nameValue])

useEffect(()=>{
const mrp = form.getValues('mrp') || 0
const sellingPrice = form.getValues('sellingPrice') || 0
const discountPercentage =
  mrp > 0 ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
form.setValue("discountPercentage", discountPercentage);

 },[form.watch('mrp'), form.watch('sellingPrice')])

const editor = (event,editor) =>{
const data = editor.getData()
form.setValue('description', data)
}



const onSubmit = async (values) => {
setLoading(true)

try {
    if(selectedMedia.length<=0){
      return toast.error("Please select media for product")
    }

const mediaIds = selectedMedia.map(media => media._id)
values.media = mediaIds

    const { data : response } = await axios.post('/api/product/create',values)
    if(!response.success){
        throw new Error(response.message)
    }
form.reset()
    toast.success(response.message)
   

} catch (error) {
    toast.error(error.message)
    
}finally{
    setLoading(false)
}



}


  return (
    <div>
        
<BreadCrumb breadcrumbData={breadcrumbData}/>





<Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <h4 className='text-xl font-semibold'>Add Product</h4>
        </CardHeader>

        <CardContent className='mb-5'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} >
             
             <div className='grid md:grid-cols-2 grid-cols-1 gap-5'>

              {/* ✅ Alt field */}
              <div className=''>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter Category Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ✅ Title field */}
              <div className=''>
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter Slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className=''>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                       <Select
                       options={categoryOption}
                       selected={field.value}
                       setSelected={field.onChange}
                       isMulti={false}
                       />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className=''>
                <FormField
                  control={form.control}
                  name="mrp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MRP <span className='text-red-500'>*</span></FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter MRP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className=''>
                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Prise <span className='text-red-500'>*</span></FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter Selling Prise" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <div className=''>
                <FormField
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Percentage <span className='text-red-500'>*</span></FormLabel>
                      <FormControl>
                        <Input type="number" readOnly placeholder="Enter Discount Percentage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <div className='md:col-span-2'>
<FormLabel className='mb-2'>Description <span className='text-red-500'>*</span></FormLabel>
                <Editor onChange={editor} />
                
                 <FormMessage></FormMessage>
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

{selectedMedia.length > 0 
&& <div className='flex justify-center items-center flex-wrap mb-3 gap-2'>
  {selectedMedia.map(media => (
    <div key={media._id} className='h-24 w-24 border'>
      <Image
      src={media.url}
      alt=''
      width={100}
      height={100}
      className='size-full object-cover'
      />
    </div>
  ))}
</div>
}


               <div onClick={()=> setOpen(true)} className='bg-gray-50 dark:bg-card border w-[200px] mx-auto p-5 cursor-pointer'>
                <span className='font-semibold'>Select Media</span>
               </div>
               </div>

              {/* ✅ Submit Button */}
              <div className='mb-3 mt-5 '>
                <ButtonLoading
                  className="cursor-pointer"
                  type="submit"
                  text="Add Product"
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