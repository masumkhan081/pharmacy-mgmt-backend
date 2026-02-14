import { IDType, QueryParams } from "../types/requestResponse";
import Payment, { IPayment } from "../models/payment.model";
import getSearchAndPagination from "../utils/queryHandler";
import { entities } from "../config/constants";
import { Types, ClientSession } from "mongoose";

// Types for payment creation and updates
interface CreatePaymentData {
  amount: number;
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'MOBILE_BANKING' | 'BANK_TRANSFER' | 'INSURANCE' | 'OTHER';
  paymentDate?: Date;
  invoice?: Types.ObjectId;
  cardDetails?: {
    cardType?: string;
    lastFourDigits?: string;
    cardHolderName?: string;
    transactionId?: string;
  };
  mobilePaymentDetails?: {
    provider?: string;
    phoneNumber?: string;
    transactionId?: string;
  };
  bankTransferDetails?: {
    bankName?: string;
    accountNumber?: string;
    transactionId?: string;
  };
  notes?: string;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  customer?: Types.ObjectId;
  processedBy: Types.ObjectId;
}

interface PaymentUpdateData extends Partial<CreatePaymentData> {
  status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  refundedAmount?: number;
  refunds?: Array<{
    amount: number;
    reason: string;
    processedBy: Types.ObjectId;
    processedAt: Date;
    notes?: string;
  }>;
}

interface PaymentSummary {
  totalPayments: number;
  totalAmount: number;
  paymentMethods: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
  dailySummary: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
}

/**
 * Create a new payment
 */
const createPayment = async (data: CreatePaymentData): Promise<IPayment> => {
  try {
    const paymentData: Partial<IPayment> = {
      ...data,
      status: 'COMPLETED',
      refundedAmount: 0,
      refunds: []
    };
    
    const payment = new Payment(paymentData);
    return await payment.save();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to create payment: ${errorMessage}`);
  }
};

/**
 * Get a single payment by ID with related data
 */
const getPaymentById = async (id: IDType): Promise<IPayment | null> => {
  try {
    return await Payment.findById(id)
      .populate('invoice', 'invoiceNumber amount')
      .populate('customer', 'name email')
      .populate('processedBy', 'name')
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to retrieve payment: ${errorMessage}`);
  }
};

/**
 * Get payments with pagination and filtering
 */
const getPayments = async (query: QueryParams) => {
  try {
    const {
      filterConditions,
      sortConditions,
      viewSkip,
      viewLimit,
      currentPage
    } = await getSearchAndPagination({
      query,
      entity: entities.payment,
      additionalFilters: { isDeleted: { $ne: true } }
    });

    const [payments, total] = await Promise.all([
      Payment.find(filterConditions)
        .sort(sortConditions)
        .skip(viewSkip)
        .limit(viewLimit)
        .populate('invoice', 'invoiceNumber amount')
        .populate('customer', 'name email')
        .populate('processedBy', 'name'),
      Payment.countDocuments(filterConditions)
    ]);

    return {
      data: payments,
      pagination: {
        currentPage,
        limit: viewLimit,
        skip: viewSkip,
        total,
        pages: Math.ceil(total / viewLimit)
      }
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to retrieve payments: ${errorMessage}`);
  }
};

/**
 * Update a payment
 */
const updatePayment = async (id: IDType, data: PaymentUpdateData): Promise<IPayment | null> => {
  try {
    const updateData = {
      ...data,
      updatedAt: new Date(),
      updatedBy: data.updatedBy
    };

    return await Payment.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to update payment: ${errorMessage}`);
  }
};

/**
 * Soft delete a payment
 */
