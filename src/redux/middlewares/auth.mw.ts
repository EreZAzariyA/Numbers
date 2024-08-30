import { Middleware } from "redux";

const authMiddleWare: Middleware = (store) => (next) => (action: any) => {

  return next(action);
}

export default authMiddleWare;