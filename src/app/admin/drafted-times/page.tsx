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

export default function AdminMyDraftedTimesPage() {
  const router = useRouter();
  const { userId } = useSelector((s: RootState) => s.user);

  // 👇 Key bit: role "employee" so server filters by userId
  const { data = [], isLoading, isError } = useGetTimeEntriesQuery({
    userId: userId ?? "",
    role: "employee",
    status: "DRAFT",
  });

  const [submitDraft, { isLoading: isSubmitting, originalArgs: submittingArg }] =
    useSubmitTimeEntryMutation();
  const [deleteDraft, { isLoading: isDeleting, originalArgs: deletingArg }] =
    useDeleteTimeEntryMutation();

  const onRowClick = (id: string) => router.push(`/admin/drafted-times/${id}`); // or your preferred edit route
  const onCreate = () => router.push("/admin/new-time-entry");

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
      <DraftTimeEntriesTable
        rows={data} // already filtered by userId on the server
        loading={isLoading}
        error={isError}
        title="My Drafted Time Entries"
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
