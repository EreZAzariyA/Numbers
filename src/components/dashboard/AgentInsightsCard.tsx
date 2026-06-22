import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Typography, Tag, Button, Skeleton, Empty, Space, Modal, message, Flex } from 'antd';
import agentInsightsService, { DigestResponse } from '../../services/agent-insights';
import UserModel from '../../models/user-model';
import { useAppSelector } from '../../redux/store';

interface AgentInsightsCardProps {
  user: UserModel;
}

const SEVERITY_COLOR = {
  critical: 'error',
  warning: 'warning',
  info: 'processing',
} as const;

const SEVERITY_ORDER: Record<string, number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

const REFETCH_DELAY_MS = 3000;

const AgentInsightsCard: React.FC<AgentInsightsCardProps> = ({ user }) => {
  const queryClient = useQueryClient();
  const [debugModal, setDebugModal] = useState<DigestResponse | null>(null);
  const lang = useAppSelector((state) => state.config.language.lang);

  const { data, isLoading, isError } = useQuery<DigestResponse>({
    queryKey: ['agent-insights-digest', user?._id, lang],
    queryFn: () => agentInsightsService.getDigest(user._id, lang),
    enabled: !!user?._id,
    staleTime: 5 * 60 * 1000,
  });

  const triggerMutation = useMutation({
    mutationFn: () => agentInsightsService.triggerAnalysis(user._id),
    onSuccess: () => {
      setTimeout(async () => {
        queryClient.invalidateQueries({ queryKey: ['agent-insights-digest', user._id, lang] });
        const fresh = await agentInsightsService.getDigest(user._id, lang);
        setDebugModal(fresh);
      }, REFETCH_DELAY_MS);
    },
    onError: () => {
      message.error('Failed to trigger analysis. Please try again.');
    },
  });

  const alertsMutation = useMutation({
    mutationFn: () => agentInsightsService.triggerAlerts(user._id),
    onSuccess: () => message.success('Alerts regenerated successfully.'),
    onError: () => message.error('Failed to regenerate alerts. Please try again.'),
  });

  const refreshMutation = useMutation({
    mutationFn: () => agentInsightsService.triggerRefresh(user._id),
    onSuccess: ({ queued }) => message.success(`Bank refresh queued for ${queued} account(s).`),
    onError: () => message.error('Failed to queue bank refresh. Please try again.'),
  });

  const sortedFindings = [...(data?.findings ?? [])].sort(
    (a, b) => (SEVERITY_ORDER[a.severity] ?? 3) - (SEVERITY_ORDER[b.severity] ?? 3)
  );

  const formattedDate = data?.generatedAt
    ? new Date(data.generatedAt).toLocaleString()
    : null;

  const hasContent = !!data?.aiSummary || sortedFindings.length > 0;

  return (
    <>
    <Modal
      open={!!debugModal}
      title="Analysis Debug Output"
      onCancel={() => setDebugModal(null)}
      footer={null}
      width={700}
    >
      <pre style={{ maxHeight: 500, overflow: 'auto', fontSize: 12 }}>
        {JSON.stringify(debugModal, null, 2)}
      </pre>
    </Modal>
    <Card
      title="AI Financial Digest"
      extra={
        <Flex gap={8}>
          <Button
            size="small"
            onClick={() => refreshMutation.mutate()}
            loading={refreshMutation.isPending}
          >
            Refresh Banks
          </Button>
          <Button
            size="small"
            onClick={() => alertsMutation.mutate()}
            loading={alertsMutation.isPending}
          >
            Refresh Alerts
          </Button>
          <Button
            size="small"
            onClick={() => triggerMutation.mutate()}
            loading={triggerMutation.isPending}
          >
            Run Analysis
          </Button>
        </Flex>
      }
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : isError ? (
        <Typography.Text type="danger">Failed to load insights. Please try again later.</Typography.Text>
      ) : !hasContent ? (
        <Empty description="No insights yet — analysis runs each morning." />
      ) : (
        <Space direction="vertical" style={{ width: '100%' }}>
          {data?.aiSummary && (
            <Typography.Paragraph>{data.aiSummary}</Typography.Paragraph>
          )}
          {sortedFindings.map((finding) => (
            <div key={`${finding.severity}-${finding.title}`}>
              <Tag color={SEVERITY_COLOR[finding.severity]}>
                {finding.severity.toUpperCase()}
              </Tag>
              <strong>{finding.title}</strong>
              {finding.body && (
                <Typography.Text type="secondary"> — {finding.body}</Typography.Text>
              )}
            </div>
          ))}
          {formattedDate && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Updated {formattedDate}
            </Typography.Text>
          )}
        </Space>
      )}
    </Card>
    </>
  );
};

export default AgentInsightsCard;
