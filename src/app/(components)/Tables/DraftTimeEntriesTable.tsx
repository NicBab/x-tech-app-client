"use client";

import { useMemo, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { format } from "date-fns";
import { TimeEntryGroup } from "@/redux/slices/time/TimeTypes";
import { SearchIcon, PlusCircleIcon, SendIcon, PencilIcon, Trash2Icon } from "lucide-react";
import Header from "@/app/(components)/Header";

type Props = {
  rows: TimeEntryGroup[];
  loading?: boolean;
  error?: boolean;
  title?: string;
  onRowClick?: (id: string) => void;
  onCreate?: () => void;
  onSubmit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showCreateButton?: boolean;
  submittingId?: string | null;
  deletingId?: string | null;
};

export default function DraftTimeEntriesTable({
  rows,
  loading,
  error,
  title = "Drafted Times",
  onRowClick,
  onCreate,
  onSubmit,
  onDelete,
  showCreateButton = true,
  submittingId = null,
  deletingId = null,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows: TimeEntryGroup[] = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return (rows || []).filter(
      (e) =>
        e.id.toLowerCase().includes(term) ||
        (e.user?.name?.toLowerCase() ?? "").includes(term)
    );
  }, [rows, searchTerm]);

  const columns: GridColDef<TimeEntryGroup>[] = [
    // { field: "id", headerName: "Entry ID", width: 170 },
    {
      field: "employeeName",
      headerName: "Employee",
      width: 180,
      valueGetter: (_, row) => row?.user?.name ?? "N/A",
    },
    {
      field: "date",
      headerName: "Date",
      width: 140,
      valueGetter: (_, row) =>
        row?.date ? format(new Date(row.date), "yyyy-MM-dd") : "N/A",
    },
    {
      field: "jobCount",
      headerName: "Jobs",
      width: 90,
      valueGetter: (_, row) => row?.jobs?.length ?? 0,
    },
    {
      field: "totalHours",
      headerName: "Total Hours",
      width: 130,
      valueGetter: (_, row) =>
        (row?.jobs ?? []).reduce((sum, j) => sum + (Number(j.hoursWorked) || 0), 0),
    },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      renderCell: (params: GridRenderCellParams<TimeEntryGroup>) => (
        <div className="flex gap-5 items-center mt-3">
          {/* Edit */}
          <button
            onClick={(e) => { e.stopPropagation(); onRowClick?.(params.row.id); }}
            title="Edit"
            className="text-blue-600 hover:text-blue-800"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          {/* Submit */}
          <button
            onClick={(e) => { e.stopPropagation(); onSubmit?.(params.row.id); }}
            disabled={submittingId === params.row.id}
            title="Submit"
            className="text-green-600 hover:text-green-800 disabled:opacity-50"
          >
            <SendIcon className="w-5 h-5" />
          </button>
          {/* Delete */}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(params.row.id); }}
            disabled={deletingId === params.row.id}
            title="Delete Draft"
            className="text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            <Trash2Icon className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      {/* SEARCH */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white text-black dark:bg-zinc-800 dark:text-gray-100"
            placeholder="Search drafted times..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER & CREATE */}
      <div className="flex justify-between items-center mb-6">
        <Header name={title} />
        {showCreateButton && (
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => onCreate?.()}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" /> Create Time Entry
          </button>
        )}
      </div>

      {/* TABLE */}
      <DataGrid
        rows={filteredRows}
        columns={columns}
        getRowId={(row) => row.id}
        onRowClick={(params) => onRowClick?.(params.row.id)}
        className="bg-white shadow rounded-lg border border-gray-200 !text-gray-700 dark:bg-zinc-900 dark:!text-gray-300"
        autoHeight
        loading={loading}
      />

      {error ? (
        <p className="text-red-500 mt-4 text-sm text-center">
          Failed to load time entries.
        </p>
      ) : (
        !loading &&
        filteredRows.length === 0 && (
          <p className="text-gray-500 mt-4 text-sm text-center">
            No draft time entries found.
          </p>
        )
      )}
    </div>
  );
}
