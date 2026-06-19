import { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAppSelector } from "../redux/store";
import socketService from "../services/socket";
import notificationsService, { NotificationModel } from "../services/notifications";

const NOTIFICATIONS_KEY = "notifications";
const SOCKET_EVENT = "notification";

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);
  const userId = user?._id;

  const { data: notifications = [], isLoading } = useQuery<NotificationModel[]>({
    queryKey: [NOTIFICATIONS_KEY, userId],
    queryFn: () => notificationsService.list(userId as string),
    enabled: !!userId,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = socketService.on(SOCKET_EVENT, (incoming: NotificationModel) => {
      queryClient.setQueryData<NotificationModel[]>([NOTIFICATIONS_KEY, userId], (current = []) => {
        if (current.some((item) => item._id === incoming._id)) return current;
        return [incoming, ...current];
      });
    });

    return unsubscribe;
  }, [userId, queryClient]);

  const markRead = useMutation({
    mutationFn: (id: string) => notificationsService.markRead(userId as string, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_KEY, userId] });
    },
  });

  const markAllRead = useMutation({
    mutationFn: () => notificationsService.markAllRead(userId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_KEY, userId] });
    },
  });

  const unreadCount = notifications.filter((item) => !item.read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    markRead: markRead.mutate,
    markAllRead: markAllRead.mutate,
  };
};
