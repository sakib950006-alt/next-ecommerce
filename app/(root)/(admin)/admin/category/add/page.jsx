"use client"
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBORD } from '@/routes/adminPanelRoute'
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

const breadcrumbData = [
    {href:ADMIN_DASHBORD, label : 'home'},
    {href : ADMIN_CATEGORY_SHOW, label : 'Category'},
    {href : '', label : ' Add Category'}
]

const AddCategory = () => {
const [loading, setLoading] = useState(false)

 const formSchema = zSchema.pick({
    name:true, slug:true
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
     
    },
  });

  const nameValue = form.watch('name')

useEffect(() => {
  if (nameValue) {
    form.setValue('slug', slugify(nameValue).toLowerCase())
  }
}, [nameValue])


const onSubmit = async (values) => {
setLoading(true)

try {
    const { data : response } = await axios.post('/api/category/create',values)
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
          <h4 className='text-xl font-semibold'>Add Category</h4>
        </CardHeader>

        <CardContent className='mb-5'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
             
             

              {/* ✅ Alt field */}
              <div className='mb-6'>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter Category Name" {...field} />
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
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter Slug" {...field} />
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
                  text="Add Category"
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

export default AddCategory