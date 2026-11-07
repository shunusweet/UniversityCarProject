const db = require("../models"); // Sequelize models
const User = db.User;
const Role = db.Role;
const Permission = db.Permission;
const Resource = db.Resource;
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

// console.log('User model:', User);

// const getAllUsers = (async (req, res) => {
//   // Fetch user's corp_id
//   const currentUser = await User.findOne({
//     where: { id: req.user.id, active: true },
//     attributes: ['corp_id']
//   });

//   if (!currentUser || !currentUser.corp_id) {
//     return res.status(400).json({
//       success: false,
//       message: 'User corporation not found'
//     });
//   }

//   const corp_id = currentUser.corp_id;
//   const page = Math.max(1, parseInt(req.query.page) || 1);
//   const limit = Math.max(1, parseInt(req.query.limit) || 10);
//   const offset = (page - 1) * limit;

//   try {
//     // Total count
//     const totalItems = await User.count({
//       where: { corp_id, active: true }
//     });
//     const totalPages = Math.ceil(totalItems / limit);

//     // Paginated users
//     const users = await User.findAll({
//       where: { corp_id, active: true },
//       attributes: ['id', 'first', 'last', 'email', 'type', 'active', 'role_id', 'createdAt'],
//       offset,
//       limit
//     });

//     const roleIds = [...new Set(users.map(u => u.role_id).filter(Boolean))];
//     const roles = await Role.findAll({
//       where: { role_id: roleIds, corp_id },
//       attributes: ['role_id', 'name', 'description']
//     });

//     const rolePermissions = await Permission.findAll({
//       where: { role_id: roleIds },
//       attributes: ['role_id']
//     });

//     // Map counts and roles
//     const permissionsCountMap = rolePermissions.reduce((acc, p) => {
//       acc[p.role_id] = (acc[p.role_id] || 0) + 1;
//       return acc;
//     }, {});

//     const roleMap = roles.reduce((acc, r) => {
//       acc[r.role_id] = { role_id: r.role_id, name: r.name, description: r.description };
//       return acc;
//     }, {});

//     const formattedUsers = users.map(u => {
//       const role = u.role_id ? roleMap[u.role_id] : null;
//       return {
//         user_id: u.id,
//         first_name: u.first,
//         last_name: u.last,
//         email: u.email,
//         user_type: u.type,
//         is_active: u.active,
//         role,
//         permissionsCount: role ? permissionsCountMap[role.role_id] || 0 : 0,
//         created_at: u.createdAt
//       };
//     });

//     res.status(200).json({
//       success: true,
//       data: formattedUsers,
//       totalItems,
//       totalPages,
//       currentPage: page,
//       itemsPerPage: limit
//     });
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch users',
//       error: error.message
//     });
//   }
// });

// const getUserById = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // 🔹 Get current user's corpId
//     const currentUser = await User.findOne({
//       where: { id: req.user.id, active: true },
//       attributes: ['corpId'],
//     });

//     if (!currentUser?.corpId) {
//       return res.status(400).json({
//         success: false,
//         message: 'User corporation not found'
//       });
//     }

//     // 🔹 Get the target user
//     const user = await User.findOne({
//       where: { id: userId, corpId: currentUser.corpId, active: true },
//       attributes: ['id', 'first', 'last', 'email', 'phone', 'type', 'active', 'roleId'],
//     });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // 🔹 Get Role (fixed here)
//     const role = await Role.findOne({
//       where: { id: user.roleId },
//       attributes: ['id', 'name', 'description'],
//     });

//     // 🔹 Get Permissions for that role
//     const permissions = await Permission.findAll({
//       where: { role_id: role?.id || null },
//       attributes: ['permission_id', 'resource_id', 'can_read', 'can_create', 'can_update', 'can_delete'],
//     });

//     // 🔹 Get Resources linked to permissions
//     const resourceIds = permissions.map(p => p.resource_id);
//     const resources = await Resource.findAll({
//       where: { resource_id: resourceIds },
//       attributes: ['resource_id', 'title', 'description', 'icon'],
//     });

//     // 🔹 Merge permissions with resources
//     const permissionsWithResources = permissions.map(perm => {
//       const resource = resources.find(r => r.resource_id === perm.resource_id);
//       return {
//         ...perm.dataValues,
//         resource: resource || null
//       };
//     });

