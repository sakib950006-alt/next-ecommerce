'use client'

import BreadCrumb from "@/components/Application/Admin/BreadCrumb"
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper"
import DeleteAction from "@/components/Application/Admin/DeleteAction"
import EditAction from "@/components/Application/Admin/EditAction"
import ViewAction from "@/components/Application/Admin/ViewAction"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DT_COUPON_COLUMN, DT_ORDER_COLUMN, DT_PRODUCT_COLUMN } from "@/lib/column"
import { columnConfig } from "@/lib/helperFunction"
import {
  ADMIN_DASHBORD,
  ADMIN_PRODUCT_ADD,
  ADMIN_PRODUCT_SHOW,
  ADMIN_PRODUCT_EDIT,    // <-- IMPORT ADDED
  ADMIN_TRASH,
  ADMIN_COUPON_SHOW,
  ADMIN_COUPON_EDIT,
  ADMIN_COUPON_ADD,
  ADMIN_ORDER_DETAILS,
} from "@/routes/adminPanelRoute"

import Link from "next/link"
import { useCallback, useMemo } from "react"
import { FiPlus } from "react-icons/fi"

const breadcrumbData = [
  { href: ADMIN_DASHBORD, label: "home" },
  { href: "", label: "Orders" },
]

const ShowOrder = () => {
  const columns = useMemo(() => columnConfig(DT_ORDER_COLUMN), [])

  const action = useCallback((row, deleteType, handleDelete) => {
    return [
      <ViewAction key="view" href={ADMIN_ORDER_DETAILS(row.original.order_id)} />, // <-- use EDIT route
      <DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />,
    ]
  }, [])
  const handleDelete = async (ids) => {
  try {
    const { data } = await axios.delete(deleteEndpoint, {
      data: { ids },
    });

    if (!data.success) throw new Error(data.message);

    toast.success(data.message);
    queryClient.invalidateQueries(queryKey);

  } catch (error) {
    toast.error(error.message || "Delete failed");
  }
};


  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm gap-0">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold">Orders</h4>

          
          </div>
        </CardHeader>

        <CardContent className="pt-0 px-0">
          <DatatableWrapper
            queryKey="orders-data"
            fetchUrl="/api/orders"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/orders/export"
            deleteEndpoint="/api/orders/delete"

            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=orders`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default ShowOrder
