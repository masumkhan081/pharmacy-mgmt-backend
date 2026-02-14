// Export all services for easy importing
export { default as returnService } from './return.service';
export { default as inventoryAlertService } from './inventoryAlert.service';
export { default as inventoryBatchService } from './inventoryBatch.service';
export { default as invoiceService } from './invoice.service';
export { default as paymentService } from './payment.service';
export { default as notificationService } from './notification.service';

// Re-export existing services for backward compatibility
export * from './brand.service';
export * from './drug.service';
export * from './formulation.service';
export * from './generic.service';
export * from './group.service';

// Manufacturer service
export { default as manufacturerService } from './mfr.service';

// Other services
export * from './purchase.service';
export * from './sale.service';
export * from './salary.service';
export * from './staff.service';
export * from './supplier.service';
export * from './unit.service';
