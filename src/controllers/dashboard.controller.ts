import { Request, Response } from "express";
import dashboardService from "../services/dashboard.service";
import { sendFetchResponse, sendErrorResponse } from "../utils/responseHandler";

const getStats = async (req: Request, res: Response) => {
  try {
    const result = await dashboardService.getOperationalStats();
    sendFetchResponse({
      res,
      result,
      entity: "DashboardStats",
    });
  } catch (error) {
    sendErrorResponse({
      res,
      error,
      entity: "DashboardStats",
    });
  }
};

export default {
  getStats,
};
