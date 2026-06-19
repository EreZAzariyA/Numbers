import { useEffect } from "react";
import socketService from "../services/socket";

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

const scheduleConnect = (token: string): (() => void) => {
  const browserWindow = window as IdleWindow;
  let idleId: number | undefined;
  let timeoutId: number | undefined;

  const connect = () => {
    socketService.connect(token);
  };

  if (browserWindow.requestIdleCallback) {
    idleId = browserWindow.requestIdleCallback(connect, { timeout: 2000 });
  } else {
    timeoutId = window.setTimeout(connect, 750);
  }

  return () => {
    if (idleId !== undefined && browserWindow.cancelIdleCallback) {
      browserWindow.cancelIdleCallback(idleId);
    }
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
    }
  };
};

export const useSocketSession = (token: string | null | undefined) => {
  useEffect(() => {
    if (!token) {
      socketService.disconnect();
      return;
    }

    let cancelConnect = scheduleConnect(token);

    const handlePageHide = () => {
      cancelConnect();
      socketService.disconnect();
    };

    const handlePageShow = () => {
      cancelConnect();
      cancelConnect = scheduleConnect(token);
    };

    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      cancelConnect();
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
      socketService.disconnect();
    };
  }, [token]);
};
