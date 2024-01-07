import mongoose from 'mongoose';

const ResetPasswordTokenSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'reset-password-tokens',
    timestamps: true,
  }
);

export default mongoose.model('ResetPasswordToken', ResetPasswordTokenSchema);
