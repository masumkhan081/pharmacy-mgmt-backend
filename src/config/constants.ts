export const testUsers = [
  {
    email: "test.admin@gmail.com",
    password: "123456",
    role: "ADMIN",
    fullName: "admin khan",
    phone: "01833347848",
    address: "address ...",
  },
  {
    email: "test.salesman@gmail.com",
    password: "123456",
    role: "SALESMAN",
    fullName: "salesman khan",
    phone: "01833347848",
    address: "address ...",
  },
  {
    email: "test.manager@gmail.com",
    password: "123456",
    role: "MANAGER",
    fullName: "manager khan",
    phone: "01833347848",
    address: "address ...",
  },
];

export const userRoles = {
  admin: "ADMIN",
  seller: "MANAGER",
  user: "SALESMAN",
};

export const entities = {
  drug: "Drugs",
  group: "Group",
  generic: "Generics",
  unit: "Units",
  brand: "Brands",
  formulation: "Formulations",
  manufacturer: "Manufacturer",
  staff: "Staff",
  supplier: "Supplier",
  purchase: "Purchase",
  sale: "Sale",
  salary: "Salary",
  attendance: "Attendance",
  return: "Return",
  inventoryAlert: "InventoryAlert",
  inventoryBatch: "InventoryBatch",
  invoice: "Invoice",
  payment: "Payment",
  notification: "Notification",
  refillReminder: "RefillReminder",
  customer: "Customer",
  doctor: "Doctor",
  prescription: "Prescription",
  expense: "Expense",
  auditTrail: "AuditTrail",
  report: "Report"
};

export const paginationFields = ["page", "limit", "sortBy", "sortOrder"];
export const defaultViewLimit = 20;
export const defaultSortOrder = "desc";

export const mapSearchable = {
  [entities.drug]: [],
  [entities.generic]: ["name"],
  [entities.unit]: ["shortName", "longName"],
  [entities.formulation]: ["shortName", "longName"],
  [entities.group]: ["name"],
  [entities.manufacturer]: ["name"],
  [entities.brand]: ["name"],
  [entities.return]: ["returnNumber", "status"],
  [entities.inventoryAlert]: ["name", "status"],
  [entities.inventoryBatch]: ["batchNumber", "status"],
  [entities.invoice]: ["invoiceNumber", "status"],
  [entities.payment]: ["paymentNumber", "status"],
  [entities.notification]: ["title", "type"],
  [entities.refillReminder]: ["status"],
  [entities.customer]: ["name", "email", "phone"],
  [entities.doctor]: ["name", "specialty", "licenseNumber"],
  [entities.prescription]: ["prescriptionNumber", "status"],
  [entities.expense]: ["description", "category"],
  [entities.auditTrail]: ["action", "entityType"],
  [entities.report]: ["name", "type"]
};

export const mapFilterables = {
  [entities.drug]: ["brand", "formulation", "unit"],
  [entities.generic]: ["group"],
  [entities.unit]: [],
  [entities.formulation]: [],
  [entities.group]: [],
  [entities.manufacturer]: [],
  [entities.brand]: ["manufacturer", "generic"],
  [entities.return]: ["type", "status", "customer", "supplier"],
  [entities.inventoryAlert]: ["status", "drug", "isActive"],
  [entities.inventoryBatch]: ["status", "drug", "manufacturer", "supplier"],
  [entities.invoice]: ["status", "customer", "issueDate", "dueDate"],
  [entities.payment]: ["status", "paymentMethod", "customer"],
  [entities.notification]: ["type", "status", "recipientType"],
  [entities.refillReminder]: ["status", "customer", "drug"],
  [entities.customer]: ["status", "loyaltyTier"],
  [entities.doctor]: ["specialty", "status"],
  [entities.prescription]: ["status", "customer", "doctor"],
  [entities.expense]: ["category", "status", "paymentMethod"],
  [entities.auditTrail]: ["action", "entityType", "createdBy"],
  [entities.report]: ["type", "status"]
};

// may be changed based on the outcome expected
export const mapDefaultSortBy = {
  [entities.drug]: "",
  [entities.return]: "-createdAt",
  [entities.inventoryAlert]: "-createdAt",
  [entities.inventoryBatch]: "expirationDate",
  [entities.invoice]: "-issueDate",
  [entities.payment]: "-paymentDate",
  [entities.notification]: "-createdAt",
  [entities.refillReminder]: "reminderDate",
  [entities.customer]: "name",
  [entities.doctor]: "name",
  [entities.prescription]: "-prescriptionDate",
  [entities.expense]: "-date",
  [entities.auditTrail]: "-timestamp",
  [entities.report]: "-createdAt"
};
