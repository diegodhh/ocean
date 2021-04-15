import express from "express";
import { User } from "../entity/User";

export interface IUserRequest extends express.Request {
  user?: User;
  token?: string;
}
