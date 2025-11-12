"use client";

import { useState, useMemo } from "react";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Trash2Icon, SearchIcon, PlusCircleIcon } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useGetUsersQuery, User } from "@/redux/api/api";


export default function UsersTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: users = [],
    isLoading,
    isError,
  } = useGetUsersQuery();

  const [localUsers, setLocalUsers] = useState<User[]>([]);

  // First-time copy: only if local is empty and users fetched
  useMemo(() => {
    if (localUsers.length === 0 && users.length > 0) {
      setLocalUsers(users);
    }
  }, [users]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return localUsers.filter((user) =>
      [user.name, user.email, user.role, user.status]
       .some((field) => (field ?? "").toLowerCase().includes(term))
    );
  }, [searchTerm, localUsers]);

const handleRoleChange = (userId: string, newRole: "admin" | "employee") => {
  setLocalUsers((prev) =>
    prev.map((u) =>
      u.userId === userId ? { ...u, role: newRole } : u
    )
  );
};

const handleStatusChange = (userId: string, newStatus: "active" | "inactive") => {
  setLocalUsers((prev) =>
    prev.map((u) =>
      u.userId === userId ? { ...u, status: newStatus } : u
    )
  );
};

  const handleDelete = (userId: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      setLocalUsers((prev) => prev.filter((u) => u.userId !== userId));
      // Optional: call mutation to delete from DB
    }
  };

  const columns: GridColDef<User>[] = [
    { field: "userId", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 230 },
    {
      field: "role",
      headerName: "Role",
      width: 160,
      renderCell: (params: GridRenderCellParams<User>) => (
        <Select
          defaultValue={params?.row?.role}
          onValueChange={(val) => handleRoleChange(params?.row?.userId, val as "admin" | "employee")}
        >
          <SelectTrigger className="w-[120px] mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="employee">Employee</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 160,
      renderCell: (params: GridRenderCellParams<User>) => (
        <Select
          defaultValue={params?.row?.status}
          onValueChange={(val) => handleStatusChange(params?.row?.userId, val as "active" | "inactive")}
        >
          <SelectTrigger className="w-[120px] mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params: GridRenderCellParams<User>) => (
        <button
          onClick={() => handleDelete(params?.row?.userId)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2Icon className="w-5 h-5" />
        </button>
      ),
    },
  ];

  if (isLoading) return <p className="text-gray-500">Loading...</p>;
  if (isError) return <p className="text-red-500">Error loading users.</p>;

  return (
    <div className="flex flex-col">
      {/* SEARCH */}
      <div className="mb-6">
        <div className="flex items-center border border-input rounded">
          <SearchIcon className="w-5 h-5 text-muted-foreground m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
            placeholder="Search Users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER + BUTTON */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Users" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" /> Create User
        </button>
      </div>

      {/* TABLE */}
      <DataGrid
        rows={filteredUsers}
        columns={columns}
        getRowId={(row) => row.userId}
        checkboxSelection
        autoHeight
        className="shadow rounded-lg border border-input"
      />
    </div>
  );
}
