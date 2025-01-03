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
};

export const paginationFields = ["page", "limit", "sortBy", "sortOrder"];
export const defaultViewLimit = 20;
export const defaultSortOrder = "desc";

export const mapSearchable = {
  [entities.drug]: ["name"],
  [entities.generic]: ["name"],
  [entities.unit]: ["shortName", "longName"],

};

export const mapFilterables = {
  [entities.drug]: [],
  [entities.generic]: ["category", "status", "adminApproval", "seller"],
  [entities.unit]: ["shortName", "longName"],

};

// may be changed based on the outcome expected
export const mapDefaultSortBy = {
  [entities.drug]: "",
};
