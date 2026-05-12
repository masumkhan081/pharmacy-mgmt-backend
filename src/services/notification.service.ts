import prisma from "../lib/prisma";
import { IDType, QueryParams } from "../types/requestResponse";
import getSearchAndPagination from "../utils/queryHandler";
import { entities } from "../config/constants";

// Create a new notification
const createNotification = async (data: any) => {
  return await prisma.notification.create({
    data: {
      title: data.title,
      message: data.message,
      userId: data.userId || data.recipientId,
    }
  });
};

// Get a single notification by ID
const getSingleNotification = async ({ id, recipientId }: { id: IDType; recipientId?: IDType }) => {
  const notification = await prisma.notification.findUnique({
    where: { id: id as string }
  });
  if (!notification) return null;
  // If recipientId is provided, ensure ownership
  if (recipientId && notification.userId && notification.userId !== (recipientId as string)) {
    return null;
  }
  return notification;
};

// Update a notification
const updateNotification = async ({ id, data }: { id: IDType; data: any }) => {
  return await prisma.notification.update({
    where: { id: id as string },
    data
  });
};

// Delete a notification
const deleteNotification = async (id: IDType) => {
  return await prisma.notification.delete({
    where: { id: id as string }
  });
};

// Mark notification as read
const markAsRead = async ({ id, userId }: { id: IDType; userId?: IDType }) => {
  // Ownership enforcement can be done here if needed; for now we perform the update
  return await prisma.notification.update({
    where: { id: id as string },
    data: { isRead: true }
  });
};

// Mark all notifications as read for user
const markAllAsRead = async ({ userId }: { userId: IDType }) => {
  return await prisma.notification.updateMany({
    where: { 
      userId: userId as string,
      isRead: false 
    },
    data: { isRead: true }
  });
};

// Get unread notifications count
const getUnreadCount = async ({ userId }: { userId: IDType }) => {
  return await prisma.notification.count({
    where: {
      userId: userId as string,
      isRead: false,
    }
  });
};

// Get all notifications with pagination and filtering
const getNotifications = async (query: QueryParams & { recipientId?: IDType }) => {
  try {
    const { recipientId, ...restQuery } = query;
    
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      searchTerm,
    } = getSearchAndPagination({ 
      query: restQuery, 
      entity: entities.notification 
    });

    const where: any = {
      ...(recipientId && { userId: recipientId as string }),
      ...(searchTerm && {
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { message: { contains: searchTerm, mode: "insensitive" } },
        ]
      })
    };

    const fetchResult = await prisma.notification.findMany({
      where,
      skip: viewSkip,
      take: viewLimit,
      orderBy: sortBy ? { [sortBy]: sortOrder ?? "desc" } : { createdAt: "desc" },
    });

    const total = await prisma.notification.count({ where });
    
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

// Compatibility wrappers for legacy controller usage
const getNotificationsByType = async ({ type, userId, query }: { type: string; userId?: IDType; query?: QueryParams }) => {
  // Delegate to getNotifications; filter by `type` in-memory if present on records.
  const result = await getNotifications({ ...(query as any), recipientId: userId } as any);
  if (!result || (result as any).data === undefined) return result;
  const filtered = (result as any).data.filter((n: any) => n.type === type);
  return { meta: (result as any).meta, data: filtered };
};

const createRefillReminder = async (data: any) => {
  // Minimal compatibility: create a notification representing the refill reminder
  const title = data.title || `Refill reminder`;
  const message = data.message || `Refill reminder scheduled`; 
  return await createNotification({ title, message, userId: data.customer || data.recipientId });
};

const getUpcomingRefillReminders = async (query: QueryParams & { customerId?: IDType }) => {
  // Reuse getNotifications; callers can interpret results
  return await getNotifications({ ...(query as any), recipientId: query.customerId } as any);
};

export default {
  createNotification,
  getSingleNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  getNotifications,
  getNotificationsByType,
  createRefillReminder,
  getUpcomingRefillReminders,
};
