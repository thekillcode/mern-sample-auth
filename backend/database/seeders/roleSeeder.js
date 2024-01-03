import Role from '../../models/Role.js';

const roles = [
  {
    name: 'User',
    slug: 'user',
  },
  {
    name: 'Admin',
    slug: 'admin',
  },
];
const roleSeeder = async () => {
  await Role.insertMany(roles);
};
