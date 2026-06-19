import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Flex, message, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import adminService, { AdminUserSummary } from "../../services/admin";
import { getError } from "../../utils/helpers";

const QUERY_KEY = ['admin', 'users'];

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const { data: users = [], isLoading } = useQuery<AdminUserSummary[]>({
    queryKey: QUERY_KEY,
    queryFn: () => adminService.listUsers(),
    staleTime: 1000 * 60 * 5,
  });

  const reindexAllMutation = useMutation({
    mutationFn: () => adminService.reindexAll(),
    onSuccess: (result) => {
      messageApi.success(
        `Re-index queued: ${result.banksQueued ?? 0} banks across ${result.usersQueued ?? 0} users`,
      );
    },
    onError: (err: unknown) => {
      messageApi.error(getError(err));
    },
  });

  const reindexUserMutation = useMutation({
    mutationFn: (user_id: string) => adminService.reindexUser(user_id),
    onSuccess: (result, user_id) => {
      messageApi.success(`Re-index queued: ${result.queued ?? 0} banks for user`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (err: unknown) => {
      messageApi.error(getError(err));
    },
  });

  const columns: ColumnsType<AdminUserSummary> = [
    {
      title: 'Name',
      key: 'name',
      render: (_, row) =>
        [row.profile?.first_name, row.profile?.last_name].filter(Boolean).join(' ') || '—',
    },
    {
      title: 'Email',
      key: 'email',
      render: (_, row) => row.emails?.[0]?.email ?? '—',
    },
    {
      title: 'Role',
      key: 'role',
      render: (_, row) => (
        <Tag color={row.role === 'admin' ? 'gold' : 'default'}>
          {row.role ?? 'user'}
        </Tag>
      ),
    },
    {
      title: 'Joined',
      key: 'createdAt',
      render: (_, row) => dayjs(row.createdAt).format('MMM D, YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <Button
          size="small"
          loading={reindexUserMutation.isPending && reindexUserMutation.variables === row._id}
          onClick={() => reindexUserMutation.mutate(row._id)}
        >
          Re-index
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Admin Dashboard
        </Typography.Title>
        <Button
          type="primary"
          loading={reindexAllMutation.isPending}
          onClick={() => reindexAllMutation.mutate()}
        >
          Re-index All Users
        </Button>
      </Flex>
      <Table<AdminUserSummary>
        rowKey="_id"
        loading={isLoading}
        dataSource={users}
        columns={columns}
        pagination={{ pageSize: 20 }}
      />
    </div>
  );
};

export default AdminDashboard;
