import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Steps, Progress, Typography, Result, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import socketService from "../../../services/socket";
import { BankAccountModel } from "../../../models/bank-model";
import { TransactionsAccountResponse } from "../../../utils/types";

interface ScrapingProgressModalProps {
  jobId: string | null;
  bankName?: string;
  onImport?: (data: { bank: BankAccountModel; account: TransactionsAccountResponse }, reportProgress: (count: number) => void) => Promise<void>;
  onComplete: (data: { bank: BankAccountModel; account: TransactionsAccountResponse }) => void;
  onFailed: (error: string) => void;
  onClose: () => void;
}

type ScrapingStage = 'scraping' | 'processing' | 'saving' | 'complete' | 'failed';

const STAGE_TO_STEP: Record<ScrapingStage, number> = {
  scraping: 0,
  processing: 1,
  saving: 2,
  complete: 2,
  failed: 0,
};

const STAGE_TO_PERCENT: Record<ScrapingStage, number> = {
  scraping: 20,
  processing: 60,
  saving: 85,
  complete: 100,
  failed: 0,
};

const ScrapingProgressModal = ({ jobId, bankName, onImport, onComplete, onFailed, onClose }: ScrapingProgressModalProps) => {
  const { t } = useTranslation();
  const [stage, setStage] = useState<ScrapingStage>('scraping');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const completedRef = useRef(false);
  const completedDataRef = useRef<{ bank: BankAccountModel; account: TransactionsAccountResponse } | null>(null);
  const onImportRef = useRef(onImport);
  const onFailedRef = useRef(onFailed);

  useEffect(() => {
    onImportRef.current = onImport;
  }, [onImport]);

  useEffect(() => {
    onFailedRef.current = onFailed;
  }, [onFailed]);

  useEffect(() => {
    if (!jobId) return;

    completedRef.current = false;
    completedDataRef.current = null;
    setStage('scraping');
    setErrorMessage(null);
    setImportedCount(null);

    const unsubProgress = socketService.on('scraping:progress', (data) => {
      if (data.jobId !== jobId) return;
      setStage(data.stage as ScrapingStage);
      if (data.importedCount !== undefined) {
        setImportedCount(data.importedCount);
      }
    });

    const unsubComplete = socketService.on('scraping:complete', async (data) => {
      if (data.jobId !== jobId) return;
      if (completedRef.current) return;
      completedRef.current = true;
      completedDataRef.current = { bank: data.bank, account: data.account };

      if (onImportRef.current) {
        // Connect bank path: reportProgress updates count live per batch
        const reportProgress = (count: number) => setImportedCount(count);
        try {
          await onImportRef.current({ bank: data.bank, account: data.account }, reportProgress);
        } catch {
          // import failure is non-fatal — still show Done
        }
      } else {
        // Refresh path: use final count from backend
        if (data.importedTransactions !== undefined) {
          setImportedCount(data.importedTransactions);
        }
      }

      setStage('complete');
    });

    const unsubFailed = socketService.on('scraping:failed', (data) => {
      if (data.jobId !== jobId) return;
      if (completedRef.current) return;
      completedRef.current = true;
      setStage('failed');
      const msg = data.error || t('scraping.failedTitle');
      setErrorMessage(msg);
      onFailedRef.current(msg);
    });

    return () => {
      unsubProgress();
      unsubComplete();
      unsubFailed();
    };
  }, [jobId, t]);

  const currentStep = STAGE_TO_STEP[stage];
  const percent = STAGE_TO_PERCENT[stage];
  const isFailed = stage === 'failed';
  const isDone = stage === 'complete';

  const stepStatus = (stepIndex: number) => {
    if (isFailed && stepIndex === currentStep) return 'error';
    if (stepIndex < currentStep) return 'finish';
    if (stepIndex === currentStep) return isDone ? 'finish' : 'process';
    return 'wait';
  };

  const handleDone = () => {
    if (completedDataRef.current) {
      onComplete(completedDataRef.current);
    }
    onClose();
  };

  const progressStatus = isFailed ? 'exception' : isDone ? 'success' : 'active';

  const savingDescription = importedCount !== null && importedCount > 0
    ? t('scraping.steps.savingProgress', { count: importedCount })
    : t('scraping.steps.savingDesc');

  return (
    <Modal
      open={!!jobId}
      footer={isDone || isFailed ? (
        <Button type="primary" onClick={isFailed ? onClose : handleDone}>
          {isFailed ? t('scraping.close') : t('scraping.done')}
        </Button>
      ) : null}
      closable={isDone || isFailed}
      onCancel={isFailed ? onClose : handleDone}
      maskClosable={false}
      title={t('scraping.title', { bankName: bankName || t('scraping.bank') })}
      width={460}
    >
      {isFailed ? (
        <Result
          status="error"
          title={t('scraping.failedTitle')}
          subTitle={errorMessage}
        />
      ) : isDone ? (
        <Result
          status="success"
          title={t('scraping.successTitle')}
          subTitle={importedCount !== null
            ? t('scraping.transactionsImported', { count: importedCount })
            : undefined}
        />
      ) : (
        <>
          <Steps
            direction="vertical"
            size="small"
            style={{ marginBottom: 24 }}
            items={[
              {
                title: t('scraping.steps.scraping'),
                description: t('scraping.steps.scrapingDesc'),
                status: stepStatus(0),
                icon: currentStep === 0 && !isFailed ? <LoadingOutlined /> : undefined,
              },
              {
                title: t('scraping.steps.processing'),
                description: t('scraping.steps.processingDesc'),
                status: stepStatus(1),
                icon: currentStep === 1 ? <LoadingOutlined /> : undefined,
              },
              {
                title: t('scraping.steps.saving'),
                description: savingDescription,
                status: stepStatus(2),
                icon: currentStep === 2 && !isDone ? <LoadingOutlined /> : undefined,
              },
            ]}
          />
          <Progress percent={percent} status={progressStatus} />
          <Typography.Text type="secondary" style={{ display: 'block', marginTop: 8, textAlign: 'center' }}>
            {t('scraping.pending')}
          </Typography.Text>
        </>
      )}
    </Modal>
  );
};

export default ScrapingProgressModal;
