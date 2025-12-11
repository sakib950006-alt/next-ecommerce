"use client"
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBORD } from '@/routes/adminPanelRoute'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zSchema } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { use, useEffect, useState } from 'react'
import ButtonLoading from '@/components/Application/ButtonLoading'
import slugify from 'slugify'
import toast from 'react-hot-toast'
import axios from 'axios'
import useFetch from '@/hooks/useFetch'
import { useRouter } from 'next/navigation'

const breadcrumbData = [
  { href: ADMIN_DASHBORD, label: 'home' },
  { href: ADMIN_CATEGORY_SHOW, label: 'Category' },
  { href: '', label: 'Edit Category' }
]

const EditCategory = ({ params }) => {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { data: categoryData } = useFetch(id ? `/api/category/get/${id}` : null);

  const formSchema = zSchema.pick({
    _id: true,
    name: true,
    slug: true
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: id,
      name: "",
      slug: ""
    },
  });

  const nameValue = form.watch('name');

  // Populate form when categoryData is fetched
  useEffect(() => {
    if (categoryData?.success && categoryData?.data) {
      const data = categoryData.data;
      form.reset({
        _id: data._id,
        name: data.name,
        slug: data.slug
      });
    }
  }, [categoryData, form]);

  // Update slug automatically when name changes
  useEffect(() => {
    if (nameValue) {
      form.setValue('slug', slugify(nameValue).toLowerCase());
    }
  }, [nameValue, form]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data: response } = await axios.put('/api/category/update', values); // ✅ fixed axios.put
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);

      // Redirect to category list after successful update
      router.push(ADMIN_CATEGORY_SHOW);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <h4 className="text-xl font-semibold">Update Category</h4>
        </CardHeader>

        <CardContent className="mb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-6">
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

              <div className="mb-6">
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

              <div className="mb-3">
                <ButtonLoading
                  className="cursor-pointer"
                  type="submit"
                  text="Update Category"
                  loading={loading}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCategory;
