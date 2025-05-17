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
import { deleteProduct } from "@/app/admin/products/actions"; // Ensure this path is correct
import { useRouter } from 'next/navigation';

interface DeleteProductDialogProps {
  productId: string;
  productName: string;
  onActionComplete?: () => void;
}

export function DeleteProductDialog({
  productId,
  productName,
  onActionComplete,
}: DeleteProductDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteProduct(productId);
      if (result.error) {
        toast.error("Failed to delete product", {
          description: result.error,
        });
      } else {
        toast.success(`Product "${productName}" deleted`, {
          description: result.message,
        });
        setIsOpen(false);
        if (onActionComplete) onActionComplete();
        // The revalidatePath in the server action should handle refreshing the product list
        // router.refresh(); 
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault(); // Prevent dropdown from closing
            // setIsOpen(true); // This is handled by AlertDialog's own trigger mechanism
          }}
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
            product <strong>{productName}</strong>.
            {/* Consider warning about related variants if applicable in the future */}
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
