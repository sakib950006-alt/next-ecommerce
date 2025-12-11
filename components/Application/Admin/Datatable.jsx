"use client";

import { IconButton, Tooltip } from "@mui/material";
import {
  MaterialReactTable,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable,
} from "material-react-table";
import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import RecyclingIcon from "@mui/icons-material/Recycling";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import toast from "react-hot-toast";
import { download, generateCsv, mkConfig } from "export-to-csv";
import useDeleteMutation from "@/hooks/useDeleteMutation";
import ButtonLoading from "../ButtonLoading";

const Datatable = ({
  queryKey,
  fetchUrl,
  columnsConfig = [],
  initialPageSize = 10,
  exportEndpoint,
  deleteEndpoint,
  deleteType,
  trashView,
  createAction = () => {},
}) => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [exportLoading, setExportLoading] = useState(false);

  // ✅ Delete hook
  const deleteMutation = useDeleteMutation(queryKey, deleteEndpoint);

  const handleDelete = (ids, deleteType) => {
    let confirmMsg =
      deleteType === "PD"
        ? "Are you sure you want to permanently delete the data?"
        : "Are you sure you want to move data to trash?";
    if (confirm(confirmMsg)) {
      deleteMutation.mutate({ ids, deleteType });
      setRowSelection({});
    }
  };

  // ✅ Export handler (CSV + Excel)
  const handleExport = async (selectedRows) => {
    setExportLoading(true);
    try {
      if (Object.keys(rowSelection).length > 0) {
        // 🔹 Export selected rows to CSV
        const csvConfig = mkConfig({
          fieldSeparator: ",",
          decimalSeparator: ".",
          useKeysAsHeaders: true,
          filename: "exported-data",
        });

        const rowData = selectedRows.map((r) => r.original);
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);

        toast.success("CSV exported successfully!");
      } else {
        // 🔹 Export full data as Excel from backend
        const res = await axios.get(exportEndpoint, {
          responseType: "blob",
        });

        if (res.status !== 200 || !res.data) {
          throw new Error("No data to export");
        }

        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "categories.xlsx";
        document.body.appendChild(link);
        link.click();
        link.remove();

        toast.success("Excel exported successfully!");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Something went wrong while exporting");
    } finally {
      setExportLoading(false);
    }
  };

  // ✅ Fetch data with React Query
  const {
    data: { data = [], meta } = {},
    isError,
    isRefetching,
    isLoading,
  } = useQuery({
    queryKey: [queryKey, { columnFilters, globalFilter, pagination, sorting }],
    queryFn: async () => {
      const url = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL);
      url.searchParams.set("start", `${pagination.pageIndex * pagination.pageSize}`);
      url.searchParams.set("size", `${pagination.pageSize}`);
      url.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
      url.searchParams.set("globalFilter", globalFilter ?? "");
      url.searchParams.set("sorting", JSON.stringify(sorting ?? []));
      url.searchParams.set("deleteType", deleteType);

      const { data: response } = await axios.get(url.href);
      return response;
    },
    placeholderData: keepPreviousData,
  });

  // ✅ Table Config
  const table = useMaterialReactTable({
    columns: columnsConfig,
    data,
    enableRowSelection: true,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    enableColumnOrdering: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError
      ? { color: "error", children: "Error loading data" }
      : undefined,

    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,

    rowCount: meta?.totalRowCount ?? 0,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
      rowSelection,
    },

    getRowId: (originalRow) => originalRow._id,

    renderToolbarInternalActions: ({ table }) => (
      <>
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />

        {deleteType !== "PD" && (
          <Tooltip title="Recycle Bin">
            <Link href={trashView}>
              <IconButton>
                <RecyclingIcon />
              </IconButton>
            </Link>
          </Tooltip>
        )}

        {deleteType === "SD" && (
          <Tooltip title="Delete All">
            <IconButton
              disabled={
                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
              }
              onClick={() =>
                handleDelete(Object.keys(rowSelection), deleteType)
              }
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}

        {deleteType === "PD" && (
          <>
            <Tooltip title="Restore Data">
              <IconButton
                disabled={
                  !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                }
                onClick={() =>
                  handleDelete(Object.keys(rowSelection), "RSD")
                }
              >
                <RestoreFromTrashIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Permanently Delete Data">
              <IconButton
                disabled={
                  !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                }
                onClick={() =>
                  handleDelete(Object.keys(rowSelection), deleteType)
                }
              >
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </>
    ),

    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActionMenuItems: ({ row }) =>
      createAction(row, deleteType, handleDelete),

    // ✅ Export button on top
    renderTopToolbarCustomActions: ({ table }) => (
      <Tooltip title="Export data">
        <ButtonLoading
          type="button"
          text={
            <>
              <SaveAltIcon fontSize="25" /> Export
            </>
          }
          loading={exportLoading}
          onClick={() => handleExport(table.getSelectedRowModel().rows)}
          className="cursor-pointer"
        />
      </Tooltip>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default Datatable;
