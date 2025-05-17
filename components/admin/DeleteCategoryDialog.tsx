"use client";

import { useState, useTransition } from 'react';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteCategory } from "@/app/admin/categories/actions"; // Adjust path as necessary
import { useRouter } from 'next/navigation';

interface DeleteCategoryDialogProps {
  categoryId: string;
  categoryName: string;
  onActionComplete?: () => void; // Optional: if you need to do something else after delete
}

export function DeleteCategoryDialog({
  categoryId,
  categoryName,
  onActionComplete,
}: DeleteCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteCategory(categoryId);
      if (result.error) {
        toast.error("Failed to delete category", {
          description: result.error,
        });
      } else {
        toast.success(`Category "${categoryName}" deleted`, {
          description: result.message,
        });
        setIsOpen(false); // Close the dialog on success
        if (onActionComplete) onActionComplete();
        // router.refresh(); // This is handled by revalidatePath in the server action
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()} // Prevent default closing of dropdown
          className="text-red-600 hover:!text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            category <strong>{categoryName}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
