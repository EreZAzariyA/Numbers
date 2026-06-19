import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import ChatPanel from ".";
import agentChatService from "../../services/agent-chat";

const mockSocketListeners = new Map<string, (data: any) => void>();

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, string>) => (
      options?.time ? `${key} ${options.time}` : key
    ),
  }),
}));

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("remark-gfm", () => jest.fn());

jest.mock("../../services/agent-chat", () => ({
  __esModule: true,
  default: {
    sendMessage: jest.fn(),
    getHistory: jest.fn(),
    clearHistory: jest.fn(),
    confirmAction: jest.fn(),
    cancelAction: jest.fn(),
  },
  isDeadActionStatus: (status?: number) => status === 404 || status === 409,
  parseAgentActionError: (error: any) => ({
    status: error?.response?.status,
    serverMessage: typeof error?.response?.data === "string" ? error.response.data : undefined,
  }),
}));

jest.mock("../../redux/store", () => ({
  useAppSelector: (selector: (state: any) => any) => selector({
    config: { language: { lang: "en" } },
  }),
}));

jest.mock("../../utils/helpers", () => ({
  useResize: () => ({
    isMobile: false,
  }),
}));

jest.mock("../../services/socket", () => ({
  __esModule: true,
  default: {
    on: (event: string, callback: (data: any) => void) => {
      mockSocketListeners.set(event, callback);
      return () => mockSocketListeners.delete(event);
    },
  },
}));

const mockedAgentChatService = agentChatService as jest.Mocked<typeof agentChatService>;

