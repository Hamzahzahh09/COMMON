import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createBorrowingRequestSchema = z
  .object({
    item_id: z.string().uuid('Invalid item ID format'),
    start_date: z.string().regex(dateRegex, 'start_date must be formatted as YYYY-MM-DD'),
    end_date: z.string().regex(dateRegex, 'end_date must be formatted as YYYY-MM-DD'),
    purpose: z.string().min(3, 'Purpose must be at least 3 characters long').max(1000),
  })
  .refine((data) => data.start_date <= data.end_date, {
    message: 'start_date must be before or equal to end_date',
    path: ['end_date'],
  });

export const approveBorrowingRequestSchema = z.object({
  pickup_instructions: z.string().max(1000).optional(),
});

export const returnBorrowingRequestSchema = z.object({
  return_condition: z.enum(['pristine', 'good', 'fair', 'needs_maintenance']).optional(),
  return_notes: z.string().max(1000).optional(),
});

export const createBorrowingMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(2000),
});

export const rejectBorrowingRequestSchema = z.object({
  reason: z.string().max(500).optional(),
});

export const requestIdParamSchema = z.object({
  id: z.string().uuid('Invalid request ID format'),
});

export type CreateBorrowingRequestInput = z.infer<typeof createBorrowingRequestSchema>;
export type ApproveBorrowingRequestInput = z.infer<typeof approveBorrowingRequestSchema>;
export type ReturnBorrowingRequestInput = z.infer<typeof returnBorrowingRequestSchema>;
export type CreateBorrowingMessageInput = z.infer<typeof createBorrowingMessageSchema>;
export type RejectBorrowingRequestInput = z.infer<typeof rejectBorrowingRequestSchema>;