const deletePayment = async (id: IDType, deletedBy: Types.ObjectId): Promise<IPayment | null> => {
  try {
    return await Payment.findByIdAndUpdate(
      id,
      { 
        isDeleted: true, 
        deletedAt: new Date(), 
        deletedBy,
        updatedAt: new Date(),
        updatedBy: deletedBy
      },
      { new: true }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to delete payment: ${errorMessage}`);
  }
};

/**
 * Process a refund for a payment
 */
const processRefund = async ({
  paymentId,
  amount,
  reason,
  processedBy,
  notes
}: {
  paymentId: IDType;
  amount: number;
  reason: string;
  processedBy: Types.ObjectId;
  notes?: string;
}): Promise<IPayment> => {
  const session: ClientSession = await Payment.startSession();
  session.startTransaction();

  try {
    // 1. Get the payment with session
    const payment = await Payment.findById(paymentId).session(session);
    if (!payment) {
      throw new Error('Payment not found');
    }

    // 2. Validate refund amount
    const currentRefundedAmount = payment.refundedAmount || 0;
    const refundableAmount = payment.amount - currentRefundedAmount;

    if (amount <= 0) {
      throw new Error('Refund amount must be greater than zero');
    }

    if (amount > refundableAmount) {
      throw new Error(`Refund amount (${amount}) exceeds available balance (${refundableAmount})`);
    }

    // 3. Prepare refund data
    const updatedRefundedAmount = currentRefundedAmount + amount;
    const isFullyRefunded = updatedRefundedAmount >= payment.amount;

    const refundData = {
      amount,
      reason,
      processedBy,
      processedAt: new Date(),
      notes
    };

    const updateData: any = {
      $inc: { refundedAmount: amount },
      $push: { refunds: refundData },
      updatedAt: new Date(),
      updatedBy: processedBy
    };

    // Update status based on refund amount
    if (isFullyRefunded) {
      updateData.status = 'REFUNDED';
    } else {
      updateData.status = 'PARTIALLY_REFUNDED';
    }

    // 4. Update payment with refund
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { $set: updateData },
      { new: true, session }
    );

    if (!updatedPayment) {
      throw new Error('Failed to update payment with refund');
    }

    // 5. Here you would typically update related invoice or other business logic
    // For example: await updateInvoiceAfterRefund(payment.invoice, amount, session);

    await session.commitTransaction();
    return updatedPayment;
  } catch (error: unknown) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    if (error instanceof Error) {
      throw new Error(`Failed to process refund: ${error.message}`);
    } else {
      throw new Error('Failed to process refund: Unknown error occurred');
    }
  } finally {
    await session.endSession();
  }
};

/**
 * Get payment summary with totals and breakdowns
 */
const getPaymentSummary = async (query: QueryParams): Promise<PaymentSummary> => {
  try {
    const { filterConditions: mongoQuery } = await getSearchAndPagination({
      query,
      entity: entities.payment,
      additionalFilters: { isDeleted: { $ne: true } }
    });

    const [
      totalPayments,
      totalAmountResult,
      paymentMethods,
      dailySummary
    ] = await Promise.all([
      Payment.countDocuments(mongoQuery),
      Payment.aggregate([
        { $match: mongoQuery },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Payment.aggregate([
        { $match: mongoQuery },
        { 
          $group: { 
            _id: "$paymentMethod", 
            total: { $sum: "$amount" }, 
            count: { $sum: 1 } 
          } 
        },
        { $sort: { total: -1 } }
      ]),
      Payment.aggregate([
        { $match: { ...mongoQuery, paymentDate: { $exists: true } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$paymentDate" } },
            total: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },
        { $limit: 30 } // Last 30 days
      ])
    ]);

    return {
      totalPayments,
      totalAmount: totalAmountResult[0]?.total || 0,
      paymentMethods,
      dailySummary
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get payment summary: ${error.message}`);
    } else {
      throw new Error('Failed to get payment summary: Unknown error occurred');
    }
  }
};

/**
 * Get payments for a specific invoice
 */
const getPaymentsByInvoice = async (invoiceId: IDType, query: QueryParams) => {
  try {
    const {
      filterConditions,
      viewLimit,
      viewSkip,
      sortConditions,
      currentPage
    } = await getSearchAndPagination({
      query,
      entity: entities.payment,
      additionalFilters: { 
        invoice: invoiceId,
        isDeleted: { $ne: true }
      }
    });

    const [payments, total] = await Promise.all([
      Payment.find(filterConditions)
        .sort(sortConditions)
        .skip(viewSkip)
        .limit(viewLimit)
        .populate('processedBy', 'name'),
      Payment.countDocuments(filterConditions)
    ]);

    return {
      data: payments,
      pagination: {
        total,
        limit: viewLimit,
        page: currentPage,
        skip: viewSkip,
        sortBy: Object.keys(sortConditions)[0] || 'createdAt',
        sortOrder: Object.values(sortConditions)[0] || 'desc',
        pages: Math.ceil(total / viewLimit)
      }
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get payments by invoice: ${error.message}`);
    } else {
      throw new Error('Failed to get payments by invoice: Unknown error occurred');
    }
  }
};

export default {
  createPayment,
  getPaymentById,
  getPayments,
  updatePayment,
  deletePayment,
  processRefund,
  getPaymentSummary,
  getPaymentsByInvoice
};
