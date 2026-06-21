import axios from "axios";
import config from "../utils/config";

type InsightFinding = {
  severity: 'info' | 'warning' | 'critical';
  title: string;
  body: string;
  meta?: Record<string, unknown>;
};

export type DigestResponse = {
  aiSummary: string | null;
  findings: InsightFinding[];
  generatedAt: string | null;
};

class AgentInsightsService {
  getDigest = async (user_id: string): Promise<DigestResponse> => {
    const response = await axios.get<DigestResponse>(
      `${config.urls.agentInsightsDigest}${user_id}/digest`
    );
    return response.data;
  };

  triggerAnalysis = async (user_id: string): Promise<{ ok: boolean }> => {
    const response = await axios.post<{ ok: boolean }>(
      `${config.urls.agentInsightsTrigger}${user_id}/trigger`,
      {}
    );
    return response.data;
  };
}

const agentInsightsService = new AgentInsightsService();
export default agentInsightsService;
