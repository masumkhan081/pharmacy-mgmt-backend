"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const getSearchAndPagination = ({ query, entity, }) => {
    const { search, page, limit, searchBy, sortBy, sortOrder } = query;
    const sortField = sortBy ?? "createdAt";
    const sortDirection = sortOrder ?? "desc";
    const currentPage = Number(page) || 1;
    const viewLimit = Number(limit) || constants_1.defaultViewLimit;
    const viewSkip = viewLimit * (currentPage - 1);
    const searchField = searchBy || "whole";
    const searchTerm = search || "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filterConditions = {};
    const sortConditions = {
        [sortField]: sortDirection,
    };
    for (const filterableField of constants_1.mapFilterables[entity] || []) {
        const filterData = query[filterableField];
        if (filterData) {
            filterConditions[filterableField] = filterData;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchConditions = [];
    if (searchTerm) {
        if (searchField === "whole") {
            for (const searchableField of constants_1.mapSearchable[entity] || []) {
                searchConditions.push({
                    [searchableField]: { $regex: new RegExp(searchTerm, "i") },
                });
            }
        }
        else {
            searchConditions.push({
                [searchField]: { $regex: new RegExp(searchTerm, "i") },
            });
        }
        console.log("searchConditions: " + JSON.stringify(searchConditions));
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
exports.default = getSearchAndPagination;
