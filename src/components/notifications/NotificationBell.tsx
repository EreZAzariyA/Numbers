import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { Badge, Button, Dropdown, Empty, Flex, List, Typography } from "antd";
import BellOutlined from "@ant-design/icons/BellOutlined";
import { useNotifications } from "../../hooks/useNotifications";
import { NotificationSeverity } from "../../services/notifications";

const SEVERITY_COLOR: Record<NotificationSeverity, string> = {
  info: "#1677ff",
  warning: "#faad14",
  critical: "#ff4d4f",
};

const NotificationBell = () => {
  const { t } = useTranslation();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  const dropdownContent = (
    <div className="notification-dropdown" style={{ width: 340, maxHeight: 420, overflowY: "auto", background: "#fff", borderRadius: 8, boxShadow: "0 6px 16px rgba(0,0,0,0.12)" }}>
      <Flex justify="space-between" align="center" style={{ padding: "8px 12px" }}>
        <Typography.Text strong>{t("notifications.title")}</Typography.Text>
        {unreadCount > 0 && (
          <Button type="link" size="small" onClick={() => markAllRead()}>
            {t("notifications.markAllRead")}
          </Button>
        )}
      </Flex>
      {notifications.length === 0 ? (
        <Empty description={t("notifications.empty")} style={{ padding: 16 }} />
      ) : (
        <List
          size="small"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              onClick={() => !item.read && markRead(item._id)}
              style={{
                cursor: item.read ? "default" : "pointer",
                opacity: item.read ? 0.55 : 1,
                padding: "8px 12px",
                borderInlineStart: `3px solid ${SEVERITY_COLOR[item.severity]}`,
              }}
            >
              <Flex vertical style={{ width: "100%" }}>
                <Typography.Text strong style={{ fontSize: 13 }}>{item.title}</Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>{item.body}</Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 11, marginTop: 2 }}>
                  {dayjs(item.createdAt).format("DD/MM HH:mm")}
                </Typography.Text>
              </Flex>
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      dropdownRender={() => dropdownContent}
    >
      <Badge count={unreadCount} size="small">
        <Button type="text" size="small" icon={<BellOutlined style={{ fontSize: 18 }} />} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationBell;
