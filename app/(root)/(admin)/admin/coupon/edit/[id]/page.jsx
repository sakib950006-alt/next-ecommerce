"use client";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import {
  
  ADMIN_DASHBORD,

  ADMIN_COUPON_SHOW,
} from "@/routes/adminPanelRoute";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zSchema } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useEffect, useState } from "react";
import ButtonLoading from "@/components/Application/ButtonLoading";
import toast from "react-hot-toast";
import axios from "axios";
import useFetch from "@/hooks/useFetch";
import dayjs from "dayjs";

const breadcrumbData = [
  { href: ADMIN_DASHBORD, label: "home" },
  { href: ADMIN_COUPON_SHOW, label: "Coupons" },
  { href: "", label: "Edit Coupon" },
];

const EsitCoupon = ({params}) => {
  const{id} = use(params)
  const [loading, setLoading] = useState(false);
  const {data: getCouponData} = useFetch(`/api/coupon/get/${id}`)

  // ✅ Zod validation schema (pick only required fields)
  const formSchema = zSchema.pick({
    _id: true,
    code: true,
    discountPercentage: true,
    minShoppingAmount: true,
    validity: true,
  });

  // ✅ Initialize form with default values
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues:{
      _id: id,
      code:"",
      discountPercentage: "",
      minShoppingAmount: "",
      validity: "", // ✅ date field default should be empty string, not number
    },
  });


  useEffect(()=>{
if(getCouponData && getCouponData.success) {
  const coupon = getCouponData.data
  form.reset({
    _id: coupon._id,
    code: coupon.code,
    discountPercentage: coupon.discountPercentage,
    minShoppingAmount: coupon.minShoppingAmount,
    validity: dayjs(coupon.validity).format("YYYY-MM-DD")

  })
}
  },[getCouponData])

  // ✅ Submit Handler
  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data: response } = await axios.put("/api/coupon/update", values);
      if (!response.success) {
        throw new Error(response.message);
      }

     
      toast.success(response.message);
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
          <h4 className="text-xl font-semibold">Edit Coupon</h4>
        </CardHeader>

        <CardContent className="mb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                {/* ✅ Code Field */}
                <div>
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Code <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter Code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ✅ Discount Percentage Field */}
                <div>
                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Discount Percentage{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter Discount Percentage"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ✅ Min Shopping Amount Field */}
                <div>
                  <FormField
                    control={form.control}
                    name="minShoppingAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Min. Shopping Amount{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter Min. Shopping Amount"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ✅ Validity Field (Fixed name + default value) */}
                <div>
                  <FormField
                    control={form.control}
                    name="validity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Validity <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* ✅ Submit Button */}
              <div className="mb-3 mt-5">
                <ButtonLoading
                  className="cursor-pointer"
                  type="submit"
                  text="Save Changes"
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

export default EsitCoupon;
