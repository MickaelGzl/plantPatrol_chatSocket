import { Types } from "mongoose";
import { IMessage } from "./messageInterface";

export interface IRoom {
  name: string;
  users: string[];
  messages: Types.ObjectId[];
}
