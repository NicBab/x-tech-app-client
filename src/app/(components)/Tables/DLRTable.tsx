"use client";

import { useMemo, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { DLR } from "@/redux/slices/dlr/DLRTypes";
import { format } from "date-fns";

export interface DLRTableProps {
  /** Pass data from the page — either prop name works */
  data?: DLR[];
  rows?: DLR[];
  /** Loading flag from the page — either prop name works */
  isLoading?: boolean;
  loading?: boolean;

  /** Who is viewing the table */
  role: "admin" | "employee";
  /** Needed to scope items when role is employee */
  currentUserId?: string;

  /** Optional niceties */
  title?: string;
  onCreateClick?: () => void;

  /** Optional: row click */
  onRowClick?: (row: DLR) => void;
}

export default function DLRTable({
  data,
  rows,
  isLoading,
  loading,
  role,
  currentUserId,
  title = "DLRs",
  onCreateClick,
  onRowClick,
}: DLRTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const baseRows = useMemo(() => {
    const list = (data ?? rows ?? []) as DLR[];
    if (role === "admin") return list;
    if (!currentUserId) return [];
    return list.filter((r) => r.userId === currentUserId);
  }, [data, rows, role, currentUserId]);

  const filteredRows: DLR[] = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return baseRows;
    return baseRows.filter((dlr) => {
      const emp = dlr.user?.name?.toLowerCase() ?? "";
      return (
        dlr.dlrNumber?.toLowerCase().includes(term) ||
        dlr.jobNumber?.toLowerCase().includes(term) ||
        dlr.customer?.toLowerCase().includes(term) ||
        emp.includes(term)
      );
    });
  }, [baseRows, searchTerm]);

  const cols: GridColDef<DLR>[] = [
    { field: "dlrNumber", headerName: "DLR#", width: 120 },
    { field: "jobNumber", headerName: "Job#", width: 120 },
    {
      field: "user",
      headerName: "Employee",
      width: 180,
      valueGetter: (_val, row) => row?.user?.name ?? "N/A",
    },
    {
      field: "date",
      headerName: "Date",
      width: 140,
      valueGetter: (_val, row) =>
        row?.date ? format(new Date(row.date), "yyyy-MM-dd") : "N/A",
    },
    { field: "customer", headerName: "Customer", width: 160 },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params: GridRenderCellParams<DLR>) => {
        const status = params.value as DLR["status"];
        const badge =
          status === "APPROVED" ? "bg-green-300" :
          status === "PENDING"  ? "bg-yellow-200" :
          status === "REJECTED" ? "bg-red-300" :
          status === "REVIEW"   ? "bg-blue-300" : "bg-gray-300";
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge} text-black`}>
            {status}
          </span>
        );
      },
    },
  ];

  const busy = (isLoading ?? loading) ?? false;

  return (
    <div className="flex flex-col">
      {/* SEARCH */}
      <div className="mb-6">
        <div className="flex items-center border border-input rounded">
          <SearchIcon className="w-5 h-5 text-muted-foreground m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
            placeholder={`Search ${title}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER & BUTTON */}
      <div className="flex justify-between items-center mb-6">
        <Header name={title} />
        {onCreateClick && (
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={onCreateClick}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" /> Create DLR
          </button>
        )}
      </div>

      <DataGrid
        rows={filteredRows}
        columns={cols}
        getRowId={(row: DLR) => row.dlrId}
        autoHeight
        loading={busy}
        onRowClick={(params) => onRowClick?.(params.row as DLR)}
        className="shadow rounded-lg border border-input"
      />
    </div>
  );
}
