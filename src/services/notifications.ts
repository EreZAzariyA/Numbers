import axios from "axios";
import config from "../utils/config";

export type NotificationSeverity = "info" | "warning" | "critical";

export interface NotificationModel {
  _id: string;
  user_id: string;
  type: string;
  severity: NotificationSeverity;
  title: string;
  body: string;
  meta: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

class NotificationsService {
  list = async (user_id: string, unreadOnly = false): Promise<NotificationModel[]> => {
    const response = await axios.get<NotificationModel[]>(config.urls.notifications + user_id, {
      params: { unreadOnly },
    });
    return response.data;
  };

  unreadCount = async (user_id: string): Promise<number> => {
    const response = await axios.get<{ count: number }>(
      `${config.urls.notifications}${user_id}/unread-count`,
    );
    return response.data.count;
  };

  markRead = async (user_id: string, id: string): Promise<NotificationModel> => {
    const response = await axios.post<NotificationModel>(
      `${config.urls.notifications}${user_id}/read/${id}`,
    );
    return response.data;
  };

  markAllRead = async (user_id: string): Promise<{ modified: number }> => {
    const response = await axios.post<{ modified: number }>(
      `${config.urls.notifications}${user_id}/read-all`,
    );
    return response.data;
  };

  refresh = async (user_id: string): Promise<NotificationModel[]> => {
    const response = await axios.post<NotificationModel[]>(
      `${config.urls.notifications}${user_id}/refresh`,
    );
    return response.data;
  };
}

const notificationsService = new NotificationsService();
export default notificationsService;
