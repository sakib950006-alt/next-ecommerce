'use client'

import BreadCrumb from "@/components/Application/Admin/BreadCrumb"
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper"
import DeleteAction from "@/components/Application/Admin/DeleteAction"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DT_CUSTOMERS_COLUMN } from "@/lib/column"
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
  { href: "", label: "Customers" },
]

const ShowCustomers = () => {
  const columns = useMemo(() => columnConfig(DT_CUSTOMERS_COLUMN), [])

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
            <h4 className="text-xl font-semibold">Costomers</h4>

           
          </div>
        </CardHeader>

        <CardContent className="pt-0 px-0">
          <DatatableWrapper
            queryKey="customers-data"
            fetchUrl="/api/customers"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/customers/export"
            deleteEndpoint="/api/customers/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=customers`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default ShowCustomers
