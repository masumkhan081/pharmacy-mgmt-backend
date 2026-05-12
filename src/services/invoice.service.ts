import prisma from "../lib/prisma";
import { IDType, QueryParams } from "../types/requestResponse";
import getSearchAndPagination from "../utils/queryHandler";
import { entities } from "../config/constants";
import { createAuditLog } from "../utils/auditLog";

const createInvoice = async (data: any) => {
  return await prisma.invoice.create({
    data: {
      invoiceNo: data.invoiceNumber || `INV-${Date.now()}`,
      saleId: data.sale,
      totalAmount: data.grandTotal || data.totalAmount,
      paidAmount: 0,
      status: "UNPAID",
    }
  });
};

const getSingleInvoice = async (id: IDType) => {
  return await prisma.invoice.findUnique({
    where: { id: id as string },
    include: {
      sale: {
        include: {
          customer: true
        }
      },
      payments: true
    }
  });
};

const getInvoices = async (query: QueryParams) => {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      searchTerm,
    } = getSearchAndPagination({ query, entity: entities.invoice });

    const where = searchTerm ? {
      invoiceNo: { contains: searchTerm, mode: "insensitive" } as any
    } : {};

    const fetchResult = await prisma.invoice.findMany({
      where,
      skip: viewSkip,
      take: viewLimit,
      orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
      include: {
        sale: {
          include: {
            customer: true
          }
        }
      }
    });

    const total = await prisma.invoice.count({ where });

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

const deleteInvoice = async ({ id, actor }: { id: IDType; actor: string | undefined }) => {
  const invoice = await prisma.invoice.findUnique({ where: { id: id as string } });
  if (!invoice) throw new Error("Invoice not found");

  if (invoice.paidAmount > 0) {
    throw new Error("Cannot delete an invoice that has been partially or fully paid.");
  }

  const result = await prisma.invoice.delete({ where: { id: id as string } });

  if (actor) {
    await createAuditLog({
      actor: actor,
      action: "DELETE",
      entityType: "Invoice",
      entityId: id as string,
      before: invoice as any,
    });
  }

  return result;
};

export default {
  createInvoice,
  getSingleInvoice,
  getInvoices,
  deleteInvoice,
};
