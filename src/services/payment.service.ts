import prisma from "../lib/prisma";
import { IDType, QueryParams } from "../types/requestResponse";
import getSearchAndPagination from "../utils/queryHandler";
import { entities } from "../config/constants";
import { createAuditLog } from "../utils/auditLog";
import { logOperationalFailure } from "../utils/logger";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ICreatePaymentPayload {
  invoiceId: string;
  amount: number;
  method: string;
  processedBy: string;
  notes?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deriveInvoiceStatus(
  amountPaid: number,
  totalAmount: number
): "UNPAID" | "PARTIALLY_PAID" | "PAID" {
  if (amountPaid <= 0) return "UNPAID";
  if (amountPaid >= totalAmount) return "PAID";
  return "PARTIALLY_PAID";
}

// ─── createPayment ────────────────────────────────────────────────────────────

const createPayment = async (data: ICreatePaymentPayload) => {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Fetch and lock the invoice
      const invoice = await tx.invoice.findUnique({
        where: { id: data.invoiceId },
      });

      if (!invoice) {
        throw new Error(`Invoice not found: ${data.invoiceId}`);
      }
      if (invoice.status === "PAID") {
        throw new Error(`Invoice ${data.invoiceId} is already fully PAID`);
      }

      // 2. Validate payment amount
      if (data.amount <= 0) {
        throw new Error("Payment amount must be greater than 0");
      }

      const currentPaid = invoice.paidAmount ?? 0;
      const remaining = invoice.totalAmount - currentPaid;

      if (data.amount > remaining + 0.01) { // Allowance for precision
        throw new Error(
          `Overpayment rejected. Invoice remaining balance: ${remaining.toFixed(2)}, ` +
            `attempted payment: ${data.amount.toFixed(2)}`
        );
      }

      // 3. Create the payment record
      const payment = await tx.payment.create({
        data: {
          invoiceId: data.invoiceId,
          amount: data.amount,
          method: data.method,
        },
      });

      // 4. Update invoice
      const newAmountPaid = currentPaid + data.amount;
      const newStatus = deriveInvoiceStatus(newAmountPaid, invoice.totalAmount);

      await tx.invoice.update({
        where: { id: data.invoiceId },
        data: {
          paidAmount: newAmountPaid,
          status: newStatus,
        },
      });

      // 5. Audit Log — written on the same tx so a rollback removes it too.
      await createAuditLog({
        actor: data.processedBy,
        action: "CREATE_PAYMENT",
        entityType: "Payment",
        entityId: payment.id,
        after: payment as any,
        tx,
      });

      return payment;
    });
  } catch (error) {
    logOperationalFailure("PAYMENT", error, { data });
    throw error;
  }
};

// ─── Read operations ──────────────────────────────────────────────────────────

const getPaymentById = async (id: IDType) =>
  prisma.payment.findUnique({
    where: { id: id as string },
    include: {
      invoice: true,
    },
  });

const getPayments = async (query: QueryParams) => {
  try {
    const { viewSkip, viewLimit, currentPage, sortBy, sortOrder, searchTerm } =
      getSearchAndPagination({ query, entity: entities.payment });

    const where = searchTerm ? {
      invoice: {
        invoiceNo: { contains: searchTerm, mode: "insensitive" } as any
      }
    } : {};

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip: viewSkip,
        take: viewLimit,
        orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
        include: {
          invoice: true,
        },
      }),
      prisma.payment.count({ where }),
    ]);

    return {
      meta: {
        total,
        limit: viewLimit,
        page: currentPage,
        skip: viewSkip,
      },
      data: payments,
    };
  } catch (error) {
    return error;
  }
};

const getPaymentsByInvoice = async (invoiceId: IDType) =>
  prisma.payment.findMany({
    where: { invoiceId: invoiceId as string },
    orderBy: { createdAt: "asc" },
  });

// ─── Export ───────────────────────────────────────────────────────────────────

export default {
  createPayment,
  getPaymentById,
  getPayments,
  getPaymentsByInvoice,
};
