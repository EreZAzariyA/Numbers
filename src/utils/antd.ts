import { MenuProps, theme, ThemeConfig } from "antd";
import { ThemeColorType } from "./types";
import { ThemeColors } from "./enums";

export type MenuItem = Required<MenuProps>['items'][number];
export const getMenuItem = (
  label: React.ReactNode,
  key: React.Key | null,
  icon: React.ReactNode,
  children?: MenuItem[],
  style?: React.CSSProperties,
  type?: 'group',
  value?: string,
): MenuItem  => {
  return {
    key,
    icon,
    children,
    style,
    label,
    type,
    value,
  } as MenuItem;
};

export interface CategoryDataType {
  _id: string;
  name: string;
  editable: boolean;
};

export interface InvoiceDataType {
  _id: string;
  date: Date;
  category: string;
  description: string
  amount: number;
  editable: boolean;
};

export const getThemeConfig = (currTheme: ThemeColorType): ThemeConfig => {
  const isDarkTheme = currTheme === ThemeColors.DARK;
  const algorithm = isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm;

  return {
    algorithm,
    token: {
      colorPrimary: '#0D9488',
      colorPrimaryHover: '#14B8A6',
      colorPrimaryActive: '#0F766E',
      colorBgContainer: isDarkTheme ? '#1a2235' : '#ffffff',
      colorBgElevated: isDarkTheme ? '#1e2a40' : '#ffffff',
      colorBgLayout: isDarkTheme ? '#111827' : '#f0f4f8',
      colorBorder: isDarkTheme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
      colorBorderSecondary: isDarkTheme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      colorText: isDarkTheme ? '#e2e8f0' : '#1a202c',
      colorTextSecondary: isDarkTheme ? '#94a3b8' : '#64748b',
      colorTextTertiary: isDarkTheme ? '#64748b' : '#94a3b8',
      fontFamily: '"Inter", "IBM Plex Sans", "Noto Sans Hebrew", system-ui, sans-serif',
      fontFamilyCode: '"JetBrains Mono", "Fira Code", monospace',
      fontSizeHeading1: 32,
      fontSizeHeading2: 24,
      fontSizeHeading3: 18,
      fontSizeHeading4: 15,
      fontWeightStrong: 600,
      fontSize: 14,
      fontSizeSM: 12,
      borderRadius: 10,
      borderRadiusLG: 14,
      borderRadiusSM: 6,
      boxShadow: isDarkTheme
        ? '0 4px 16px rgba(0,0,0,0.4)'
        : '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
      boxShadowSecondary: isDarkTheme
        ? '0 2px 8px rgba(0,0,0,0.3)'
        : '0 1px 3px rgba(0,0,0,0.05)',
      motionDurationMid: '0.2s',
      motionDurationSlow: '0.3s',
    },
    components: {
      Layout: {
        headerBg: isDarkTheme ? '#0d1526' : '#ffffff',
        siderBg: isDarkTheme ? '#0d1526' : '#ffffff',
        headerPadding: 0,
        headerHeight: 64,
        bodyBg: isDarkTheme ? '#111827' : '#f0f4f8',
      },
      Menu: {
        itemBg: 'transparent',
        subMenuItemBg: 'transparent',
        itemSelectedBg: isDarkTheme ? 'rgba(13,148,136,0.15)' : 'rgba(13,148,136,0.08)',
        itemSelectedColor: isDarkTheme ? '#14B8A6' : '#0D9488',
        itemHoverBg: isDarkTheme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
        itemHoverColor: isDarkTheme ? '#e2e8f0' : '#1a202c',
        itemColor: isDarkTheme ? '#94a3b8' : '#64748b',
        iconSize: 16,
        itemHeight: 44,
        itemMarginInline: 8,
        itemBorderRadius: 8,
        activeBarBorderWidth: 0,
        activeBarWidth: 3,
      },
      Typography: {
        titleMarginBottom: 0,
        titleMarginTop: 0,
      },
      Card: {
        headerFontSize: 15,
        borderRadiusLG: 14,
        paddingLG: 20,
        boxShadowTertiary: isDarkTheme
          ? '0 1px 2px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2)'
          : '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
      },
      Table: {
        headerBg: isDarkTheme ? '#162032' : '#f8fafc',
        headerColor: isDarkTheme ? '#94a3b8' : '#64748b',
        rowHoverBg: isDarkTheme ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
        borderColor: isDarkTheme ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        cellPaddingBlock: 12,
        cellPaddingInline: 16,
        headerSortActiveBg: isDarkTheme ? '#1a2a3a' : '#f1f5f9',
      },
      Button: {
        borderRadius: 8,
        controlHeight: 36,
        fontWeight: 500,
        primaryShadow: 'none',
        defaultShadow: 'none',
      },
      Input: {
        borderRadius: 8,
        controlHeight: 36,
        paddingInline: 12,
      },
      Select: {
        borderRadius: 8,
        controlHeight: 36,
      },
      DatePicker: {
        borderRadius: 8,
        controlHeight: 36,
      },
      Divider: {
        marginLG: 0,
        margin: 0,
      },
    }
  }
}