import _ from 'lodash';
import Role from '../../models/Role.js';
import User from '../../models/User.js';

export const roleSeeder = async (roles) => {
  try {
    const roleArray = [];
    if (roles instanceof Array) {
      roles.forEach((role) => {
        roleArray.push({ name: role, slug: _.kebabCase(role) });
      });
    }
    const rolesCreated = await Role.insertMany(roleArray);
    return rolesCreated;
  } catch (error) {}
};
export const userSeeder = async (users) => {
  const usersArray = [];
  const dbrole = await Role.find({}, { _id: true, slug: true });

  if (users instanceof Array) {
    users.forEach(async ({ username, email, password, role }) => {
      const f = dbrole.filter((r) => {
        return r.slug == role;
      });
      if (dbrole) {
        usersArray.push({
          username: username,
          email: email,
          password: password,
          role: f[0]._id,
        });
      }
    });
  }
  const usersCreated = await User.insertMany(usersArray);
  return usersCreated;
};
