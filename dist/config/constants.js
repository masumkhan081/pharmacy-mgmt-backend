"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapDefaultSortBy = exports.mapFilterables = exports.mapSearchable = exports.defaultSortOrder = exports.defaultViewLimit = exports.paginationFields = exports.entities = exports.userRoles = exports.testUsers = void 0;
exports.testUsers = [
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
exports.userRoles = {
    admin: "ADMIN",
    seller: "MANAGER",
    user: "SALESMAN",
};
exports.entities = {
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
exports.paginationFields = ["page", "limit", "sortBy", "sortOrder"];
exports.defaultViewLimit = 20;
exports.defaultSortOrder = "desc";
exports.mapSearchable = {
    [exports.entities.drug]: [],
    [exports.entities.generic]: ["name"],
    [exports.entities.unit]: ["shortName", "longName"],
    [exports.entities.formulation]: ["shortName", "longName"],
    [exports.entities.group]: ["name"],
    [exports.entities.manufacturer]: ["name"],
    [exports.entities.brand]: ["name"],
    [exports.entities.return]: ["returnNumber", "status"],
    [exports.entities.inventoryAlert]: ["name", "status"],
    [exports.entities.inventoryBatch]: ["batchNumber", "status"],
    [exports.entities.invoice]: ["invoiceNumber", "status"],
    [exports.entities.payment]: ["paymentNumber", "status"],
    [exports.entities.notification]: ["title", "type"],
    [exports.entities.refillReminder]: ["status"],
    [exports.entities.customer]: ["name", "email", "phone"],
    [exports.entities.doctor]: ["name", "specialty", "licenseNumber"],
    [exports.entities.prescription]: ["prescriptionNumber", "status"],
    [exports.entities.expense]: ["description", "category"],
    [exports.entities.auditTrail]: ["action", "entityType"],
    [exports.entities.report]: ["name", "type"]
};
exports.mapFilterables = {
    [exports.entities.drug]: ["brand", "formulation", "unit"],
    [exports.entities.generic]: ["group"],
    [exports.entities.unit]: [],
    [exports.entities.formulation]: [],
    [exports.entities.group]: [],
    [exports.entities.manufacturer]: [],
    [exports.entities.brand]: ["manufacturer", "generic"],
    [exports.entities.return]: ["type", "status", "customer", "supplier"],
    [exports.entities.inventoryAlert]: ["status", "drug", "isActive"],
    [exports.entities.inventoryBatch]: ["status", "drug", "manufacturer", "supplier"],
    [exports.entities.invoice]: ["status", "customer", "issueDate", "dueDate"],
    [exports.entities.payment]: ["status", "paymentMethod", "customer"],
    [exports.entities.notification]: ["type", "status", "recipientType"],
    [exports.entities.refillReminder]: ["status", "customer", "drug"],
    [exports.entities.customer]: ["status", "loyaltyTier"],
    [exports.entities.doctor]: ["specialty", "status"],
    [exports.entities.prescription]: ["status", "customer", "doctor"],
    [exports.entities.expense]: ["category", "status", "paymentMethod"],
    [exports.entities.auditTrail]: ["action", "entityType", "createdBy"],
    [exports.entities.report]: ["type", "status"]
};
// may be changed based on the outcome expected
exports.mapDefaultSortBy = {
    [exports.entities.drug]: "",
    [exports.entities.return]: "-createdAt",
    [exports.entities.inventoryAlert]: "-createdAt",
    [exports.entities.inventoryBatch]: "expirationDate",
    [exports.entities.invoice]: "-issueDate",
    [exports.entities.payment]: "-paymentDate",
    [exports.entities.notification]: "-createdAt",
    [exports.entities.refillReminder]: "reminderDate",
    [exports.entities.customer]: "name",
    [exports.entities.doctor]: "name",
    [exports.entities.prescription]: "-prescriptionDate",
    [exports.entities.expense]: "-date",
    [exports.entities.auditTrail]: "-timestamp",
    [exports.entities.report]: "-createdAt"
};
