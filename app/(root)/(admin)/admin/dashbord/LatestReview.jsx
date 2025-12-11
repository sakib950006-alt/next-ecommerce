"use client"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IoStar } from "react-icons/io5";
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import Image from "next/image"
import notFound from '@/public/assets/images/not-found.png'

const LatestReview = () => {
  const [latestReview, setLatestReview] = useState()
  const {data: getLetestReview, loading} = useFetch('/api/dashboard/admin/latest-review')
    
  useEffect(()=>{
      if(getLetestReview && getLetestReview.success){
        setLatestReview(getLetestReview.data)
      }
  },[getLetestReview])   // ✅ FIXED

  if(loading) return <div className="h-full w-full flex justify-center items-center">Loading</div>

  if(!latestReview || latestReview.length === 0) return (
    <div className="h-full w-full flex justify-center items-center">
      <Image src={notFound.src} width={notFound.width} height={notFound.height} alt="not Found" className="w-20"/>
    </div>
  )

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Rating</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {latestReview?.map((review)=>(
          <TableRow key={review._id}>
            <TableCell className='flex items-center gap-3'>
              <Avatar>
                <AvatarImage 
                  src={review?.product?.media?.[0]?.secure_url || imgPlaceholder.src} 
                />
              </Avatar>
              <span className="line-clamp-1">{review?.product?.name || 'Not Found'}</span>
            </TableCell>

            <TableCell>
              <div className="flex items-center">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <IoStar key={i} className="text-yellow-500"/>
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default LatestReview
