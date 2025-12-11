"use client"
import Filter from '@/components/Application/Website/Filter'
import Shorting from '@/components/Application/Website/Shorting'
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import { WEBSITE_SHOP } from '@/routes/websiteRoute'
import React, { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import useWindowSize from '@/hooks/useWindowSize'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { useInfiniteQuery } from '@tanstack/react-query'
import ProductBox from '@/components/Application/Website/ProductBox'
import ButtonLoading from '@/components/Application/ButtonLoading'

const breadcrumb = {
    title : "Shop",
    links: [
        {label: "Shop", href : WEBSITE_SHOP}
    ]
}

const page = () => {
  const searchParams = useSearchParams().toString()
  const [limit, setLimit] = useState(9)
  const [shorting, setShorting] = useState('default_shorting')
  const [isMobileFilter, setIsMobileFilter] = useState(false)
  const windowSize = useWindowSize()

const fetchProduct = async (pageParam) => {
  const {data: getProduct } = await axios.get(`/api/shop?${pageParam}&limit=${limit}&sort=${shorting}&${searchParams}`)
if( !getProduct.success) {
  return
}

return getProduct.data

}

  const { error, data, isFetching, fetchNextPage, hasNextPage} = useInfiniteQuery({
    queryKey :['products', limit, shorting, searchParams],
    queryFn: async ({ pageParam}) => await fetchProduct(pageParam),
    initialPageParam: 0,
    getNextPageParam:(lastPage) =>{
      return  lastPage.nextPage
    }
  })

  return (
    <div>
         <WebsiteBreadcrumb props={breadcrumb}/>
         <section className='lg:flex lg:px-32 px-4 my-20'>

{windowSize.width > 1024 ?
 <div className='w-72 me-4'>
                <div className='sticky top-0 bg-gray-50 p-4 rounded'>
                    <Filter />
                </div>
            </div>
            :
            

<Sheet open={isMobileFilter} onOpenChange={()=> setIsMobileFilter(false)}>
  
  <SheetContent side='left' className='block'>
    <SheetHeader className='border-b'>
      <SheetTitle>Filter</SheetTitle>
      <SheetDescription></SheetDescription>
    </SheetHeader>
    <div className='p-5 overflow-auto h-[calc(100vh-80px)]'>
      <Filter />
    </div>
  </SheetContent>
</Sheet>
}


           




<div className='lg:w-[calc(100%_-_280px)]'>
  <Shorting
    limit={limit}
    setLimit={setLimit}
    sorting={shorting}
    setShorting={setShorting}
    mobileFilterOpen={isMobileFilter}
    setMobileFilterOpen={setIsMobileFilter}
  />

  {isFetching && <div className='p-2 font-extrabold text-center'>Loading...</div>}
  {error && <div className='p-2 font-extrabold text-center'>{error.message}</div>}

 <div className='grid lg:grid-cols-3 grid-cols-2 lg:gap-10 gap-5'>
  {data && data.pages.map(page => (
    page.products.map(product=>(
      <ProductBox key={product._id} product={product}/>
    ))
  ))}
 </div>

<div className='flex justify-center mt-10'>
  {hasNextPage ? 
<ButtonLoading 
type='button'
loading={isFetching}
text='Load More'
onClick={fetchNextPage}
className='cursor-pointer'
/>
:
<>
{!isFetching && <span>No More Data To Load.</span>}
</>  
}
</div>

</div>


            
         </section>
    </div>
  )
}

export default page