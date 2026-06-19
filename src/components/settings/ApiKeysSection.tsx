import { useEffect, useMemo, useState } from "react";
import { App, Button, Card, Divider, Flex, Input, Select, Space, Switch, Tag, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useAiSettings } from "../../hooks/useAiSettings";
import { useAiHealth } from "../../hooks/useAiHealth";
import { useOllamaModels } from "../../hooks/useOllamaModels";
import AiHealthDot from "../components/ai-health-dot";
import { AiProvider } from "../../models/ai-settings";

const MANAGED_PROVIDERS: Extract<AiProvider, 'gemini' | 'claude'>[] = ['gemini', 'claude'];

const ApiKeysSection = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const {
    data,
    saveKey,
    clearKey,
    updateOllamaModel,
    updateOllamaThinking,
    isSavingKey,
    isClearingKey,
    isUpdatingOllamaModel,
    isUpdatingOllamaThinking,
  } = useAiSettings();
  const { health: aiHealth } = useAiHealth();
  const [drafts, setDrafts] = useState<Record<'gemini' | 'claude', string>>({
    gemini: '',
    claude: '',
  });

  const ollama = data?.providers.ollama;
  const { models: ollamaModels, isError: isOllamaModelsError } = useOllamaModels(!!ollama?.available);
  const [selectedOllamaModel, setSelectedOllamaModel] = useState<string | undefined>();

  useEffect(() => {
    setSelectedOllamaModel(ollama?.model ?? undefined);
  }, [ollama?.model]);

  const providerCards = useMemo(() => (
    MANAGED_PROVIDERS.map((provider) => {
      const providerState = data?.providers[provider];
      const hasUserKey = providerState?.source === 'user';
      const helperKey = providerState?.maskedKey
        ? 'settings.apiKeys.savedMask'
        : 'settings.apiKeys.missing';

      return (
        <Card
          key={provider}
          className="settings-provider-card"
          title={t(`settings.providers.${provider}`)}
          extra={
            <Space size={8} align="center">
              <AiHealthDot status={aiHealth?.[provider]?.status} error={aiHealth?.[provider]?.error} />
              <Tag color={providerState?.available ? 'teal' : 'default'}>
                {providerState?.available ? t('settings.apiKeys.available') : t('settings.apiKeys.notAvailable')}
              </Tag>
            </Space>
          }
        >
          <Flex vertical gap={14}>
            <Typography.Text className="settings-provider-meta">
              {t(helperKey, { masked: providerState?.maskedKey || '—' })}
            </Typography.Text>
            <Typography.Text type="secondary">
              {t('settings.apiKeys.modelLabel', { model: providerState?.model || '—' })}
            </Typography.Text>
            <Input.Password
              value={drafts[provider]}
              onChange={(event) => setDrafts((prev) => ({ ...prev, [provider]: event.target.value }))}
              placeholder={t('settings.apiKeys.inputPlaceholder', { provider: t(`settings.providers.${provider}`) })}
            />
            <Space wrap>
              <Button
                type="primary"
                onClick={async () => {
                  try {
                    await saveKey({ provider, apiKey: drafts[provider] });
                    setDrafts((prev) => ({ ...prev, [provider]: '' }));
                    message.success(t('settings.apiKeys.saveSuccess', { provider: t(`settings.providers.${provider}`) }));
                  } catch (err: any) {
                    message.error(err?.response?.data || err?.message || t('settings.apiKeys.saveError'));
                  }
                }}
                loading={isSavingKey}
                disabled={!drafts[provider].trim()}
              >
                {hasUserKey ? t('settings.apiKeys.replaceAction') : t('settings.apiKeys.saveAction')}
              </Button>
              <Button
                danger
                onClick={async () => {
                  try {
                    await clearKey(provider);
                    message.success(t('settings.apiKeys.clearSuccess', { provider: t(`settings.providers.${provider}`) }));
                  } catch (err: any) {
                    message.error(err?.response?.data || err?.message || t('settings.apiKeys.clearError'));
                  }
                }}
                loading={isClearingKey}
                disabled={!hasUserKey}
              >
                {t('settings.apiKeys.clearAction')}
              </Button>
            </Space>
          </Flex>
        </Card>
      );
    })
  ), [aiHealth, clearKey, data?.providers, drafts, isClearingKey, isSavingKey, message, saveKey, t]);

  const canSelectOllamaModel = !!ollama?.available && ollamaModels.length > 0;

  return (
    <Flex vertical gap={20}>
      <div className="page-panel">
        <div className="page-panel-header">
          <div>
            <div className="page-panel-title">{t('settings.apiKeys.title')}</div>
            <div className="page-panel-subtitle">{t('settings.apiKeys.subtitle')}</div>
          </div>
        </div>
        <div className="page-highlight">
          <div className="page-highlight-title">{t('settings.apiKeys.securityTitle')}</div>
          <div className="page-highlight-copy">{t('settings.apiKeys.securityCopy')}</div>
        </div>
      </div>

      <div className="settings-provider-grid">
        {providerCards}
        <Card
          className="settings-provider-card"
          title={t('settings.providers.ollama')}
          extra={
            <Space size={8} align="center">
              <AiHealthDot status={aiHealth?.ollama?.status} error={aiHealth?.ollama?.error} />
              <Tag color={ollama?.available ? 'teal' : 'default'}>{ollama?.available ? t('settings.apiKeys.available') : t('settings.apiKeys.notAvailable')}</Tag>
            </Space>
          }
        >
          <Flex vertical gap={14}>
            <Typography.Text className="settings-provider-meta">
              {ollama?.available ? t('settings.apiKeys.ollamaReady') : t('settings.apiKeys.ollamaMissing')}
            </Typography.Text>
            <Typography.Text type="secondary">
              {t('settings.apiKeys.modelLabel', { model: ollama?.model || '—' })}
            </Typography.Text>
            {canSelectOllamaModel ? (
              <>
                <Typography.Text type="secondary">{t('settings.apiKeys.ollamaModelSelectLabel')}</Typography.Text>
                <Select
                  showSearch
                  value={selectedOllamaModel}
                  onChange={(value) => setSelectedOllamaModel(value)}
                  options={ollamaModels.map((model) => ({ label: model, value: model }))}
                  placeholder={t('settings.apiKeys.ollamaSelectPlaceholder')}
                />
                <Space wrap>
                  <Button
                    type="primary"
                    onClick={async () => {
                      if (!selectedOllamaModel) return;
                      try {
                        await updateOllamaModel(selectedOllamaModel);
                        message.success(t('settings.apiKeys.ollamaModelSaveSuccess'));
                      } catch (err: any) {
                        message.error(err?.response?.data || err?.message || t('settings.apiKeys.ollamaModelSaveError'));
                      }
                    }}
                    loading={isUpdatingOllamaModel}
                    disabled={!selectedOllamaModel || selectedOllamaModel === ollama?.model}
                  >
                    {t('settings.apiKeys.ollamaModelSave')}
                  </Button>
                </Space>
              </>
            ) : (
              <Typography.Text type="secondary">
                {ollama?.available && isOllamaModelsError
                  ? t('settings.apiKeys.ollamaModelsLoadError')
                  : t('settings.apiKeys.ollamaHint')}
              </Typography.Text>
            )}

            {ollama?.available && (
              <>
                <Divider style={{ margin: '4px 0' }} />
                <Flex justify="space-between" align="center" gap={12}>
                  <Flex vertical gap={2} style={{ minWidth: 0 }}>
                    <Typography.Text strong>{t('settings.apiKeys.ollamaThinkingLabel')}</Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      {t('settings.apiKeys.ollamaThinkingHint')}
                    </Typography.Text>
                  </Flex>
                  <Switch
                    checked={data?.ollamaThinking ?? true}
                    loading={isUpdatingOllamaThinking}
                    onChange={async (checked) => {
                      try {
                        await updateOllamaThinking(checked);
                        message.success(t('settings.apiKeys.ollamaThinkingSaveSuccess'));
                      } catch (err: any) {
                        message.error(err?.response?.data || err?.message || t('settings.apiKeys.ollamaThinkingSaveError'));
                      }
                    }}
                  />
                </Flex>
              </>
            )}
          </Flex>
        </Card>
      </div>
    </Flex>
  );
};

export default ApiKeysSection;
