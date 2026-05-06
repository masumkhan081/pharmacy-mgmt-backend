import { entities } from "../config/constants";
import { notificationService } from "../services";
import {
  sendFetchResponse,
  sendSingleFetchResponse,
  sendErrorResponse,
  sendCreateResponse,
  sendUpdateResponse,
  sendDeletionResponse,
} from "../utils/responseHandler";
import { TypeController } from "../types/requestResponse";

// Get all notifications with pagination and filtering
export const getNotifications: TypeController = async (req, res) => {
  try {
    const result = await notificationService.getNotifications({
      ...req.query,
      // Optionally filter by recipient if user is not admin
      ...(req.user?.role !== 'ADMIN' && { recipientId: req.user?.id })
    });
    sendFetchResponse({ res, result, entity: entities.notification });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.notification,
    });
  }
};

// Get a single notification by ID
export const getSingleNotification: TypeController = async (req, res) => {
  try {
    const result = await notificationService.getSingleNotification({
      id: req.params.id,
      // For non-admin users, ensure they can only access their own notifications
      ...(req.user?.role !== 'ADMIN' && { recipientId: req.user?.id })
    });
    sendSingleFetchResponse({ res, result, entity: entities.notification });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.notification,
    });
  }
};

// Create a new notification
export const createNotification: TypeController = async (req, res) => {
  try {
    const result = await notificationService.createNotification({
      ...req.body,
      createdBy: req.user?.id, // Assuming user is attached to request by auth middleware
    });
    sendCreateResponse({ res, result, entity: entities.notification });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.notification,
    });
  }
};

// Update an existing notification
export const updateNotification: TypeController = async (req, res) => {
  try {
    const result = await notificationService.updateNotification({
      id: req.params.id,
      data: {
        ...req.body,
        updatedBy: req.user?.id, // Assuming user is attached to request by auth middleware
      },
    });
    sendUpdateResponse({ res, result, entity: entities.notification });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.notification,
    });
  }
};

// Delete a notification
export const deleteNotification: TypeController = async (req, res) => {
  try {
    const result = await notificationService.deleteNotification(req.params.id);
    sendDeletionResponse({ res, result, entity: entities.notification });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.notification,
    });
  }
};

// Mark notification as read
export const markAsRead: TypeController = async (req, res) => {
  try {
    const result = await notificationService.markAsRead({
      id: req.params.id,
      userId: req.user?.id, // To verify ownership
    });
    sendUpdateResponse({ res, result, entity: entities.notification });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.notification,
    });
  }
};

// Mark all notifications as read for user
export const markAllAsRead: TypeController = async (req, res) => {
  try {
    const result = await notificationService.markAllAsRead({
      userId: req.user?.id,
    });
    res.status(200).json({
      success: true,
      data: { updatedCount: result },
    });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.notification,
    });
  }
};

// Get unread notifications count
export const getUnreadCount: TypeController = async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount({
      userId: req.user?.id,
    });
    res.status(200).json({
      success: true,
      data: { count },
    });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.notification,
    });
  }
};

// Get notifications by type
export const getNotificationsByType: TypeController = async (req, res) => {
  try {
    const result = await notificationService.getNotificationsByType({
      type: req.params.type,
      userId: req.user?.id, // For non-admin users
      query: req.query,
    });
    sendFetchResponse({ res, result, entity: entities.notification });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: entities.notification,
    });
  }
};

// Create refill reminder
export const createRefillReminder: TypeController = async (req, res) => {
  try {
    const result = await notificationService.createRefillReminder({
      ...req.body,
      createdBy: req.user?.id,
    });
    sendCreateResponse({ res, result, entity: 'refillReminder' });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: 'refillReminder',
    });
  }
};

// Get upcoming refill reminders
export const getUpcomingRefillReminders: TypeController = async (req, res) => {
  try {
    const result = await notificationService.getUpcomingRefillReminders({
      ...req.query,
      // For non-admin users, only return their own reminders
      ...(req.user?.role !== 'ADMIN' && { customerId: req.user?.id })
    });
    sendFetchResponse({ res, result, entity: 'refillReminder' });
  } catch (error) {
    console.error(error);
    sendErrorResponse({
      res,
      error,
      entity: 'refillReminder',
    });
  }
};

export default {
  getNotifications,
  getSingleNotification,
  createNotification,
  updateNotification,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  getNotificationsByType,
  createRefillReminder,
  getUpcomingRefillReminders,
};
