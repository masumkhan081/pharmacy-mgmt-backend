import { IDType, QueryParams } from "../types/requestResponse";
import Invoice from "../models/invoice.model";
import getSearchAndPagination from "../utils/queryHandler";
import { entities } from "../config/constants";

// Create a new invoice
const createInvoice = async (data: any) => {
  return await Invoice.create(data);
};

// Get a single invoice by ID
const getSingleInvoice = async (id: IDType) => {
  return await Invoice.findById(id)
    .populate('customer', 'name email phone')
    .populate('sale', 'saleNumber')
    .populate('prescription', 'prescriptionNumber');
};

// Update an invoice
const updateInvoice = async ({ id, data }: { id: IDType; data: any }) => {
  return await Invoice.findByIdAndUpdate(id, data, { new: true })
    .populate('customer', 'name email phone')
    .populate('sale', 'saleNumber')
    .populate('prescription', 'prescriptionNumber');
};

// Delete an invoice
const deleteInvoice = async (id: IDType) => {
  return await Invoice.findByIdAndDelete(id);
};

// Get all invoices with pagination and filtering
const getInvoices = async (query: QueryParams) => {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, entity: entities.invoice });

    const fetchResult = await Invoice.find(filterConditions)
      .populate('customer', 'name')
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Invoice.countDocuments(filterConditions);
    
    return {
      meta: {
        total,
        limit: viewLimit,
        page: currentPage,
        skip: viewSkip,
        sortBy,
        sortOrder,
      },
      data: fetchResult,
    };
  } catch (error) {
    return error;
  }
};

// Get invoices for a specific customer
const getInvoicesByCustomer = async ({ customerId, query }: { customerId: IDType; query: QueryParams }) => {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ 
      query, 
      entity: entities.invoice,
      additionalFilters: { customer: customerId }
    });

    const fetchResult = await Invoice.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Invoice.countDocuments(filterConditions);
    
    return {
      meta: {
        total,
        limit: viewLimit,
        page: currentPage,
        skip: viewSkip,
        sortBy,
        sortOrder,
      },
      data: fetchResult,
    };
  } catch (error) {
    return error;
  }
};

// Update invoice status
const updateInvoiceStatus = async ({ id, status, updatedBy }: { id: IDType; status: string; updatedBy: IDType }) => {
  return await Invoice.findByIdAndUpdate(
    id,
    { 
      status,
      updatedBy,
      ...(status === 'PAID' && { paidAt: new Date() })
    },
    { new: true }
  );
};

// Get invoice summary (total, paid, pending, overdue)
const getInvoiceSummary = async (query: QueryParams) => {
  try {
    const { filterConditions } = getSearchAndPagination({ 
      query, 
      entity: entities.invoice 
    });

    const [
      totalInvoices,
      totalAmount,
      paidInvoices,
      paidAmount,
      pendingInvoices,
      pendingAmount,
      overdueInvoices,
      overdueAmount
    ] = await Promise.all([
      Invoice.countDocuments(filterConditions),
      Invoice.aggregate([
        { $match: filterConditions },
        { $group: { _id: null, total: { $sum: "$grandTotal" } } }
      ]),
      Invoice.countDocuments({ ...filterConditions, status: 'PAID' }),
      Invoice.aggregate([
        { $match: { ...filterConditions, status: 'PAID' } },
        { $group: { _id: null, total: { $sum: "$grandTotal" } } }
      ]),
      Invoice.countDocuments({ 
        ...filterConditions, 
        status: { $in: ['PENDING', 'PARTIALLY_PAID'] } 
      }),
      Invoice.aggregate([
        { $match: { ...filterConditions, status: { $in: ['PENDING', 'PARTIALLY_PAID'] } } },
        { $group: { _id: null, total: { $sum: { $subtract: ["$grandTotal", "$amountPaid"] } } } }
      ]),
      Invoice.countDocuments({ 
        ...filterConditions, 
        status: { $in: ['OVERDUE'] } 
      }),
      Invoice.aggregate([
        { $match: { ...filterConditions, status: 'OVERDUE' } },
        { $group: { _id: null, total: { $sum: { $subtract: ["$grandTotal", "$amountPaid"] } } } }
      ])
    ]);

    return {
      totalInvoices,
      totalAmount: totalAmount[0]?.total || 0,
      paidInvoices,
      paidAmount: paidAmount[0]?.total || 0,
      pendingInvoices,
      pendingAmount: pendingAmount[0]?.total || 0,
      overdueInvoices,
      overdueAmount: overdueAmount[0]?.total || 0,
    };
  } catch (error) {
    return error;
  }
};

export default {
  createInvoice,
  getSingleInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoices,
  getInvoicesByCustomer,
  updateInvoiceStatus,
  getInvoiceSummary,
};
