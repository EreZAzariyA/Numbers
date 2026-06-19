import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { AiHealthStatus } from "../../../models/ai-settings";

interface AiHealthDotProps {
  status?: AiHealthStatus;
  error?: string;
}

const STATUS_COLORS: Record<AiHealthStatus, string> = {
  ok: "#52c41a",
  error: "#ff4d4f",
  unknown: "#bfbfbf",
};

const AiHealthDot = ({ status = "unknown", error }: AiHealthDotProps) => {
  const { t } = useTranslation();

  const tooltip = status === "error" && error
    ? error
    : t(`settings.aiHealth.${status}`);

  return (
    <Tooltip title={tooltip}>
      <span
        aria-label={tooltip}
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: STATUS_COLORS[status],
          flexShrink: 0,
        }}
      />
    </Tooltip>
  );
};

export default AiHealthDot;
