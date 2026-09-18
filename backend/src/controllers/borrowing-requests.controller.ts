import type { Context } from 'hono';
import type { AppContext } from '../types';
import { BorrowingService } from '../services/borrowing.service';
import { createdResponse, successResponse } from '../lib/response';
import type {
  CreateBorrowingRequestInput,
  RejectBorrowingRequestInput,
} from '../schemas/borrowing-request.schema';

export class BorrowingRequestsController {
  static async create(c: Context<AppContext>) {
    const user = c.get('user');
    const supabaseAdmin = c.get('supabaseAdmin');
    const body = c.get('validatedBody' as any) as CreateBorrowingRequestInput;

    const request = await BorrowingService.createRequest(supabaseAdmin, body, user.id);
    return createdResponse(c, request, 'Borrowing request submitted successfully');
  }

  static async getMyRequests(c: Context<AppContext>) {
    const user = c.get('user');
    const supabase = c.get('supabase');

    const requests = await BorrowingService.getMyRequests(supabase, user.id);
    return successResponse(c, requests);
  }

  static async getIncoming(c: Context<AppContext>) {
    const user = c.get('user');
    const supabaseAdmin = c.get('supabaseAdmin');

    const requests = await BorrowingService.getIncomingRequests(supabaseAdmin, user.id);
    return successResponse(c, requests);
  }

  static async getById(c: Context<AppContext>) {
    const user = c.get('user');
    const supabaseAdmin = c.get('supabaseAdmin');
    const id = c.req.param('id') as string;

    const request = await BorrowingService.getRequestById(supabaseAdmin, id, user.id);
    return successResponse(c, request);
  }

  static async approve(c: Context<AppContext>) {
    const user = c.get('user');
    const supabaseAdmin = c.get('supabaseAdmin');
    const id = c.req.param('id') as string;
    let pickupInstructions: string | undefined;
    try {
      const body = await c.req.json();
      pickupInstructions = body?.pickup_instructions;
    } catch {
      // Body optional
    }

    const result = await BorrowingService.approveRequest(supabaseAdmin, id, user.id, pickupInstructions);
    return successResponse(c, result, 200, 'Borrowing request approved');
  }

  static async reject(c: Context<AppContext>) {
    const user = c.get('user');
    const supabaseAdmin = c.get('supabaseAdmin');
    const id = c.req.param('id') as string;
    const body = (c.get('validatedBody' as any) as RejectBorrowingRequestInput) || {};

    const result = await BorrowingService.rejectRequest(supabaseAdmin, id, user.id, body.reason);
    return successResponse(c, result, 200, 'Borrowing request rejected');
  }

  static async cancel(c: Context<AppContext>) {
    const user = c.get('user');
    const supabaseAdmin = c.get('supabaseAdmin');
    const id = c.req.param('id') as string;

    const request = await BorrowingService.cancelRequest(supabaseAdmin, id, user.id);
    return successResponse(c, request, 200, 'Borrowing request cancelled');
  }

  static async returnItem(c: Context<AppContext>) {
    const user = c.get('user');
    const supabaseAdmin = c.get('supabaseAdmin');
    const id = c.req.param('id') as string;
    let returnCondition: string | undefined;
    let returnNotes: string | undefined;
    try {
      const body = await c.req.json();
      returnCondition = body?.return_condition;
      returnNotes = body?.return_notes;
    } catch {
      // Body optional
    }

    const result = await BorrowingService.returnItem(
      supabaseAdmin,
      id,
      user.id,
      returnCondition,
      returnNotes
    );
    return successResponse(c, result, 200, 'Item returned successfully');
  }

  static async getMessages(c: Context<AppContext>) {
    const user = c.get('user');
    const supabaseAdmin = c.get('supabaseAdmin');
    const id = c.req.param('id') as string;

    const messages = await BorrowingService.getMessages(supabaseAdmin, id, user.id);
    return successResponse(c, messages);
  }

  static async addMessage(c: Context<AppContext>) {
    const user = c.get('user');
    const supabaseAdmin = c.get('supabaseAdmin');
    const id = c.req.param('id') as string;
    const body = await c.req.json();

    if (!body?.message || typeof body.message !== 'string') {
      return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Message cannot be empty' } }, 400);
    }

    const msg = await BorrowingService.addMessage(supabaseAdmin, id, user.id, body.message.trim());
    return createdResponse(c, msg, 'Message sent successfully');
  }

  static async syncOverdue(c: Context<AppContext>) {
    const supabaseAdmin = c.get('supabaseAdmin');

    const result = await BorrowingService.syncOverdueRequests(supabaseAdmin);
    return successResponse(c, result, 200, 'Overdue requests synchronized');
  }
}
