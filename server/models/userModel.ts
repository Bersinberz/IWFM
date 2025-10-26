import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  role: "Admin" | "Driver";
  email: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Driver"], required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
