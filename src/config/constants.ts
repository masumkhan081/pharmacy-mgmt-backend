export const userRoles = {
  admin: "ADMIN",
  seller: "MANAGER",
  user: "SALESMAN",
};

export const entities = {
  drug: "Drugs",
  generic: "Generics",
  unit: "Units",
  brand: "Brands",
  formulation: "Formulations",
  staff: "Staff",
  supplier: "Supplier",
};

export const paginationFields = ["page", "limit", "sortBy", "sortOrder"];
export const defaultViewLimit = 20;
export const defaultSortOrder = "desc";

export const mapSearchable = {
  [entities.drug]: ["name"],
  [entities.generic]: ["name"],
};

export const mapFilterables = {
  [entities.drug]: [],
  [entities.generic]: ["category", "status", "adminApproval", "seller"],
};

// may be changed based on the outcome expected
export const mapDefaultSortBy = {
  [entities.drug]: "",
};
