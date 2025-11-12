"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  useGetTimeEntriesQuery,
  useSubmitTimeEntryMutation,
  useDeleteTimeEntryMutation,
} from "@/redux/api/api";
import DraftTimeEntriesTable from "@/app/(components)/Tables/DraftTimeEntriesTable";
import { toast } from "react-hot-toast";

export default function DraftedTimesPage() {
  const router = useRouter();
  const { userId, role } = useSelector((s: RootState) => s.user);

  const { data = [], isFetching, isLoading, isError, refetch } = useGetTimeEntriesQuery({
    userId: userId ?? "",
    role: (role as "admin" | "employee") ?? "employee",
    status: "DRAFT",
  }, { refetchOnMountOrArgChange: true, skip: !userId });

  const [submitDraft, { isLoading: isSubmitting, originalArgs: submittingArg }] =
    useSubmitTimeEntryMutation();
  const [deleteDraft, { isLoading: isDeleting, originalArgs: deletingArg }] =
    useDeleteTimeEntryMutation();

  const onRowClick = (id: string) => router.push(`/employee/drafted-times/${id}`);
  const onCreate = () => router.push("/employee/new-time-entry");

  const onSubmit = async (id: string) => {
    try {
      await submitDraft(id).unwrap();
      toast.success("Draft submitted");
    } catch {
      toast.error("Failed to submit draft");
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteDraft(id).unwrap();
      toast.success("Draft deleted");
    } catch {
      toast.error("Failed to delete draft");
    }
  };

  return (
    <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
        
        <button className="text-sm underline pointer-events-auto" onClick={() => refetch()} disabled={isFetching}>
          Refresh
        </button>
      </div>
      <DraftTimeEntriesTable
        rows={(data || []).filter((e) => e.userId === userId)}
        loading={isLoading}
        error={isError}
        onRowClick={onRowClick}
        onCreate={onCreate}
        onSubmit={onSubmit}
        onDelete={onDelete}
        submittingId={(isSubmitting && (submittingArg as string)) || null}
        deletingId={(isDeleting && (deletingArg as string)) || null}
      />
    </div>
  );
}
