import { entities } from "../config/constants.js";
import unitService from "../services/unit.js";
import { sendFetchResponse } from "../utils/responseHandler.js";
import { TypeController } from "../types/requestResponse.js";
//

export const getUnits: TypeController = async (req, res) => {
  try {
    const result = await unitService.getUnits(req.query);
    sendFetchResponse({ res, result, entity: entities.unit });
  } catch (error) {
    console.error(error);
    // sendErrorResponse({
    //   res,
    //   error,
    //   what: entities.category,
    // });
  }
};

export default {
  getUnits,
};
