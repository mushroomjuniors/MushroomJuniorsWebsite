"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import type { InquiryFormValues, CreateInquiryState, UpdateInquiryStatusState } from "@/lib/types/inquiryTypes"; // Import types
import { inquiryFormSchema } from "@/lib/types/inquiryTypes"; // Import schema

// Supabase admin client (uses service_role key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL or Service Role Key is missing for inquiry actions.');
}
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// inquiryFormSchema, InquiryFormValues, CreateInquiryState, UpdateInquiryStatusState are now imported

export async function createInquiry(
  values: InquiryFormValues
): Promise<CreateInquiryState> {
  const validatedFields = inquiryFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields for inquiry.",
      fields: validatedFields.error.flatten().fieldErrors as Record<string, string>,
      isSuccess: false,
    };
  }

  const dataToInsert = {
    first_name: validatedFields.data.firstName,
    last_name: validatedFields.data.lastName,
    email: validatedFields.data.email,
    phone: validatedFields.data.phone || null, // Store null if empty
    subject: validatedFields.data.subject,
    message: validatedFields.data.message,
    status: 'new', // Default status
    cart_items: validatedFields.data.cartItems || null, // Add cart items
  };

  try {
    const { error } = await supabaseAdmin
      .from("inquiries")
      .insert([dataToInsert])
      .select();

    if (error) {
      console.error("Supabase error creating inquiry:", error);
      return { error: `Database Error: ${error.message}`, isSuccess: false };
    }

    // Optionally revalidate a path if you have a public list of inquiries (unlikely)
    // revalidatePath("/some-public-inquiry-path");
    
    return { message: "Inquiry submitted successfully!", isSuccess: true };

  } catch (e: any) {
    console.error("Failed to create inquiry:", e);
    return { error: "An unexpected error occurred while submitting the inquiry.", isSuccess: false };
  }
}

export async function updateInquiryStatus(
  inquiryId: string,
  newStatus: string
): Promise<UpdateInquiryStatusState> { // Ensure UpdateInquiryStatusState is imported
  if (!supabaseAdmin) {
    return { error: "Supabase client not initialized.", isSuccess: false };
  }

  // Optional: Validate newStatus if you have a predefined set of statuses
  const allowedStatuses = ["new", "read", "responded", "archived", "resolved"]; // Example statuses
  if (!allowedStatuses.includes(newStatus)) {
    return { error: `Invalid status: ${newStatus}.`, isSuccess: false };
  }

  try {
    const { error } = await supabaseAdmin
      .from("inquiries")
      .update({ status: newStatus, updated_at: new Date().toISOString() }) // Also update an updated_at timestamp if you have one
      .eq("id", inquiryId)
      .select(); // select() can be useful to check if the update was successful on a row

    if (error) {
      console.error(`Supabase error updating inquiry ${inquiryId} status:`, error);
      return { error: `Database Error: ${error.message}`, isSuccess: false };
    }

    revalidatePath("/admin/inquiries");
    revalidatePath(`/admin/inquiries/${inquiryId}`);

    return { message: "Inquiry status updated successfully!", isSuccess: true };
  } catch (e: any) {
    console.error(`Failed to update inquiry ${inquiryId} status:`, e);
    return { error: "An unexpected error occurred while updating the inquiry status.", isSuccess: false };
  }
} 