import { useEffect } from "react";
import socketService from "../services/socket";

export const useSocketSession = (token: string | null | undefined) => {
  useEffect(() => {
    if (token) {
      socketService.connect(token);
      return;
    }

    socketService.disconnect();
  }, [token]);

  useEffect(() => {
    return () => {
      socketService.disconnect();
    };
  }, []);
};
