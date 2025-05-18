"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation'; // For potential refresh if needed, though revalidatePath should handle
import { toast } from 'sonner';

import { updateInquiryStatus } from '@/app/actions/inquiryActions';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InquiryStatusUpdaterProps {
  inquiryId: string;
  currentStatus: string;
}

// Define your allowed statuses here, should match the server action
const availableStatuses = [
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "responded", label: "Responded" },
  { value: "resolved", label: "Resolved" },
  { value: "archived", label: "Archived" },
];

export function InquiryStatusUpdater({ inquiryId, currentStatus }: InquiryStatusUpdaterProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
  };

  const handleSubmitStatusUpdate = () => {
    if (selectedStatus === currentStatus) {
      toast.info("No changes to update.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateInquiryStatus(inquiryId, selectedStatus);
        if (result.isSuccess) {
          toast.success(result.message || 'Status updated successfully!');
          // router.refresh(); // RevalidatePath should handle this, but uncomment if needed
        } else {
          throw new Error(result.error || 'Failed to update status.');
        }
      } catch (error: any) {
        toast.error(error.message || 'An unexpected error occurred.');
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Update Status</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Select value={selectedStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {availableStatuses.map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSubmitStatusUpdate} disabled={isPending || selectedStatus === currentStatus}>
          {isPending ? 'Updating...' : 'Update Status'}
        </Button>
      </CardContent>
    </Card>
  );
} 