describe("ChatPanel", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  beforeEach(() => {
    mockedAgentChatService.getHistory.mockResolvedValue({
      messages: [],
      pendingAction: null,
    } as any);
    mockedAgentChatService.sendMessage.mockResolvedValue({
      reply: "Here is your answer.",
      pendingAction: null,
    } as any);
    mockedAgentChatService.clearHistory.mockResolvedValue(undefined);
    mockedAgentChatService.confirmAction.mockResolvedValue({
      reply: "Created the category **Travel**.",
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    mockSocketListeners.clear();
  });

  it("loads history and renders the refined empty state", async () => {
    render(<ChatPanel />);

    fireEvent.click(screen.getByLabelText("chat.title"));

    await waitFor(() => {
      expect(mockedAgentChatService.getHistory).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByText("chat.emptyTitle")).toBeInTheDocument();
    expect(screen.getByText("chat.emptyBody")).toBeInTheDocument();
    expect(screen.queryByLabelText("chat.clearHistory")).not.toBeInTheDocument();
  });

  it("loads a pending action and confirms it from the drawer", async () => {
    mockedAgentChatService.getHistory.mockResolvedValue({
      messages: [],
      pendingAction: {
        id: "action-1",
        tool: "create_category",
        summary: "Create category Travel.",
        argsPreview: { name: "Travel" },
        expiresAt: "2030-01-01T00:00:00.000Z",
      },
    } as any);

    render(<ChatPanel />);

    fireEvent.click(screen.getByLabelText("chat.title"));

    expect(await screen.findByText("chat.pendingAction.title")).toBeInTheDocument();
    expect(screen.getByText("Create category Travel.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "chat.pendingAction.confirm" }));

    await waitFor(() => {
      expect(mockedAgentChatService.confirmAction).toHaveBeenCalledWith("action-1", "en");
    });

    expect(await screen.findByText(/Created the category/)).toBeInTheDocument();
    expect(screen.queryByText("chat.pendingAction.title")).not.toBeInTheDocument();
  });

  it("disables confirm for an expired action and dismisses it locally", async () => {
    mockedAgentChatService.getHistory.mockResolvedValue({
      messages: [],
      pendingAction: {
        id: "action-expired",
        tool: "create_category",
        summary: "Create category Travel.",
        argsPreview: { name: "Travel" },
        expiresAt: "2000-01-01T00:00:00.000Z",
      },
    } as any);

    render(<ChatPanel />);
    fireEvent.click(screen.getByLabelText("chat.title"));

    expect(await screen.findByText("chat.pendingAction.expiredNotice")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "chat.pendingAction.confirm" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "chat.pendingAction.dismiss" }));

    expect(mockedAgentChatService.confirmAction).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByText("chat.pendingAction.title")).not.toBeInTheDocument();
    });
  });

  it("surfaces the server message and clears the action when confirm is rejected", async () => {
    mockedAgentChatService.getHistory.mockResolvedValue({
      messages: [],
      pendingAction: {
        id: "action-1",
        tool: "create_category",
        summary: "Create category Travel.",
        argsPreview: { name: "Travel" },
        expiresAt: "2030-01-01T00:00:00.000Z",
      },
    } as any);
    mockedAgentChatService.confirmAction.mockRejectedValue({
      response: { status: 409, data: "That action has expired. Please ask again." },
    });

    render(<ChatPanel />);
    fireEvent.click(screen.getByLabelText("chat.title"));

    fireEvent.click(await screen.findByRole("button", { name: "chat.pendingAction.confirm" }));

    expect(await screen.findByText("That action has expired. Please ask again.")).toBeInTheDocument();
    expect(screen.queryByText("chat.pendingAction.title")).not.toBeInTheDocument();
  });

  it("sends on Enter and preserves Shift+Enter for multiline input", async () => {
    render(<ChatPanel />);

    fireEvent.click(screen.getByLabelText("chat.title"));
    expect(await screen.findByText("chat.emptyTitle")).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText("chat.placeholder");

    fireEvent.change(textarea, { target: { value: "Plan my budget" } });
    fireEvent.keyDown(textarea, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(mockedAgentChatService.sendMessage).toHaveBeenCalledWith("Plan my budget", "en", expect.any(String));
    });
    expect(await screen.findByText("Here is your answer.")).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: "Line one" } });
    fireEvent.keyDown(textarea, { key: "Enter", code: "Enter", shiftKey: true });

    expect(mockedAgentChatService.sendMessage).toHaveBeenCalledTimes(1);
  });

  it("shows clear history only when a message exists", async () => {
    mockedAgentChatService.getHistory.mockResolvedValue({
      messages: [{ role: "assistant", content: "History available" }],
      pendingAction: null,
    } as any);

    render(<ChatPanel />);

    fireEvent.click(screen.getByLabelText("chat.title"));

    expect(await screen.findByText("History available")).toBeInTheDocument();
    expect(screen.getByLabelText("chat.clearHistory")).toBeInTheDocument();
  });

  it("renders live assistant progress for the active request", async () => {
    let resolveSend: ((value: any) => void) | undefined;
    mockedAgentChatService.sendMessage.mockImplementation(() => new Promise((resolve) => {
      resolveSend = resolve;
    }) as any);

    render(<ChatPanel />);

    fireEvent.click(screen.getByLabelText("chat.title"));
    expect(await screen.findByText("chat.emptyTitle")).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText("chat.placeholder");
    fireEvent.change(textarea, { target: { value: "What changed?" } });
    fireEvent.keyDown(textarea, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(mockedAgentChatService.sendMessage).toHaveBeenCalledTimes(1);
    });

    const requestId = mockedAgentChatService.sendMessage.mock.calls[0][2] as string;
    act(() => {
      mockSocketListeners.get("agent:progress")?.({
        requestId,
        step: "loading-finance-context",
        label: "Loading your finance context",
        status: "active",
        at: new Date().toISOString(),
      });
    });

    expect(await screen.findByText("Loading your finance context")).toBeInTheDocument();

    resolveSend?.({ reply: "Finished response.", pendingAction: null });

    expect(await screen.findByText("Finished response.")).toBeInTheDocument();
  });

  it("does not repeat generic startup progress steps in the detail list", async () => {
    let resolveSend: ((value: any) => void) | undefined;
    mockedAgentChatService.sendMessage.mockImplementation(() => new Promise((resolve) => {
      resolveSend = resolve;
    }) as any);

    render(<ChatPanel />);

    fireEvent.click(screen.getByLabelText("chat.title"));
    expect(await screen.findByText("chat.emptyTitle")).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText("chat.placeholder");
    fireEvent.change(textarea, { target: { value: "What changed?" } });
    fireEvent.keyDown(textarea, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(mockedAgentChatService.sendMessage).toHaveBeenCalledTimes(1);
    });

    const requestId = mockedAgentChatService.sendMessage.mock.calls[0][2] as string;
    act(() => {
      mockSocketListeners.get("agent:progress")?.({
        requestId,
        step: "reviewing-request",
        label: "Reviewing your request",
        status: "active",
        at: "2030-01-01T00:00:00.000Z",
      });
      mockSocketListeners.get("agent:progress")?.({
        requestId,
        step: "loading-finance-context",
        label: "Loading your finance context",
        status: "active",
        at: "2030-01-01T00:00:01.000Z",
      });
    });

    expect(await screen.findByText("Loading your finance context")).toBeInTheDocument();
    expect(screen.queryByText("Reviewing your request")).not.toBeInTheDocument();
    expect(screen.getAllByText("Loading your finance context")).toHaveLength(1);

    resolveSend?.({ reply: "Finished response.", pendingAction: null });
    expect(await screen.findByText("Finished response.")).toBeInTheDocument();
  });
});
