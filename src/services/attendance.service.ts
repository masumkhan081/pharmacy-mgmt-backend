
import { entities } from "../config/constants";
import Attendance from "../models/attendance.model";
import { IDType, QueryParams } from "../types/requestResponse";
import { IAttendance, IAttendanceUpdatePayload } from "../types/attendance.type";
import getSearchAndPagination from "../utils/queryHandler";
//
const createAttendance = async (data: IAttendance) => await Attendance.create(data);
//
const getSingleAttendance = async (id: IDType) => Attendance.findById(id);
//
const updateAttendance = async ({ id, data }: IAttendanceUpdatePayload) =>
  await Attendance.findByIdAndUpdate(id, data, { new: true });
//
const deleteAttendance = async (id: IDType) => await Attendance.findByIdAndDelete(id);
//
async function getAttendances(query: QueryParams) {
  try {
    const {
      currentPage,
      viewLimit,
      viewSkip,
      sortBy,
      sortOrder,
      filterConditions,
      sortConditions,
    } = getSearchAndPagination({ query, entity: entities.attendance });

    const fetchResult = await Attendance.find(filterConditions)
      .sort(sortConditions)
      .skip(viewSkip)
      .limit(viewLimit);

    const total = await Attendance.countDocuments(filterConditions);
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
}

export default {
  createAttendance,
  updateAttendance,
  getSingleAttendance,
  deleteAttendance,
  getAttendances,
};