//     // 🔹 Send response
//     res.status(200).json({
//       success: true,
//       data: {
//         user_id: user.id,
//         first_name: user.first,
//         last_name: user.last,
//         email: user.email,
//         mobile: user.phone,
//         user_type: user.type,
//         is_active: user.active,
//         role: role ? {
//           role_id: role.id,
//           name: role.name,
//           description: role.description
//         } : null,
//         permissionsCount: permissions.length,
//         permissions: permissionsWithResources
//       }
//     });

//   } catch (error) {
//     console.error('❌ Error in getUserById:', error);

//     res.status(500).json({
//       success: false,
//       message: 'Internal Server Error',
//       error: error.message
//     });
//   }
// };
// const updateUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // ✅ Get current user's corporation
//     const currentUser = await User.findOne({
//       where: { id: req.user.id, active: true },
//       attributes: ['corpId'] // ✅ correct field name
//     });

//     if (!currentUser?.corpId) {
//       return res.status(400).json({ success: false, message: 'User corporation not found' });
//     }

//     const corpId = currentUser.corpId;

//     // ✅ Get input fields
//     const { first_name, last_name, email, type, role_id, is_active } = req.body;

//     // ✅ Find user to update
//     const user = await User.findOne({
//       where: { id: userId, corpId, active: true } // ✅ use correct field name: corpId
//     });

//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     // ✅ Check for email conflict
//     if (email && email.toLowerCase() !== user.email) {
//       const exists = await User.findOne({
//         where: { email: email.toLowerCase() }
//       });
//       if (exists) {
//         return res.status(400).json({ success: false, message: 'User with this email already exists' });
//       }
//     }

//     // ✅ Check if role is valid (only if it's changing)
//     if (role_id && role_id !== user.roleId) {
//       const role = await Role.findOne({ where: { role_id: role_id, corpId } });
//       if (!role) {
//         return res.status(400).json({ success: false, message: 'Invalid role ID' });
//       }
//     }

//     // ✅ Update user
//     await user.update({
//       first: first_name || user.first,
//       last: last_name || user.last,
//       email: email ? email.toLowerCase() : user.email,
//       type: type || user.type,
//       roleId: role_id !== undefined ? role_id : user.roleId,
//       active: is_active !== undefined ? is_active : user.active
//     });

//     // ✅ Get updated user with role & permissions
//    const updatedUser = await User.findOne({
//   where: { id: userId },
//   attributes: ['id', 'first', 'last', 'email', 'phone', 'type', 'active'],
//   include: [{
//     model: Role,
//     as: 'Role',
//     attributes: ['id', 'name', 'description'],
//     include: [{
//       model: Permission,
//       as: 'Permissions', // ✅ Include the alias exactly as defined
//       attributes: ['permission_id']
//     }]
//   }]
// });

//     const role = updatedUser.Role;
//     const permissionsCount = role ? role.Permissions.length : 0;

//     res.status(200).json({
//       success: true,
//       message: 'User updated successfully',
//       data: {
//         user_id: updatedUser.id,
//         first_name: updatedUser.first,
//         last_name: updatedUser.last,
//         email: updatedUser.email,
//         mobile: updatedUser.phone,
//         user_type: updatedUser.type,
//         is_active: updatedUser.active,
//         role: role ? {
//           role_id: role.role_id,
//           name: role.name,
//           description: role.description
//         } : null,
//         permissionsCount
//       }
//     });
//   } catch (error) {
//     console.error('Update User Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Something went wrong',
//       error: error.message || error
//     });
//   }
// };
// const getAllUsers = async (req, res) => {
//   try {
//     // Fetch user's corpId
//     const currentUser = await User.findOne({
//       where: { id: req.user.id, active: true },
//       attributes: ['corpId']  // Fetch the user's corpId
//     });

//     if (!currentUser || !currentUser.corpId) {
//       return res.status(400).json({
//         success: false,
//         message: 'User corporation not found'
//       });
//     }

//     const corpId = currentUser.corpId;
//     const page = Math.max(1, parseInt(req.query.page) || 1);  // Page number, default to 1
//     const limit = Math.max(1, parseInt(req.query.limit) || 10);  // Items per page, default to 10
//     const offset = (page - 1) * limit;  // Offset for pagination

