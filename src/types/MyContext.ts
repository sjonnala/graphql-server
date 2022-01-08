import { Request, Response } from "express";

export interface MyContext {
  req: Request;
  res: Response;
}

// declare module "express-session" {
//   interface Session {
//     userId: number;
//   }
// }
