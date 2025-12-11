'use client'

import BreadCrumb from "@/components/Application/Admin/BreadCrumb"
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper"
import DeleteAction from "@/components/Application/Admin/DeleteAction"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DT_REVIEW_COLUMN } from "@/lib/column"
import { columnConfig } from "@/lib/helperFunction"
import {
  ADMIN_DASHBORD,
      // <-- IMPORT ADDED
  ADMIN_TRASH,
 
} from "@/routes/adminPanelRoute"

import Link from "next/link"
import { useCallback, useMemo } from "react"
import { FiPlus } from "react-icons/fi"

const breadcrumbData = [
  { href: ADMIN_DASHBORD, label: "home" },
  { href: "", label: "Review" },
]

const ShowReview = () => {
  const columns = useMemo(() => columnConfig(DT_REVIEW_COLUMN), [])

  const action = useCallback((row, deleteType, handleDelete) => {
    return [
      
      <DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />,
    ]
  }, [])

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm gap-0">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold">Review</h4>

           
          </div>
        </CardHeader>

        <CardContent className="pt-0 px-0">
          <DatatableWrapper
            queryKey="review-data"
            fetchUrl="/api/review"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/review/export"
            deleteEndpoint="/api/review/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=review`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default ShowReview
