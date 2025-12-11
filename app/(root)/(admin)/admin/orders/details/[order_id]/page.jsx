'use client';

import React, { useEffect, useState, use } from 'react';
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb';
import { WEBSITE_PRODUCT_DETAILS } from '@/routes/websiteRoute';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { ADMIN_DASHBORD, ADMIN_ORDER_SHOW } from '@/routes/adminPanelRoute';
import BreadCrumb from '@/components/Application/Admin/BreadCrumb';
import Select from '@/components/Application/Select';
import { orderStatus } from '@/lib/utils';
import ButtonLoading from '@/components/Application/ButtonLoading';
import toast from 'react-hot-toast';

const breadcrumbData = [
  { href: ADMIN_DASHBORD, label: "home" },
  { href: ADMIN_ORDER_SHOW, label: "Orders" },
  { href: '', label: "Orders Details" },
]

const statusOption = [
  {label: 'pending', value:  'pending'},
  {label: 'Processing', value:  'processing'},
  {label: 'Shipped', value:  'shipped'},
  {label: 'Delivered', value:  'delivered'},
  {label: 'Cancelled', value:  'cancelled'},
  {label: 'Unverified', value:  'unverified'},
]


const OrderDetails = ({ params }) => {
  // unwrap params promise using React.use()
  const resolvedParams = use(params);
  const order_id = Array.isArray(resolvedParams.order_id) ? resolvedParams.order_id[0] : resolvedParams.order_id;

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState()
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/get/${order_id}`);
        if (!data?.success) setError('Order Not Found');
        else setOrderData(data);
        setOrderStatus(data?.data?.status)
      } catch {
        setError('Something went wrong while fetching order data.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [order_id]);

  

  if (loading) return <div className="py-20 text-center">Loading...</div>;
  if (error) return <div className="py-20 text-center text-red-500 font-semibold">{error}</div>;



  const handleOrderStatus = async () => {
     setUpdatingStatus(true)
     try {
      const  {data: response} = await axios.put('/api/orders/update-status', {
        _id: orderData?.data?._id,
        status:orderStatus
      })
      if(!response.success){
        throw new Error(response.message)
      }
      toast.success(response.message)
     } catch (error) {
      toast.error(error.message)
     }finally{
      setUpdatingStatus(false)
     }
  }
  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <div className="border">
        <div className='p-2 border-b '>
          <h4 className='text-lg font-bold text-primary'>Order Details</h4>
        </div>
        <div className="mb-5 px-2">
          <p><b>Order Id : </b>{orderData?.data?.order_id}</p>
          <p><b>Transaction Id : </b>{orderData?.data?.payment_id}</p>
          <p className="capitalize"><b>Status : </b>{orderData?.data?.status}</p>
        </div>
        {/* Products Table */}
        <table className="w-full">
          <thead className="border-b bg-gray-50 dark:bg-card md:table-header-group hidden">
            <tr>
              <th className="text-start p-3">Product</th>
              <th className="text-center p-3">Price</th>
              <th className="text-center p-3">Quantity</th>
              <th className="text-center p-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {orderData?.data?.products?.map(p => (
              <tr key={p.variantId._id} className="md:table-row block border-b">
                <td className="p-3">
                  <div className="flex items-center gap-5">
                    <Image
                      src={p?.variantId?.media?.[0]?.secure_url || '/placeholder.png'}
                      width={60}
                      height={60}
                      alt={p?.name || 'product'}
                      className="rounded"
                    />
                    <div>
                      <h4 className="text-lg ">
                        <Link href={WEBSITE_PRODUCT_DETAILS(p?.productId?.slug)}>{p?.name}</Link>
                        <p>Color: {p?.variantId?.color}</p>
                        <p>Size: {p?.variantId?.size}</p>
                      </h4>
                    </div>
                  </div>
                </td>
                <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center">
                  <span className="md:hidden font-medium">Price</span>
                  <span>{p.sellingPrice.toLocaleString('in-IN', { style: 'currency', currency: 'INR' })}</span>
                </td>
                <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center">
                  <span className="md:hidden font-medium">Quantity</span>
                  <span>{p.qty}</span>
                </td>
                <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center">
                  <span className="md:hidden font-medium">Total</span>
                  <span>{(p.qty * p.sellingPrice).toLocaleString('in-IN', { style: 'currency', currency: 'INR' })}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Shipping & Summary */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-10 border mt-10">
          <div className="p-5">
            <h4 className="text-lg font-semibold mb-5">Shipping Address</h4>
            <table className="w-full">
              <tbody>
                {['name','email','phone','country','state','city','pincode','landmark','ordernote'].map(f => (
                  <tr key={f}>
                    <td className="font-medium py-2">{f.charAt(0).toUpperCase() + f.slice(1).replace('ordernote','Order Note')} :</td>
                    <td className="text-end py-2">{orderData?.data?.[f] || '---'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-5 bg-gray-50 dark:bg-card">
            <h4 className="text-lg font-semibold mb-5">Order Summary</h4>
            <table className="w-full">
              <tbody>
                {['subtotal','discount','couponDiscountAmount','totalAmount'].map(f => (
                  <tr key={f}>
                    <td className="font-medium py-2">{f === 'couponDiscountAmount' ? 'Coupon Discount' : f.charAt(0).toUpperCase() + f.slice(1)} :</td>
                    <td className="text-end py-2">{orderData?.data?.[f]?.toLocaleString('in-IN',{style:'currency',currency:'INR'}) || '---'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <hr/>
            <div className='pt-3'>
              <h4 className='text-lg font-semibold mb-2'>Order Status</h4>
              <Select 
              options={statusOption}
              selected={orderStatus}
              setSelected={(value) => setOrderStatus(value)}
              placeholder="Select"
              isMulti={false}
              />
              <ButtonLoading type="button" loading={updatingStatus} onClick={handleOrderStatus} text="Save Status" className="mt-5 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
