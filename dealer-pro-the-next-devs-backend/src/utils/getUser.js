// utils/updateUserByType.js

const updateUserByType = async ({ user, updates }) => {
    if (!user || typeof updates !== 'object') {
      throw new Error('User and updates are required.');
    }
  
    user.first = updates.first ?? user.first;
    user.last = updates.last ?? user.last;
    user.email = updates.email ?? user.email;
  
    await user.save();
    return user;
  };
  
module.exports = updateUserByType;

