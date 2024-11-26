import {
  mapSearchable,
  mapFilterables,
  defaultViewLimit,
} from "../config/constants";
import { QueryParams } from "../types/requestResponse";

interface SearchAndPaginationOptions {
  query: QueryParams;
  entity: string;
}

interface SearchAndPaginationResult {
  currentPage: number;
  searchTerm: string;
  viewLimit: number;
  viewSkip: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterConditions: Record<string, any>;
  sortConditions: Record<string, "asc" | "desc">;
}

const getSearchAndPagination = ({
  query,
  entity,
}: SearchAndPaginationOptions): SearchAndPaginationResult => {
  const { search, page, limit, searchBy, sortBy, sortOrder } = query;

  const sortField = sortBy ?? "createdAt";
  const sortDirection = sortOrder ?? "desc";

  const currentPage = Number(page) || 1;
  const viewLimit = Number(limit) || defaultViewLimit;
  const viewSkip = viewLimit * (currentPage - 1);

  const searchField = searchBy || "whole";
  const searchTerm = search || "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filterConditions: Record<string, any> = {};
  const sortConditions: Record<string, "asc" | "desc"> = {
    [sortField]: sortDirection,
  };

  for (const filterableField of mapFilterables[entity] || []) {
    const filterData = query[filterableField];
    if (filterData) {
      filterConditions[filterableField] = filterData;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchConditions: any[] = [];
  if (searchTerm) {
    for (const searchableField of mapSearchable[entity] || []) {
      if (searchField === "whole") {
        searchConditions.push({
          [searchableField]: { $regex: new RegExp(searchTerm, "i") },
        });
      } else {
        searchConditions.push({
          [searchableField]: { $regex: new RegExp(searchTerm, "i") },
        });
      }
    }
  }

  if (searchConditions.length > 0) {
    filterConditions["$or"] = searchConditions;
  }

  return {
    currentPage,
    searchTerm,
    viewLimit,
    viewSkip,
    sortBy: sortField,
    sortOrder: sortDirection,
    filterConditions,
    sortConditions,
  };
};

export default getSearchAndPagination;
