import { useState } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button, Col, Empty, Flex, message, Popconfirm, Progress,
  Row, Skeleton, Space, Typography,
} from "antd";
import { useAppSelector } from "../../redux/store";
import { SavingsGoalModel } from "../../utils/types";
import { asNumString, getError } from "../../utils/helpers";
import savingsGoalsServices from "../../services/savings-goals";
import SavingsGoalForm from "./SavingsGoalForm";
import "./SavingsGoals.css";

enum Steps {
  New = "New",
  Edit = "Edit",
}

const SavingsGoalsPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const { user } = useAppSelector((state) => state.auth);
  const { lang } = useAppSelector((state) => state.config.language);

  const [step, setStep] = useState<Steps | null>(null);
  const [selected, setSelected] = useState<Partial<SavingsGoalModel> | null>(null);

  const { data: goals = [], isLoading } = useQuery<SavingsGoalModel[]>({
    queryKey: ['savings-goals', user?._id, lang],
    queryFn: () => savingsGoalsServices.fetchGoals(user._id, lang),
    enabled: !!user?._id,
    staleTime: 1000 * 60 * 5,
  });

  const addGoal = useMutation({
    mutationFn: (goal: Partial<SavingsGoalModel>) =>
      savingsGoalsServices.addGoal(user._id, goal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals', user._id] });
      messageApi.success(t('savingsGoals.messages.added'));
      onBack();
    },
    onError: (err) => messageApi.error(getError(err)),
  });

  const updateGoal = useMutation({
    mutationFn: (goal: Partial<SavingsGoalModel>) =>
      savingsGoalsServices.updateGoal(user._id, goal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals', user._id] });
      messageApi.success(t('savingsGoals.messages.updated'));
      onBack();
    },
    onError: (err) => messageApi.error(getError(err)),
  });

  const removeGoal = useMutation({
    mutationFn: (goal_id: string) => savingsGoalsServices.removeGoal(user._id, goal_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals', user._id] });
      messageApi.success(t('savingsGoals.messages.removed'));
    },
    onError: (err) => messageApi.error(getError(err)),
  });

  const onBack = () => {
    setStep(null);
    setSelected(null);
  };

  const onFinish = async (values: Partial<SavingsGoalModel>) => {
    if (step === Steps.Edit) {
      await updateGoal.mutateAsync(values);
    } else {
      await addGoal.mutateAsync(values);
    }
  };

  const isFormLoading = addGoal.isPending || updateGoal.isPending;

  if (step) {
    return (
      <Flex vertical gap={10} className="page-container savings-goals">
        {contextHolder}
        <Typography.Title level={2} className="page-title">
          {step === Steps.Edit ? t('savingsGoals.editTitle') : t('savingsGoals.addTitle')}
        </Typography.Title>
        <SavingsGoalForm
          goal={selected}
          isLoading={isFormLoading}
          onFinish={onFinish}
          onBack={onBack}
        />
      </Flex>
    );
  }

  return (
    <Flex vertical gap={16} className="page-container savings-goals">
      {contextHolder}

      <div className="page-shell">
        <div className="page-heading">
          <div className="page-heading-copy">
            <div className="page-kicker">{t('savingsGoals.kicker')}</div>
            <Typography.Title level={2} className="page-title" style={{ margin: 0 }}>
              {t('pages.savingsGoals')}
            </Typography.Title>
            <Typography.Text className="page-subtitle">{t('savingsGoals.subtitle')}</Typography.Text>
          </div>
          <div className="page-toolbar">
            <Button type="primary" onClick={() => setStep(Steps.New)}>
              {t('savingsGoals.buttons.add')}
            </Button>
          </div>
        </div>

        <div className="page-stat-grid">
          <div className="page-stat-card">
            <span className="page-stat-label">{t('savingsGoals.summary.activeGoals')}</span>
            <span className="page-stat-value">{goals.length}</span>
            <span className="page-stat-caption">{t('savingsGoals.summary.activeGoalsCaption')}</span>
          </div>
          <div className="page-stat-card">
            <span className="page-stat-label">{t('savingsGoals.summary.savedSoFar')}</span>
            <span className="page-stat-value">₪{asNumString(goals.reduce((sum, goal) => sum + goal.currentAmount, 0))}</span>
            <span className="page-stat-caption">{t('savingsGoals.summary.savedSoFarCaption')}</span>
          </div>
          <div className="page-stat-card">
            <span className="page-stat-label">{t('savingsGoals.summary.remaining')}</span>
            <span className="page-stat-value">
              ₪{asNumString(goals.reduce((sum, goal) => sum + Math.max(goal.targetAmount - goal.currentAmount, 0), 0))}
            </span>
            <span className="page-stat-caption">{t('savingsGoals.summary.remainingCaption')}</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Row gutter={[16, 16]}>
          {[1, 2, 3].map((i) => (
            <Col key={i} xs={24} sm={12} lg={8}>
              <Skeleton active className="savings-goal-card" />
            </Col>
          ))}
        </Row>
      ) : goals.length === 0 ? (
        <div className="page-card">
          <Empty description={t('savingsGoals.empty')}>
            <Button type="primary" onClick={() => setStep(Steps.New)}>
              {t('savingsGoals.buttons.add')}
            </Button>
          </Empty>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {goals.map((goal) => {
            const percent = goal.targetAmount > 0
              ? Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100)
              : 0;
            const isComplete = percent >= 100;
            const daysLeft = dayjs(goal.targetDate).diff(dayjs(), 'day');
            const isOverdue = daysLeft < 0 && !isComplete;

            return (
              <Col key={goal._id} xs={24} sm={12} lg={8}>
                <div className="savings-goal-card">
                  <Flex vertical gap={12}>
                    {/* Header */}
                    <Flex justify="space-between" align="flex-start">
                      <Typography.Title level={4} style={{ margin: 0 }} className="goal-name">
                        {goal.name}
                      </Typography.Title>
                      <Space>
                        <Typography.Link
                          onClick={() => { setSelected(goal); setStep(Steps.Edit); }}
                        >
                          {t('savingsGoals.buttons.edit')}
                        </Typography.Link>
                        <Popconfirm
                          title={t('savingsGoals.deleteConfirm')}
                          onConfirm={() => removeGoal.mutate(goal._id)}
                        >
                          <Typography.Link type="danger">
                            {t('savingsGoals.buttons.delete')}
                          </Typography.Link>
                        </Popconfirm>
                      </Space>
                    </Flex>

                    {/* Progress */}
                    <Progress
                      percent={percent}
                      status={isComplete ? 'success' : isOverdue ? 'exception' : 'active'}
                      strokeColor={isComplete ? undefined : 'var(--color-primary)'}
                    />

                    {/* Stats */}
                    <Flex justify="space-between">
                      <Flex vertical gap={2}>
                        <Typography.Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {t('savingsGoals.card.saved')}
                        </Typography.Text>
                        <Typography.Text strong style={{ fontSize: 16 }}>
                          ₪{asNumString(goal.currentAmount)}
                        </Typography.Text>
                      </Flex>
                      <Flex vertical gap={2} style={{ textAlign: 'end' }}>
                        <Typography.Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {t('savingsGoals.card.target')}
                        </Typography.Text>
                        <Typography.Text strong style={{ fontSize: 16 }}>
                          ₪{asNumString(goal.targetAmount)}
                        </Typography.Text>
                      </Flex>
                    </Flex>

                    <Flex justify="space-between">
                      <Flex vertical gap={2}>
                        <Typography.Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {t('savingsGoals.card.remaining')}
                        </Typography.Text>
                        <Typography.Text strong style={{ fontSize: 15 }}>
                          ₪{asNumString(Math.max(goal.targetAmount - goal.currentAmount, 0))}
                        </Typography.Text>
                      </Flex>
                      <Flex vertical gap={2} style={{ textAlign: 'end' }}>
                        <Typography.Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {t('savingsGoals.card.monthlyPace')}
                        </Typography.Text>
                        <Typography.Text strong style={{ fontSize: 15 }}>
                          ₪{asNumString(
                            isComplete
                              ? 0
                              : Math.max(goal.targetAmount - goal.currentAmount, 0) / Math.max(dayjs(goal.targetDate).diff(dayjs(), 'month', true), 1)
                          )}
                        </Typography.Text>
                      </Flex>
                    </Flex>

                    {/* Deadline */}
                    <Typography.Text type={isOverdue ? 'danger' : 'secondary'} style={{ fontSize: 12 }}>
                      {isComplete
                        ? t('savingsGoals.card.achieved')
                        : isOverdue
                          ? t('savingsGoals.card.overdue')
                          : `${daysLeft} ${t('savingsGoals.card.daysLeft')} · ${dayjs(goal.targetDate).format('MMM YYYY')}`
                      }
                    </Typography.Text>

                    {/* AI Insight */}
                    {goal.aiInsight && (
                      <div className="forecast-ai-insight">
                        <Typography.Paragraph style={{ margin: 0, fontSize: 13 }}>
                          {goal.aiInsight}
                        </Typography.Paragraph>
                      </div>
                    )}
                  </Flex>
                </div>
              </Col>
            );
          })}
        </Row>
      )}
    </Flex>
  );
};

export default SavingsGoalsPage;
