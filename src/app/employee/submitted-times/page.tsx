"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetTimeEntriesQuery } from "@/redux/api/api";
import SubmittedTimesTable from "@/app/(components)/Tables/SubmittedTimesTable";

export default function SubmittedTimesPage() {
  const router = useRouter();
  const { userId, role } = useSelector((s: RootState) => s.user);

  const { data = [], isFetching, isLoading, isError, refetch } = useGetTimeEntriesQuery({
    userId: userId ?? "",
    role: (role as "admin" | "user") ?? "user",
    status: "SUBMITTED",
    
  }, {refetchOnMountOrArgChange: true, skip: !userId});
  
    // const { data = [], isFetching, isError, refetch } = useGetDLRsQuery(
    //   { userId: userId ?? "", role: "employee", status: "PENDING" },
    //   { refetchOnMountOrArgChange: true, skip: !userId }
    // );

  return (
    <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
       
        <button className="text-sm underline pointer-events-auto" onClick={() => refetch()} disabled={isFetching}>
          Refresh
        </button>
      </div>
      <SubmittedTimesTable
        rows={(data || []).filter((e) => e.userId === userId)}
        loading={isLoading}
        error={isError}
        title="My Submitted Time Entries"
        onRowClick={(id) => router.push(`/employee/submitted-times/${id}`)}
        showCreateButton
        onCreate={() => router.push("/employee/new-time-entry")}
      />
    </div>
  );
}
