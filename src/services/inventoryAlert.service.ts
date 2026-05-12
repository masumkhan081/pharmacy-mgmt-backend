import { entities } from "../config/constants";
import prisma from "../lib/prisma";
import { IDType, QueryParams } from "../types/requestResponse";
import getSearchAndPagination from "../utils/queryHandler";

// Create a new inventory alert
const createInventoryAlert = async (data: any) => {
  return await prisma.inventoryAlert.create({
    data: {
      drugId: data.drug,
      title: data.title,
      message: data.message,
      severity: data.severity || "MEDIUM",
      isResolved: false
    }
  });
};

// Get a single alert by ID
const getSingleInventoryAlert = async (id: IDType) => {
  return await prisma.inventoryAlert.findUnique({
    where: { id: id as string },
  });
};

// Update an alert
const updateInventoryAlert = async ({ id, data }: { id: IDType; data: any }) => {
  return await prisma.inventoryAlert.update({
    where: { id: id as string },
    data: {
      ...data,
      // Map isActive to isResolved if needed, but let's stick to isResolved
    }
  });
};

// Delete an alert
const deleteInventoryAlert = async (id: IDType) => {
  return await prisma.inventoryAlert.delete({
    where: { id: id as string }
  });
};

// Get all alerts with pagination and filtering
const getInventoryAlerts = async (query: QueryParams) => {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      searchTerm,
    } = getSearchAndPagination({ query, entity: entities.inventoryAlert });

    const where: any = searchTerm ? {
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { message: { contains: searchTerm, mode: "insensitive" } },
      ]
    } : {};

    const fetchResult = await prisma.inventoryAlert.findMany({
      where,
      skip: viewSkip,
      take: viewLimit,
      orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
    });

    const total = await prisma.inventoryAlert.count({ where });
    
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

// Get active alerts for a specific drug
const getAlertsByDrug = async (drugId: IDType, query: QueryParams) => {
  try {
    const { viewSkip, viewLimit, sortBy, sortOrder } = getSearchAndPagination({ query, entity: entities.inventoryAlert });
    
    const where = {
      drugId: drugId as string,
      isResolved: false
    };

    const fetchResult = await prisma.inventoryAlert.findMany({
      where,
      skip: viewSkip,
      take: viewLimit,
      orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
    });

    const total = await prisma.inventoryAlert.count({ where });
    
    return {
      meta: { total, limit: viewLimit, page: 1, skip: viewSkip },
      data: fetchResult,
    };
  } catch (error) {
    return error;
  }
};

// Get all active alerts that need attention
const getActiveAlerts = async (query: QueryParams) => {
  try {
    const { viewSkip, viewLimit, sortBy, sortOrder } = getSearchAndPagination({ query, entity: entities.inventoryAlert });
    
    const where = { isResolved: false };

    const fetchResult = await prisma.inventoryAlert.findMany({
      where,
      skip: viewSkip,
      take: viewLimit,
      orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
    });

    const total = await prisma.inventoryAlert.count({ where });
    
    return {
      meta: { total, limit: viewLimit, page: 1, skip: viewSkip },
      data: fetchResult,
    };
  } catch (error) {
    return error;
  }
};

export default {
  createInventoryAlert,
  getSingleInventoryAlert,
  updateInventoryAlert,
  deleteInventoryAlert,
  getInventoryAlerts,
  getAlertsByDrug,
  getActiveAlerts,
};
