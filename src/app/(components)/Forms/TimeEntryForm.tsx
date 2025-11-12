"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format, endOfWeek } from "date-fns";
import { ClockIcon } from "lucide-react";
import toast from "react-hot-toast";

import {
  useUpsertTimeEntryMutation,
  useUpdateTimeEntryMutation,
  useResubmitTimeEntryMutation,
} from "@/redux/api/api";
import { useAppSelector } from "@/redux/hooks";
import { TimeEntryGroup } from "@/redux/slices/time/TimeTypes";
import { UpsertTimeEntryDTO } from "@/redux/slices/time/TimeDTO";

type Props = {
  initialGroup?: TimeEntryGroup;             // prefill (draft or submitted)
  editingId?: string;                        // PATCH /times/:id (draft editing)
  resubmitId?: string;                       // POST  /times/:id/resubmit (replace submitted)
  onDone?: (updated?: Partial<TimeEntryGroup>) => void; // callback after success
};

interface JobEntry {
  jobNumber: string;
  startTime: string;   // "HH:mm" (UI-only)
  endTime: string;     // "HH:mm" (UI-only)
  notes: string;
  existingHours?: number; // show saved hours when editing (no times entered)
}

export default function TimeEntryForm({
  initialGroup,
  editingId,
  resubmitId,
  onDone,
}: Props) {
  const router = useRouter();
  const userId = useAppSelector((s) => s.user.userId) ?? "";

  // helper to coerce to "HH:mm"
  const toHHMM = (t?: string | null) => (t ? t.slice(0, 5) : "");

  // group-level notes
  const [groupNotes, setGroupNotes] = useState<string>("");

  // date
  const [date, setDate] = useState<string>(
    initialGroup ? format(new Date(initialGroup.date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")
  );

  // jobs
  const [jobs, setJobs] = useState<JobEntry[]>([
    { jobNumber: "", startTime: "", endTime: "", notes: "" },
  ]);

  // RTK mutations
  const [upsert, upsertState] = useUpsertTimeEntryMutation();
  const [updateEntry, updateState] = useUpdateTimeEntryMutation();
  const [resubmitEntry, resubmitState] = useResubmitTimeEntryMutation();

  useEffect(() => {
    if (!initialGroup) return;

    setDate(format(new Date(initialGroup.date), "yyyy-MM-dd"));
    setGroupNotes(initialGroup.notes ?? "");

    const mapped: JobEntry[] =
      (initialGroup.jobs ?? []).map((j) => ({
        jobNumber: j.jobNumber,
        startTime: toHHMM(j.startTime), // PREFILL if stored
        endTime: toHHMM(j.endTime),     // PREFILL if stored
        notes: j.comments ?? "",
        existingHours: Number(j.hoursWorked) || 0,
      })) || [];

    setJobs(mapped.length ? mapped : [{ jobNumber: "", startTime: "", endTime: "", notes: "" }]);
  }, [initialGroup]);

  const weekEnd = useMemo(
    () => format(endOfWeek(new Date(date), { weekStartsOn: 1 }), "yyyy-MM-dd"),
    [date]
  );

  const getDurationInHours = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const startDate = new Date(0, 0, 0, sh, sm || 0);
    const endDate = new Date(0, 0, 0, eh, em || 0);
    const diffHrs = (endDate.getTime() - startDate.getTime()) / 36e5;
    return diffHrs > 0 ? diffHrs : 0;
  };

  const computedTotal = useMemo(
    () =>
      jobs.reduce((sum, j) => {
        const fromTimes = getDurationInHours(j.startTime, j.endTime);
        return sum + (fromTimes > 0 ? fromTimes : (j.existingHours ?? 0));
      }, 0),
    [jobs]
  );

  const handleChange = (index: number, field: keyof JobEntry, value: string) => {
    setJobs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddJob = () =>
    setJobs((prev) => [...prev, { jobNumber: "", startTime: "", endTime: "", notes: "" }]);

  const handleRemoveJob = (index: number) =>
    setJobs((prev) => prev.filter((_, i) => i !== index));

  const buildPayload = (status: "DRAFT" | "SUBMITTED"): UpsertTimeEntryDTO => {
    const apiJobs = jobs
      .filter((j) => j.jobNumber.trim() !== "")
      .map((j) => {
        const fromTimes = getDurationInHours(j.startTime, j.endTime);
        const hoursWorked = Number(
          (fromTimes > 0 ? fromTimes : (j.existingHours ?? 0)).toFixed(2)
        );

        return {
          jobNumber: j.jobNumber.trim(),
          hoursWorked,
          comments: j.notes?.trim() || undefined,
          startTime: j.startTime || undefined, // NEW
          endTime: j.endTime || undefined,     // NEW
        };
      });

    const dto: UpsertTimeEntryDTO = {
      ...(editingId ? { id: editingId } : {}),
      userId,
      date,
      weekEndingDate: weekEnd,
      status,
      notes: groupNotes?.trim() ? groupNotes.trim() : undefined,
      jobs: apiJobs,
    };
    return dto;
  };

  const busy = upsertState.isLoading || updateState.isLoading || resubmitState.isLoading;

  const onSaveDraft = async () => {
    if (!userId) return toast.error("No userId found.");
    if (resubmitId) {
      return toast.error("Saving draft is not available while re-submitting.");
    }

    const dto = buildPayload("DRAFT");
    try {
      await toast.promise(
        editingId
          ? updateEntry({ id: editingId, ...dto }).unwrap()
          : upsert(dto).unwrap(),
        { loading: "Saving draft…", success: "Draft saved", error: "Failed to save draft" }
      );
      onDone?.();
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = async () => {
    if (!userId) return toast.error("No userId found.");

    const dto = buildPayload("SUBMITTED");
    const total = dto.jobs.reduce((s, j) => s + (Number(j.hoursWorked) || 0), 0);
    if (total <= 0) return toast.error("Total hours must be greater than 0 to submit.");

    try {
      if (resubmitId) {
        await toast.promise(
          resubmitEntry({
            id: resubmitId,
            payload: {
              userId: dto.userId,
              date: dto.date,
              weekEndingDate: dto.weekEndingDate,
              notes: dto.notes ?? null,
              jobs: dto.jobs,
            },
          }).unwrap(),
          { loading: "Re-submitting…", success: "Re-submitted", error: "Failed to re-submit" }
        );
        onDone?.();
        return;
      }

      await toast.promise(
        editingId
          ? updateEntry({ id: editingId, ...dto }).unwrap()
          : upsert(dto).unwrap(),
        { loading: "Submitting…", success: "Time entry submitted", error: "Failed to submit" }
      );
      onDone?.();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border rounded-xl shadow-md space-y-6 dark:bg-zinc-900 dark:border-zinc-700 mt-20">
      <h2 className="text-2xl font-bold text-center">
        {resubmitId
          ? "Re-submit Time Entry"
          : editingId
          ? "Edit Draft Time Entry"
          : "Employee Time Entry"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Input disabled value={`Week Ending: ${weekEnd}`} />
      </div>

      {/* Group notes (optional) */}
      <Textarea
        placeholder="Overall notes (optional)…"
        value={groupNotes}
        onChange={(e) => setGroupNotes(e.target.value)}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Jobs for the Day</h3>
        {jobs.map((job, index) => {
          const timeHours = getDurationInHours(job.startTime, job.endTime);
          const displayHours = timeHours > 0 ? timeHours : (job.existingHours ?? 0);

          return (
            <div key={index} className="border rounded-md p-4 space-y-3 bg-gray-50 dark:bg-zinc-800">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  placeholder="Job Number"
                  value={job.jobNumber}
                  onChange={(e) => handleChange(index, "jobNumber", e.target.value)}
                />
                <div className="relative">
                  <ClockIcon className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    type="time"
                    placeholder="Start Time"
                    value={job.startTime}
                    onChange={(e) => handleChange(index, "startTime", e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <ClockIcon className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    type="time"
                    placeholder="End Time"
                    value={job.endTime}
                    onChange={(e) => handleChange(index, "endTime", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Textarea
                placeholder="Optional notes for this job…"
                value={job.notes}
                onChange={(e) => handleChange(index, "notes", e.target.value)}
              />

              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Hours: {displayHours.toFixed(2)}
                  {job.existingHours && timeHours === 0 ? " (from saved entry)" : ""}
                </span>
                <Button variant="destructive" size="sm" onClick={() => handleRemoveJob(index)}>
                  Remove Job
                </Button>
              </div>
            </div>
          );
        })}
        <Button onClick={handleAddJob} type="button" variant="secondary">
          + Add Another Job
        </Button>
      </div>

      <div className="text-right text-sm font-semibold">
        Total Hours: {computedTotal.toFixed(2)} hrs
      </div>

      <div className="flex justify-end gap-4">
        {/* Cancel button */}
        <Button
          variant="outline"
          type="button"
          onClick={() => router.back()}
          disabled={busy}
        >
          Cancel
        </Button>

        {!resubmitId && (
          <Button
            variant="secondary"
            onClick={onSaveDraft}
            disabled={busy}
            type="button"
          >
            Save Draft
          </Button>
        )}
        <Button onClick={onSubmit} disabled={busy} type="button">
          {resubmitId ? "Re-submit" : "Submit"}
        </Button>
      </div>
    </div>
  );
}
