// redux/slices/time/TimeTypes.ts
export interface TimeEntryJob {
  id: string;
  groupId: string;
  jobNumber: string;
  hoursWorked: number;
  comments?: string;
  mileage?: number;
  extraExpenses?: string;
  startTime?: string | null; // NEW
  endTime?: string | null;   // NEW
}

export interface TimeEntryGroup {
  id: string;
  userId: string;
  date: string; // or Date, depending on usage
  weekEndingDate: string;
  status: "DRAFT" | "SUBMITTED";
  notes?: string;
  jobs: TimeEntryJob[];
  user?: {
    name: string;
  };
}
