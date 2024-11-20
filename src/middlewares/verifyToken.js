const { verifyToken } = require("../utils/tokenisation");

function accessControl(accessRoles) {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return forbid(res);
      }

      console.log("accessRoles:  " + accessRoles);

      const { success, payload } = verifyToken(token);
      console.log(JSON.stringify(payload));

      if (!success) {
        return forbid(res);
      }

      // Assign user ID and role for later use ( if i need for any further use)
      req.user_id = payload?.user_id;
      req.role = payload?.role;

      console.log(`${req.role} <> ${accessRoles}`);

      if (accessRoles.includes(req.role)) {
        return next();
      } else {
        return forbid(res);
      }
    } catch (error) {
      console.log("Error at accessControl: " + error.message);
      forbid(res);
    }
  };
}

const forbid = (res) =>
  res.status(403).json({
    success: false,
    message: "Access Forbidden !",
  });

module.exports = accessControl;

module.exports = accessControl;
