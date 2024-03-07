import { Schema, model } from "mongoose";
import { IRoom } from "../../types";

const roomSchema = new Schema<IRoom>(
  {
    name: {
      type: String,
      required: [true, "Le channel de discussion doit avoir un nom."],
      unique: true,
    },
    users: {
      type: [String],
    },
    messages: {
      type: [Schema.Types.ObjectId],
      ref: "messages",
    },
  },
  {
    timestamps: true,
  }
);

export const Room = model(`rooms`, roomSchema);