//     // Total count of active users in this corporation
//     const totalItems = await User.count({
//       where: { corpId, active: true }
//     });

//     const totalPages = Math.ceil(totalItems / limit);  // Calculate total pages

//     // Paginated users query
//     const users = await User.findAll({
//       where: { corpId, active: true },
//       attributes: ['id', 'first', 'last', 'email', 'type', 'active', 'roleId', 'createdAt'],
//       offset,
//       limit
//     });

//     const roleIds = [...new Set(users.map(u => u.roleId).filter(Boolean))];  // Get distinct roleIds from the users
//     const roles = await Role.findAll({
//       where: { id: roleIds, corpId },
//       attributes: ['id', 'name', 'description']
//     });

//     const rolePermissions = await Permission.findAll({
//       where: { roleId: roleIds },
//       attributes: ['roleId']
//     });

//     // Map role and permission counts
//     const permissionsCountMap = rolePermissions.reduce((acc, p) => {
//       acc[p.roleId] = (acc[p.roleId] || 0) + 1;
//       return acc;
//     }, {});

//     const roleMap = roles.reduce((acc, r) => {
//       acc[r.id] = { id: r.id, name: r.name, description: r.description };
//       return acc;
//     }, {});

//     // Format the users data
//     const formattedUsers = users.map(u => {
//       const role = u.roleId ? roleMap[u.roleId] : null;
//       return {
//         user_id: u.id,
//         first_name: u.first,
//         last_name: u.last,
//         email: u.email,
//         user_type: u.type,
//         is_active: u.active,
//         role,
//         permissionsCount: role ? permissionsCountMap[role.id] || 0 : 0,
//         created_at: u.createdAt
//       };
//     });

//     // Respond with the paginated and formatted user data
//     res.status(200).json({
//       success: true,
//       data: formattedUsers,
//       totalItems,
//       totalPages,
//       currentPage: page,
//       itemsPerPage: limit
//     });

//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch users',
//       error: error.message
//     });
//   }
// };

