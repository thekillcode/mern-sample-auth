import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { generateToken } from '../services/token.service.js';

const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Role Name Is Required'],
      unique: [true, 'Role Name Already Exist'],
    },
    slug: {
      type: String,
      required: [true, 'Role Name Is Required'],
      unique: [true, 'Role Name Already Exist'],
    },
    permissions: {
      type: Array,
      required: [true, 'At least One Permission Required'],
    },
  },
  {
    collection: 'roles',
    timestamps: true,
  }
);

export default mongoose.model('Role', RoleSchema);
