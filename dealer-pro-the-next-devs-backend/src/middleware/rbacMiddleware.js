// const db = require("../models/index.js");
// const asyncHandler = require("express-async-handler");

// const User = db.users;
// const Role = db.roles;
// const Permission = db.permissions;
// const Resource = db.resources;


// const checkPermission = (resourceID, action) => {
//   return asyncHandler(async (req, res, next) => {
//     try {
//       const user = req.user;

//       // Find resource by title (case-insensitive)
//       const resource = await Resource.findOne({
//         where: db.Sequelize.where(
//           db.Sequelize.fn("LOWER", db.Sequelize.col("title")),
//           resourceID.toLowerCase()
//         )
//       });

//       if (!resource) {
//         return res.status(404).json({
//           success: false,
//           message: "Resource not found"
//         });
//       }

//       // Find permission with the matching role and resource
//       const permission = await Permission.findOne({
//         where: {
//           roleId: user.roleId,
//           // resourceId: resource.resourceId,
//           resourceId: resource.id, 
//           [`can${action.charAt(0).toUpperCase() + action.slice(1)}`]: true
//         }
//       });

//       if (!permission) {
//         return res.status(403).json({
//           success: false,
//           message: `You don't have permission to ${action} this resource`
//         });
//       }

//       req.permission = permission;
//       next();
//     } catch (error) {
//       console.error("Permission check error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Error checking permissions",
//         error: error.message
//       });
//     }
//   });
// };

// module.exports = {
//   checkPermission
// };



const db = require("../models/index.js");
const asyncHandler = require("express-async-handler");

const User = db.User;
const Role = db.Role;
const Permission = db.Permission;
const Resource = db.Resource;

const checkPermission = (resourceID, action) => {
  return asyncHandler(async (req, res, next) => {
    try {
      const user = req.user;

      // Validate if roleId exists
      if (!user.roleId) {
        return res.status(400).json({ success: false, message: 'User role is missing' });
      }

      // Validate action
      const validActions = ['create', 'read', 'update', 'delete'];
      if (!validActions.includes(action)) {
        return res.status(400).json({ success: false, message: 'Invalid action' });
      }

      // Find resource by title (case-insensitive)
      const resource = await Resource.findOne({
        where: { title: resourceID }
      });

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: "Resource not found"
        });
      }

      // Find permission with the matching role and resource
      const permission = await Permission.findOne({
        where: {
          roleId: user.roleId,
          resourceId: resource.id, // use resource id for consistency
          [`can${action.charAt(0).toUpperCase() + action.slice(1)}`]: true
        }
      });
  console.log(`Checking permission for action: ${action}, Resource: ${resource.title}, Role: ${user.roleId}`);
if (!permission) {
  console.log("Permission not found for user role.");
}
      if (!permission) {
        return res.status(403).json({
          success: false,
          message: `You don't have permission to ${action} this resource`
        });
      }

      req.permission = permission;
      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({
        success: false,
        message: "Error checking permissions",
        error: error.message
      });
    }
  });
};

module.exports = {
  checkPermission
};