const createUser = async (req, res) => {
  const currentUser = await User.findOne({
    where: { id: req.user.id, active: true },
    attributes: ["corp_id", "corp_name"],
  });

  if (!currentUser?.corp_id) {
    return res
      .status(400)
      .json({ success: false, message: "User corporation not found" });
  }

  const { corp_id, corp_name } = currentUser;
  const {
    first_name,
    last_name,
    email,
    password,
    type = "User",
    role_id,
  } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required fields" });
  }

  const existingUser = await User.findOne({
    where: { email: email.toLowerCase() },
  });
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "User with this email already exists" });
  }

  if (role_id) {
    const role = await Role.findOne({ where: { role_id, corp_id } });
    if (!role) {
      const globalRole = await Role.findOne({ where: { role_id } });
      return res.status(400).json({
        success: false,
        message: globalRole
          ? "Role exists but belongs to a different corporation."
          : "Invalid role ID – role does not exist",
      });
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = generateId("USER");

  const created = await User.create({
    id: userId,
    corp_id,
    corp_name,
    first: first_name, // adjust column name as needed
    last: last_name,
    email: email.toLowerCase(),
    password: hashedPassword,
    type,
    active: true,
    role_id: role_id || null,
  });

  const createdUser = await User.findOne({
    where: { id: userId },
    attributes: ["id", "first", "last", "email", "mobile", "type", "active"],
    include: role_id
      ? [
          {
            model: Role,
            attributes: ["role_id", "name", "description"],
          },
        ]
      : [],
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: {
      user_id: createdUser.id,
      first_name: createdUser.first,
      last_name: createdUser.last,
      email: createdUser.email,
      mobile: createdUser.mobile,
      user_type: createdUser.type,
      is_active: createdUser.active,
      role: createdUser.Role
        ? {
            role_id: createdUser.Role.role_id,
            name: createdUser.Role.name,
            description: createdUser.Role.description,
          }
        : null,
      permissionsCount: 0,
    },
  });
};
// const getUserById = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // 🔹 Get the user by ID
//     const user = await User.findOne({
//       where: { id: userId, active: true },
//       attributes: ['id', 'first', 'last', 'email', 'phone', 'type', 'active'],
//     });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // 🔹 Response without role/permissions
//     res.status(200).json({
//       success: true,
//       data: {
//         user_id: user.id,
//         first_name: user.first,
//         last_name: user.last,
//         email: user.email,
//         mobile: user.phone,
//         user_type: user.type,
//         is_active: user.active
//       }
//     });

//   } catch (error) {
//     console.error('❌ Error in getUserById:', error);

//     res.status(500).json({
//       success: false,
//       message: 'Internal Server Error',
//       error: error.message
//     });
//   }
// };

// const updateUser = (async (req, res) => {
//   const { userId } = req.params;
//   const currentUser = await User.findOne({
//     where: { id: req.user.id, active: true },
//     attributes: ['corp_id']
//   });

//   if (!currentUser?.corp_id) {
//     return res.status(400).json({ success: false, message: 'User corporation not found' });
//   }

//   const corpId = currentUser.corp_id;
//   const { first_name, last_name, email, type, role_id, is_active } = req.body;

//   const user = await User.findOne({
//     where: { id: userId, corp_id: corpId, active: true }
//   });

//   if (!user) {
//     return res.status(404).json({ success: false, message: 'User not found' });
//   }

//   if (email && email.toLowerCase() !== user.email) {
//     const exists = await User.findOne({ where: { email: email.toLowerCase() } });
//     if (exists) {
//       return res.status(400).json({ success: false, message: 'User with this email already exists' });
//     }
//   }

//   if (role_id && role_id !== user.role_id) {
//     const role = await Role.findOne({ where: { role_id, corp_id: corpId } });
//     if (!role) {
//       return res.status(400).json({ success: false, message: 'Invalid role ID' });
//     }
//   }

//   await user.update({
//     first: first_name || user.first,
//     last: last_name  || user.last,
//     email: email ? email.toLowerCase() : user.email,
//     type: type || user.type,
//     role_id: role_id !== undefined ? role_id : user.role_id,
//     active: is_active !== undefined ? is_active : user.active
//   });

//   const updatedUser = await User.findOne({
//     where: { id: userId },
//     attributes: ['id', 'first', 'last', 'email', 'mobile', 'type', 'active'],
//     include: [{
//       model: Role,
//       attributes: ['role_id', 'name', 'description'],
//       include: [{
//         model: Permission,
//         attributes: ['permission_id']
//       }]
//     }]
//   });

//   const role = updatedUser.Role;
//   const permissionsCount = role ? role.Permissions.length : 0;

//   res.status(200).json({
//     success: true,
//     message: 'User updated successfully',
//     data: {
//       user_id: updatedUser.id,
//       first_name: updatedUser.first,
//       last_name: updatedUser.last,
//       email: updatedUser.email,
//       mobile: updatedUser.mobile,
//       user_type: updatedUser.type,
//       is_active: updatedUser.active,
//       role: role ? {
//         role_id: role.role_id,
//         name: role.name,
//         description: role.description
//       } : null,
//       permissionsCount
//     }
//   });
// });

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Get current user's corporation
    const currentUser = await User.findOne({
      where: { id: req.user.id, active: true },
      attributes: ["corp_id"],
    });

    if (!currentUser?.corp_id) {
      return res.status(400).json({
        success: false,
        message: "User corporation not found",
      });
    }

    const corp_id = currentUser.corp_id;

    // Find the user to delete
    const user = await User.findOne({
      where: { id: userId, corp_id, active: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Soft delete (set active to false)
    await user.update({ active: false });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};
const changeUserPassword = async (req, res) => {
  const { userId } = req.params;
  const { password } = req.body;

  try {
    // Validate input
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // Get current user's corp_id
    const currentUser = await User.findOne({
      where: { id: req.user.id, active: true },
      attributes: ["corp_id"],
    });

    if (!currentUser?.corp_id) {
      return res.status(400).json({
        success: false,
        message: "User corporation not found",
      });
    }

    // Find target user
    const user = await User.findOne({
      where: { id: userId, corp_id: currentUser.corp_id, active: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password
    await user.update({ password: hashedPassword });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message,
    });
  }
};
const getRecentUsers = async (req, res) => {
  try {
    const recentUsers = await User.findAll({
      attributes: ["id", "first", "last", "email", "roleId", "active"],
      order: [["createdAt", "DESC"]], // fallback to createdAt
      limit: 5,
    });

    const usersWithRoles = await Promise.all(
      recentUsers.map(async (user) => {
        const role = await Role.findByPk(user.roleId);
        return {
          ...user.toJSON(),
          role: role ? role.name : "N/A",
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Recent users fetched successfully",
      data: usersWithRoles,
    });
  } catch (error) {
    console.error("Error fetching recent users:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching recent users",
      error: error.message,
    });
  }
};

// const getAllUsers = async (req, res) => {
//   try {
//     // Get current user's corpId
//     const currentUser = await User.findAll({
//       where: { id: req.user.id, active: true },
//       attributes: ["corpId"],
//     });

//     if (!currentUser?.corpId) {
//       return res
//         .status(400)
//         .json({ success: false, message: "User corporation not found" });
//     }

//     const corpId = currentUser.corpId;
//     const page = Math.max(1, parseInt(req.query.page) || 1);
//     const limit = Math.max(1, parseInt(req.query.limit) || 10);
//     const offset = (page - 1) * limit;

//     // Get the total number of active users in this corp
//     const totalItems = await User.count({
//       where: { corpId, active: true },
//     });

//     const totalPages = Math.ceil(totalItems / limit);

//     // Fetch paginated users in this corporation
//     const users = await User.findAll({
//       where: { corpId, active: true },
//       attributes: ["id", "first", "last", "email", "type", "active"],
//       offset,
//       limit,
//     });

//     res.status(200).json({
//       success: true,
//       data: users,
//       totalItems,
//       totalPages,
//       currentPage: page,
//       itemsPerPage: limit,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the current user's corpId
    const currentUser = await User.findOne({
      where: { id: req.user.id, active: true },
      attributes: ["corpId"],
    });

    if (!currentUser?.corpId) {
      return res
        .status(400)
        .json({ success: false, message: "User corporation not found" });
    }

    // Get the user by their userId and ensure they belong to the same corporation
    const user = await User.findOne({
      where: { id: userId, corpId: currentUser.corpId, active: true },
      attributes: ["id", "first", "last", "email", "phone", "type", "active"],
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getAllUsers = async (req, res) => {
  try {
    // ✅ Use findByPk instead of findAll to get a single user
    const currentUser = await User.findByPk(req.user.id, {
      attributes: ["corpId"],
    });

    // ✅ Check if user exists and has a corpId
    if (!currentUser || !currentUser.corpId) {
      return res.status(400).json({
        success: false,
        message: "User corporation not found",
      });
    }

    const corpId = currentUser.corpId;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;

    // ✅ Get total active users for the same corp
    const totalItems = await User.count({
      where: { corpId, active: true },
    });

    const totalPages = Math.ceil(totalItems / limit);

    // ✅ Fetch paginated users of same corpId
    const users = await User.findAll({
      where: { corpId, active: true },
      attributes: ["id", "first", "last", "email", "type", "active"],
      offset,
      limit,
    });

    res.status(200).json({
      success: true,
      data: users,
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch current user's corpId
    const currentUser = await User.findOne({
      where: { id: req.user.id, active: true },
      attributes: ["corpId"],
    });

    if (!currentUser?.corpId) {
      return res
        .status(400)
        .json({ success: false, message: "User corporation not found" });
    }

    const corpId = currentUser.corpId;
    const { first_name, last_name, email, type, role_id, is_active } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({
      where: { id: userId, corpId, active: true },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if email already exists (ensure uniqueness)
    if (email) {
      const existingUser = await User.findOne({
        where: { email: email.toLowerCase() },
      });
      if (existingUser && existingUser.id !== userId) {
        return res
          .status(400)
          .json({ success: false, message: "Email already in use" });
      }
    }

    // Check if role_id is valid
    if (role_id !== undefined) {
      const role = await Role.findOne({ where: { id: role_id } });
      if (!role) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid role ID" });
      }
    }

    // Update the user
    await user.update({
      first: first_name || user.first,
      last: last_name || user.last,
      email: email ? email.toLowerCase() : user.email,
      type: type || user.type,
      roleId: role_id !== undefined ? role_id : user.roleId,
      active: is_active !== undefined ? is_active : user.active,
    });

    res
      .status(200)
      .json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Error details:", error); // Log more details
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  getRecentUsers,
};