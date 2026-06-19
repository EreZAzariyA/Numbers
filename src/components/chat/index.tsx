import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button, Input, Spin, Tooltip } from "antd";
import { CloseOutlined, DeleteOutlined, StopOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { RiRobot2Line } from "react-icons/ri";
import { IoSendSharp } from "react-icons/io5";
import { useAppSelector } from "../../redux/store";
import { Languages } from "../../utils/enums";
import { useResize } from "../../utils/helpers";
import socketService from "../../services/socket";
import agentChatService, {
  AgentProgressEvent,
  ChatMessage,
  PendingAgentAction,
  isDeadActionStatus,
  parseAgentActionError,
} from "../../services/agent-chat";
import "./chat.css";

type LiveProgressItem = AgentProgressEvent & { id: string };

// Browsers fire a setTimeout immediately when the delay exceeds a signed 32-bit
// int (~24.8 days). Real actions expire within minutes, so we only schedule the
// expiry flip when it lands inside this window; anything further off is treated
// as "not expiring during this session".
const MAX_TIMEOUT_MS = 2147483647;
const HIDDEN_PROGRESS_DETAIL_STEPS = new Set([
  "reviewing-request",
  "loading-finance-context",
]);

const ChatPanel: React.FC = () => {
  const { t } = useTranslation();
  const { lang } = useAppSelector((state) => state.config.language);
  const { isMobile } = useResize();
  const isHebrew = lang === Languages.HE;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAgentAction | null>(null);
  const [pendingExpired, setPendingExpired] = useState(false);
  const [actionLoading, setActionLoading] = useState<"confirm" | "cancel" | null>(null);
  const [liveProgress, setLiveProgress] = useState<LiveProgressItem[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<any>(null);
  const activeRequestIdRef = useRef<string | null>(null);
  const sendStartRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading, messages, open, pendingAction]);

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => {
      composerRef.current?.focus?.();
    }, 180);

    return () => window.clearTimeout(timer);
  }, [open]);

  // Flip the pending action to an expired state the moment its TTL elapses, so the
  // Confirm button is disabled before the user can fire a request the server rejects.
  useEffect(() => {
    if (!pendingAction) {
      setPendingExpired(false);
      return;
    }

    const remainingMs = new Date(pendingAction.expiresAt).getTime() - Date.now();
    if (remainingMs <= 0) {
      setPendingExpired(true);
      return;
    }

    setPendingExpired(false);
    if (remainingMs > MAX_TIMEOUT_MS) return;

    const timer = window.setTimeout(() => setPendingExpired(true), remainingMs);
    return () => window.clearTimeout(timer);
  }, [pendingAction]);

  useEffect(() => {
    if (!loading) {
      setElapsed(0);
      return;
    }
    const interval = window.setInterval(() => {
      if (sendStartRef.current !== null) {
        setElapsed(Math.floor((Date.now() - sendStartRef.current) / 1000));
      }
    }, 1000);
    return () => window.clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const unsubscribe = socketService.on("agent:progress", (event: AgentProgressEvent) => {
      if (!event?.requestId || event.requestId !== activeRequestIdRef.current) return;

      setLiveProgress((prev) => {
        const lastItem = prev[prev.length - 1];
        if (lastItem && lastItem.step === event.step && lastItem.status === event.status && lastItem.label === event.label) {
          return prev;
        }

        return [
          ...prev,
          {
            ...event,
            id: `${event.step}-${event.at}`,
          },
        ];
      });
    });

    return unsubscribe;
  }, []);

  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const history = await agentChatService.getHistory();
      setMessages(history.messages);
      setPendingAction(history.pendingAction ?? null);
    } catch {
      // If history fails to load, keep the panel usable and start fresh.
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const handleOpen = () => {
    setOpen(true);
    if (!loading) {
      loadHistory();
    }
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const now = new Date().toISOString();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setMessages((prev) => [...prev, { role: "user", content: text, sentAt: now }]);
    setInput("");
    setLoading(true);
    setLiveProgress([]);
    sendStartRef.current = Date.now();
    activeRequestIdRef.current = requestId;

    try {
      const { reply, pendingAction: nextPendingAction } = await agentChatService.sendMessage(text, lang, requestId, controller.signal);
      const responseTime = sendStartRef.current !== null ? Date.now() - sendStartRef.current : undefined;
      setMessages((prev) => [...prev, { role: "assistant", content: reply, sentAt: new Date().toISOString(), responseTime }]);
      setPendingAction(nextPendingAction ?? null);
    } catch (error) {
      if (!axios.isCancel(error)) {
        const responseTime = sendStartRef.current !== null ? Date.now() - sendStartRef.current : undefined;
        setMessages((prev) => [...prev, { role: "assistant", content: t("chat.error"), sentAt: new Date().toISOString(), responseTime }]);
      }
    } finally {
      abortControllerRef.current = null;
      sendStartRef.current = null;
      activeRequestIdRef.current = null;
      setLiveProgress([]);
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await agentChatService.clearHistory();
      setMessages([]);
      setPendingAction(null);
    } catch {
      // Silently ignore — UI already reflects the cleared state locally.
    }
  };

  // A dead action (expired/cancelled/already handled, or not found) can't be retried,
  // so surface the backend's localized explanation and clear it from the panel.
  // Anything else is a transient failure the user can retry against the same action.
  const handleActionError = (error: unknown) => {
    const { status, serverMessage } = parseAgentActionError(error);
    if (isDeadActionStatus(status)) {
      setPendingAction(null);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: serverMessage ?? t("chat.pendingAction.expired") },
      ]);
      return;
    }
    setMessages((prev) => [...prev, { role: "assistant", content: t("chat.error") }]);
  };

  const handleConfirmAction = async () => {
    if (!pendingAction || actionLoading || pendingExpired) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setActionLoading("confirm");
    sendStartRef.current = Date.now();
    setLoading(true);
    try {
      const { reply } = await agentChatService.confirmAction(pendingAction.id, lang, controller.signal);
      const responseTime = sendStartRef.current !== null ? Date.now() - sendStartRef.current : undefined;
      setMessages((prev) => [...prev, { role: "assistant", content: reply, sentAt: new Date().toISOString(), responseTime }]);
      setPendingAction(null);
    } catch (error) {
      if (!axios.isCancel(error)) handleActionError(error);
    } finally {
      abortControllerRef.current = null;
      sendStartRef.current = null;
      setLoading(false);
      setActionLoading(null);
    }
  };

  const handleCancelAction = async () => {
    if (!pendingAction || actionLoading) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setActionLoading("cancel");
    sendStartRef.current = Date.now();
    setLoading(true);
    try {
      const { reply } = await agentChatService.cancelAction(pendingAction.id, lang, controller.signal);
      const responseTime = sendStartRef.current !== null ? Date.now() - sendStartRef.current : undefined;
      setMessages((prev) => [...prev, { role: "assistant", content: reply, sentAt: new Date().toISOString(), responseTime }]);
      setPendingAction(null);
    } catch (error) {
      if (!axios.isCancel(error)) handleActionError(error);
    } finally {
      abortControllerRef.current = null;
      sendStartRef.current = null;
      setLoading(false);
      setActionLoading(null);
    }
  };

  // Once expired, the server would only reject confirm/cancel — dismiss it locally.
  const handleDismissExpired = () => {
    setPendingAction(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessageTime = (sentAt: string): string => {
    const date = new Date(sentAt);
    const isToday = date.toDateString() === new Date().toDateString();
    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (isToday) return time;
    return `${date.toLocaleDateString([], { month: "short", day: "numeric" })} ${time}`;
  };

  const formatResponseTime = (ms: number): string =>
    ms < 10000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms / 1000)}s`;

  const formatArgsPreviewValue = (value: unknown): string => {
    if (Array.isArray(value)) return value.map((item) => formatArgsPreviewValue(item)).join(", ");
    if (value && typeof value === "object") return JSON.stringify(value);
    if (value === null || value === undefined || value === "") return "—";
    return String(value);
  };

  const pendingActionEntries = Object.entries(pendingAction?.argsPreview ?? {}).filter(([, value]) => (
    value !== undefined && value !== null && value !== ""
  ));
  const launcherClassName = [
    "chat-panel__launcher",
    isHebrew ? "chat-panel__launcher--rtl" : "",
  ].filter(Boolean).join(" ");
  const panelShellClassName = [
    "chat-panel-shell",
    open ? "chat-panel-shell--open" : "",
    isMobile ? "finance-chat-drawer--mobile" : "",
    isHebrew ? "chat-panel-shell--rtl" : "",
  ].filter(Boolean).join(" ");
  const panelClassName = [
    "chat-panel",
    isHebrew ? "chat-panel--rtl" : "",
  ].filter(Boolean).join(" ");
  const currentProgressLabel = liveProgress[liveProgress.length - 1]?.label ?? t("chat.loadingReply");
  const progressDetails = liveProgress.filter((item) => !HIDDEN_PROGRESS_DETAIL_STEPS.has(item.step));

  return (
    <>
      <div className={launcherClassName}>
        <button
          type="button"
          className="chat-panel__launcher-button"
          onClick={handleOpen}
          aria-label={t("chat.title")}
        >
          <span className="chat-panel__launcher-ripple" aria-hidden="true" />
          <RiRobot2Line size={24} />
        </button>
      </div>

      {open && (
        <section
          className={panelShellClassName}
          role="dialog"
          aria-label={t("chat.title")}
          aria-modal="false"
        >
          <div className={panelClassName}>
            <header className="chat-panel__header">
              <div className="chat-panel__identity">
                <div className="chat-panel__brand">
                  <div className="chat-panel__brand-icon" aria-hidden="true">
                    <RiRobot2Line size={20} />
                  </div>
                  <div className="chat-panel__brand-copy">
                    <div className="chat-panel__eyebrow">{t("chat.status")}</div>
                    <h2 className="chat-panel__title">{t("chat.title")}</h2>
                  </div>
                </div>
                <div className="chat-panel__header-actions">
                  {messages.length > 0 && (
                    <Tooltip title={t("chat.clearHistory")}>
                      <Button
                        type="text"
                        size="small"
                        className="chat-panel__icon-button"
                        icon={<DeleteOutlined />}
                        onClick={handleClearHistory}
                        aria-label={t("chat.clearHistory")}
                      />
                    </Tooltip>
                  )}
                  <Button
                    type="text"
                    size="small"
                    className="chat-panel__icon-button"
                    icon={<CloseOutlined />}
                    onClick={() => setOpen(false)}
                    aria-label={t("common.buttons.cancel")}
                  />
                </div>
              </div>
            </header>

          <div className="chat-panel__body">
            <div className="chat-panel__scroll">
              {loadingHistory ? (
                <div className="chat-panel__loading-state" role="status">
                  <Spin size="small" />
                  <span>{t("chat.loadingHistory")}</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="chat-panel__empty-state">
                  <div className="chat-panel__empty-icon" aria-hidden="true">
                    <RiRobot2Line size={26} />
                  </div>
                  <h3 className="chat-panel__empty-title">{t("chat.emptyTitle")}</h3>
                  <p className="chat-panel__empty-copy">{t("chat.emptyBody")}</p>
                </div>
              ) : (
                <div className="chat-panel__messages">
                  {messages.map((msg, index) => {
                    const messageClassName = [
                      "chat-message",
                      `chat-message--${msg.role}`,
                    ].join(" ");

                    return (
                      <article key={`${msg.role}-${index}`} className={messageClassName}>
                        <div className="chat-message__bubble">
                          {msg.role === "user" ? (
                            <span>{msg.content}</span>
                          ) : (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ children }) => <p className="chat-markdown__paragraph">{children}</p>,
                                strong: ({ children }) => <strong className="chat-markdown__strong">{children}</strong>,
                                ul: ({ children }) => <ul className="chat-markdown__list">{children}</ul>,
                                ol: ({ children }) => <ol className="chat-markdown__list">{children}</ol>,
                                li: ({ children }) => <li className="chat-markdown__list-item">{children}</li>,
                                table: ({ children }) => (
                                  <div className="chat-markdown__table-wrap">
                                    <table className="chat-markdown__table">{children}</table>
                                  </div>
                                ),
                                thead: ({ children }) => <thead className="chat-markdown__head">{children}</thead>,
                                tr: ({ children }) => <tr className="chat-markdown__row">{children}</tr>,
                                th: ({ children }) => <th className="chat-markdown__heading">{children}</th>,
                                td: ({ children }) => <td className="chat-markdown__cell">{children}</td>,
                                code: ({ children }) => <code className="chat-markdown__code">{children}</code>,
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          )}
                        </div>
                        {msg.sentAt && (
                          <div className="chat-message__meta">
                            <span className="chat-message__timestamp">{formatMessageTime(msg.sentAt)}</span>
                            {msg.role === "assistant" && msg.responseTime !== undefined && (
                              <span className="chat-message__response-time">{formatResponseTime(msg.responseTime)}</span>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}

              {pendingAction && (
                <section className="chat-pending-action">
                  <div className="chat-pending-action__eyebrow">{t("chat.pendingAction.title")}</div>
                  <div className="chat-pending-action__summary">{pendingAction.summary}</div>

                  {pendingActionEntries.length > 0 && (
                    <dl className="chat-pending-action__details">
                      {pendingActionEntries.map(([key, value]) => (
                        <div key={key} className="chat-pending-action__detail-row">
                          <dt className="chat-pending-action__detail-label">{key}</dt>
                          <dd className="chat-pending-action__detail-value">{formatArgsPreviewValue(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  <div className="chat-pending-action__expires">
                    {pendingExpired
                      ? t("chat.pendingAction.expiredNotice")
                      : t("chat.pendingAction.expires", {
                          time: new Date(pendingAction.expiresAt).toLocaleString(),
                        })}
                  </div>

                  <div className="chat-pending-action__actions">
                    {pendingExpired ? (
                      <Button size="small" onClick={handleDismissExpired}>
                        {t("chat.pendingAction.dismiss")}
                      </Button>
                    ) : (
                      <>
                        <Button
                          type="primary"
                          size="small"
                          loading={actionLoading === "confirm"}
                          onClick={handleConfirmAction}
                          disabled={actionLoading === "cancel"}
                        >
                          {t("chat.pendingAction.confirm")}
                        </Button>
                        <Button
                          size="small"
                          onClick={handleCancelAction}
                          loading={actionLoading === "cancel"}
                          disabled={actionLoading === "confirm"}
                        >
                          {t("chat.pendingAction.cancel")}
                        </Button>
                      </>
                    )}
                  </div>
                </section>
              )}

              {loading && (
                <div className="chat-panel__live-progress" role="status" aria-live="polite">
                  <div className="chat-panel__live-progress-current">
                    <Spin size="small" />
                    <span>{currentProgressLabel}</span>
                    {elapsed > 0 && (
                      <span className="chat-panel__elapsed">{elapsed}s</span>
                    )}
                  </div>
                  {progressDetails.length > 1 && (
                    <div className="chat-panel__live-progress-list">
                      {progressDetails.map((item) => (
                        <div key={item.id} className="chat-panel__live-progress-item">
                          <span className="chat-panel__live-progress-dot" aria-hidden="true" />
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <footer className="chat-panel__composer">
            <div className="chat-panel__composer-shell">
              <Input.TextArea
                ref={composerRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("chat.placeholder")}
                autoSize={{ minRows: 1, maxRows: 4 }}
                disabled={loading}
                className="chat-panel__textarea"
              />
              {loading ? (
                <Tooltip title={t("chat.stop")}>
                  <Button
                    type="primary"
                    icon={<StopOutlined />}
                    onClick={handleStop}
                    className="chat-panel__send chat-panel__send--stop"
                    aria-label={t("chat.stop")}
                  />
                </Tooltip>
              ) : (
                <Button
                  type="primary"
                  icon={<IoSendSharp />}
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="chat-panel__send"
                  aria-label={t("chat.send")}
                />
              )}
            </div>
          </footer>
          </div>
        </section>
      )}
    </>
  );
};

export default ChatPanel;
