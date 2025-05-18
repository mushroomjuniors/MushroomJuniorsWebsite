import { z } from "zod";

export const cartItemSchema = z.object({
  id: z.string(), 
  name: z.string(),
  price: z.number(),
  quantity: z.number(), 
  image_url: z.string().optional().nullable(),
});

export const inquiryFormSchema = z.object({
  firstName: z.string().min(1, "First name is required.").max(100),
  lastName: z.string().min(1, "Last name is required.").max(100),
  email: z.string().email("Invalid email address.").max(255),
  phone: z.string().max(30).optional().or(z.literal('')), 
  subject: z.string().min(3, "Subject must be at least 3 characters.").max(255),
  message: z.string().min(10, "Message must be at least 10 characters.").max(2000),
  cartItems: z.array(cartItemSchema).optional().nullable(),
});

export type InquiryFormValues = z.infer<typeof inquiryFormSchema>;

export type CreateInquiryState = {
  message?: string;
  error?: string;
  fields?: Record<string, string>;
  isSuccess?: boolean;
};

export type UpdateInquiryStatusState = {
  message?: string;
  error?: string;
  isSuccess?: boolean;
}; 