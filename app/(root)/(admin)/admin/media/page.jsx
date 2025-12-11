"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import Media from '@/components/Application/Admin/Media'
import UploadMedia from '@/components/Application/Admin/UploadMedia'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import useDeleteMutation from '@/hooks/useDeleteMutation'
import { ADMIN_DASHBORD, ADMIN_MEDIA_SHOW } from '@/routes/adminPanelRoute'
import ButtonLoading from '@/components/Application/ButtonLoading'

const MediaPage = () => {
  const queryClient = useQueryClient()
  const breadcrumbData = [
    { href: ADMIN_DASHBORD, label: 'Home' },
    { href: '', label: 'Media' },
  ]

  const [deleteType, setDeleteType] = useState('SD')
  const [selectedMedia, setSelectedMedia] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams) {
      const trashOf = searchParams.get('trashof')
      setSelectedMedia([])

      if (trashOf) {
        setDeleteType('PD')
      } else {
        setDeleteType('SD')
      }
    }
  }, [searchParams])

  const fetchMedia = async (page, deleteType) => {
    const { data: response } = await axios.get(
      `/api/media?page=${page}&&limit=10&deleteType=${deleteType}`
    )
    return response
  }

  const {
    data,
    error,
    
    fetchNextPage,
    hasNextPage,
    isFetching,
   
    status,
  } = useInfiniteQuery({
    queryKey: ['media-data', deleteType],
    queryFn: async ({ pageParam }) => fetchMedia(pageParam, deleteType),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length
      return lastPage.hasMore ? nextPage : undefined
    },
  })

 
  const deleteMutation = useDeleteMutation('media-data', '/api/media/delete')


  const handleDelete = (ids, deleteType) => {
    let confirmed = true

    if (deleteType === 'PD') {
      confirmed = confirm('Are you sure you want to delete the data permanently?')
    }

    if (confirmed) {
      deleteMutation.mutate({ ids, deleteType })
      setSelectAll(false)
      setSelectedMedia([])
    }
  }

  const handleSelectAll = () => {
    setSelectAll(!selectAll)
  }

  useEffect(() => {
    if (!data) return

    if (selectAll) {
      const ids = data.pages.flatMap(page => page.mediaData.map(media => media._id))
      setSelectedMedia(ids)
    } else {
      setSelectedMedia([])
    }
  }, [selectAll, data])

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl uppercase">
              {deleteType === 'SD' ? 'Media' : 'Trash'}
            </h4>

            <div className="flex items-center ml-4">
              {deleteType === 'SD' && <UploadMedia isMultiple={true}  queryClient={queryClient}/>}
              <div className="flex gap-2 ml-2">
                {deleteType === 'SD' ? (
                  <Button type="button" variant="destructive">
                    <Link href={`${ADMIN_MEDIA_SHOW}?trashof=media`}>Trash</Link>
                  </Button>
                ) : (
                  <Button type="button">
                    <Link href={ADMIN_MEDIA_SHOW}>Back to Media</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className='mb-5'>
          {selectedMedia.length > 0 && (
            <div className="py-2 px-3 bg-[#adaaaa] mb-2 rounded flex justify-between items-center">
              <Label>
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                  className="border-primary"
                />
                Select All
              </Label>

              <div className="flex gap-2">
                {deleteType === 'SD' ? (
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(selectedMedia, deleteType)}
                    className="cursor-pointer"
                  >
                    Move Into Trash
                  </Button>
                ) : (
                  <>
                    <Button
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => handleDelete(selectedMedia, 'RSD')}
                    >
                      Restore
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(selectedMedia, deleteType)}
                    >
                      Delete Permanently
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {status === 'pending' ? (
            <div>Loading...</div>
          ) : status === 'error' ? (
            <div className="text-red-500 text-sm">{error.message}</div>
          ) : (
            <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5">
              {data?.pages.map((page, index) => (
                <React.Fragment key={index}>
                  {page?.mediaData?.map((media) => (
                    <Media
                      key={media._id}
                      media={media}
                      handleDelete={handleDelete}
                      selectedMedia={selectedMedia}
                      setSelectedMedia={setSelectedMedia}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
          )}


<ButtonLoading type='button' className='cursor-pointer' loading={isFetching} onClick={()=> fetchNextPage()} text='Load More'/>



        </CardContent>
      </Card>
    </div>
  )
}

export default MediaPage
