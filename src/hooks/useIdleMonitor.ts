import { useEffect, useRef, useCallback } from 'react';
import { notification } from 'antd';
import i18next from 'i18next';
import { useAppDispatch } from '../redux/store';
import { logoutAction } from '../redux/actions/auth-actions';

const IDLE_TIMEOUT_MS = 5 * 60 * 1000;
const WARN_BEFORE_MS  = 1 * 60 * 1000;
const NOTIFICATION_KEY = 'idle-warning';

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
];

export const useIdleMonitor = (isAuthenticated: boolean): void => {
  const dispatch    = useAppDispatch();
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (logoutTimer.current !== null) {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
    }
    if (warnTimer.current !== null) {
      clearTimeout(warnTimer.current);
      warnTimer.current = null;
    }
    notification.destroy(NOTIFICATION_KEY);
  }, []);

  const resetTimer = useCallback(() => {
    clearTimers();

    warnTimer.current = setTimeout(() => {
      notification.warning({
        key: NOTIFICATION_KEY,
        message: i18next.t('idleMonitor.warningTitle'),
        description: i18next.t('idleMonitor.warningDesc'),
        duration: 0,
        placement: 'topRight',
      });
    }, IDLE_TIMEOUT_MS - WARN_BEFORE_MS);

    logoutTimer.current = setTimeout(() => {
      notification.destroy(NOTIFICATION_KEY);
      dispatch(logoutAction());
    }, IDLE_TIMEOUT_MS);
  }, [clearTimers, dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      clearTimers();
      return;
    }

    resetTimer();
    const handleActivity = () => resetTimer();

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      clearTimers();
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
};
