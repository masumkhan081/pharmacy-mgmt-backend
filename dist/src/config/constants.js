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
};
exports.mapFilterables = {
    [exports.entities.drug]: ["brand", "formulation", "unit"],
    [exports.entities.generic]: ["group"],
    [exports.entities.unit]: [],
    [exports.entities.formulation]: [],
    [exports.entities.group]: [],
    [exports.entities.manufacturer]: [],
    [exports.entities.brand]: ["manufacturer", "generic"],
};
// may be changed based on the outcome expected
exports.mapDefaultSortBy = {
    [exports.entities.drug]: "",
};
