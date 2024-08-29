import { Middleware } from "redux";

const authMiddleWare: Middleware = (store) => (next) => (action) => {
  return next(action);
}

export default authMiddleWare;