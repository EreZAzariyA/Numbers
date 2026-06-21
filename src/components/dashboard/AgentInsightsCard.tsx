import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Typography, Tag, Button, Skeleton, Empty, Space, message } from 'antd';
import agentInsightsService, { DigestResponse } from '../../services/agent-insights';
import UserModel from '../../models/user-model';

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

  const { data, isLoading, isError } = useQuery<DigestResponse>({
    queryKey: ['agent-insights-digest', user?._id],
    queryFn: () => agentInsightsService.getDigest(user._id),
    enabled: !!user?._id,
    staleTime: 5 * 60 * 1000,
  });

  const triggerMutation = useMutation({
    mutationFn: () => agentInsightsService.triggerAnalysis(user._id),
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['agent-insights-digest', user._id] });
      }, REFETCH_DELAY_MS);
    },
    onError: () => {
      message.error('Failed to trigger analysis. Please try again.');
    },
  });

  const sortedFindings = [...(data?.findings ?? [])].sort(
    (a, b) => (SEVERITY_ORDER[a.severity] ?? 3) - (SEVERITY_ORDER[b.severity] ?? 3)
  );

  const formattedDate = data?.generatedAt
    ? new Date(data.generatedAt).toLocaleString()
    : null;

  const hasContent = !!data?.aiSummary || sortedFindings.length > 0;

  return (
    <Card
      title="AI Financial Digest"
      extra={
        process.env.NODE_ENV !== 'production' ? (
          <Button
            size="small"
            onClick={() => triggerMutation.mutate()}
            loading={triggerMutation.isPending}
          >
            Trigger Analysis
          </Button>
        ) : null
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
          {sortedFindings.map((finding, i) => (
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
  );
};

export default AgentInsightsCard;
