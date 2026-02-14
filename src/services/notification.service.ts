import { IDType, QueryParams } from "../types/requestResponse";
import { Notification, INotification, RefillReminder, IRefillReminder } from "../models/notification.model";
import getSearchAndPagination from "../utils/queryHandler";
import { entities } from "../config/constants";
import { Types } from 'mongoose';

interface SearchAndPaginationOptions {
  query: QueryParams;
  entity: string;
  additionalFilters?: Record<string, unknown>;
}

// Create a new notification
const createNotification = async (data: Omit<INotification, keyof Document>) => {
  return await Notification.create(data);
};

// Get refill reminder by ID
const getRefillReminderById = async (id: string) => {
  return await RefillReminder.findById(id)
    .populate('customer', 'name')
    .populate('prescription', 'prescriptionNumber')
    .populate('drug', 'name');
};

// Get a single notification by ID
const getSingleNotification = async ({ id, recipientId }: { id: IDType; recipientId?: IDType }) => {
  const query: any = { _id: id };
  if (recipientId) {
    query['recipients.recipientId'] = new Types.ObjectId(recipientId as string);
  }
  
  return await Notification.findOne(query)
    .populate('createdBy', 'name')
    .populate('recipients.recipientId', 'name email');
};

// Update a notification
const updateNotification = async ({ id, data }: { id: IDType; data: any }) => {
  return await Notification.findByIdAndUpdate(id, data, { new: true })
    .populate('createdBy', 'name')
    .populate('recipients.recipientId', 'name email');
};

// Mark notification as read
const markAsRead = async ({ id, userId }: { id: IDType; userId: IDType }) => {
  return await Notification.findOneAndUpdate(
    { 
      _id: id,
      'recipients.recipientId': userId 
    },
    { 
      $set: { 
        'recipients.$.deliveryStatus': 'READ',
        'recipients.$.readAt': new Date()
      } 
    },
    { new: true }
  );
};

// Mark all notifications as read for user
const markAllAsRead = async ({ userId }: { userId: IDType }) => {
  const result = await Notification.updateMany(
    { 
      'recipients.recipientId': userId,
      'recipients.deliveryStatus': { $ne: 'READ' }
    },
    { 
      $set: { 
        'recipients.$.deliveryStatus': 'READ',
        'recipients.$.readAt': new Date()
      } 
    }
  );
  
  return result.modifiedCount;
};

// Get unread notifications count
const getUnreadCount = async ({ userId }: { userId: IDType }) => {
  return await Notification.countDocuments({
    'recipients.recipientId': userId,
    'recipients.deliveryStatus': { $ne: 'READ' },
    'recipients.readAt': { $exists: false },
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
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ 
      query: restQuery, 
      entity: entities.notification 
    });

    // Add recipient filter if provided
    if (recipientId) {
      filterConditions['recipients.recipientId'] = new Types.ObjectId(recipientId as string);
    }

    const fetchResult = await Notification.find(filterConditions)
      .populate('createdBy', 'name')
      .populate('recipients.recipientId', 'name')
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Notification.countDocuments(filterConditions);
    
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

// Get notifications by type
const getNotificationsByType = async ({ 
  type, 
  userId, 
  query 
}: { 
  type: string; 
  userId?: IDType;
  query: QueryParams;
}) => {
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
      entity: entities.notification,
      additionalFilters: { 
        type,
        ...(userId && { 'recipients.recipientId': new Types.ObjectId(userId as string) })
      }
    });

    const fetchResult = await Notification.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Notification.countDocuments(filterConditions);
    
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

// Create a refill reminder
const createRefillReminder = async (data: any) => {
  return await RefillReminder.create(data);
};

// Get upcoming refill reminders
const getUpcomingRefillReminders = async (query: QueryParams & { customerId?: IDType }) => {
  try {
    const { customerId, ...restQuery } = query;
    
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ 
      query: restQuery, 
      entity: 'refillReminder',
      additionalFilters: { 
        ...(customerId && { customer: customerId }),
        reminderDate: { $lte: new Date() },
        status: 'PENDING'
      }
    });

    const fetchResult = await RefillReminder.find(filterConditions)
      .populate('customer', 'name phone')
      .populate('prescription', 'prescriptionNumber')
      .populate('drug', 'name')
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await RefillReminder.countDocuments(filterConditions);
    
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

// Process due refill reminders
const processDueRefillReminders = async () => {
  const today = new Date();
  const reminders = await RefillReminder.find({
    dueDate: { $lte: today },
    status: 'SCHEDULED'
  })
  .populate<{ customer: { _id: Types.ObjectId; name: string } }>('customer', 'name')
  .populate<{ drug: { _id: Types.ObjectId; name: string } }>('drug', 'name');

  for (const reminder of reminders) {
    await Notification.create({
      type: 'REFILL_REMINDER',
      title: 'Medication Refill Reminder',
      message: `It's time to refill your prescription for ${(reminder as any).drug?.name || 'your medication'}`,
      recipients: [{
        recipientType: 'CUSTOMER',
        recipientId: reminder.customer._id,
        read: false
      }],
      createdBy: (reminder as any).createdBy || new Types.ObjectId() // Fallback to system user if not set
    });

    await RefillReminder.findByIdAndUpdate(reminder._id, { status: 'COMPLETED' });
    // Update reminder status
    await RefillReminder.findByIdAndUpdate(
      reminder._id,
      { status: 'NOTIFIED', notifiedAt: new Date() },
      { new: true }
    );
  }

  return { message: 'Processed all due refill reminders' };
};

export default {
  createNotification,
  getSingleNotification,
  updateNotification,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  getNotifications,
  getNotificationsByType,
  createRefillReminder,
  getUpcomingRefillReminders,
  processDueRefillReminders,
};
