import { useTranslation } from "react-i18next";
import { MainBanksAccount } from "../../../models/bank-model";
import { asNumString } from "../../../utils/helpers";
import { getAccountCreditCards, getCreditCardsFramework, getCreditCardsUsed } from "../../../utils/bank-utils";
import "./CreditCardsAndSavings.css";

interface CreditCardsAndSavingsProps {
  currency: string;
  account: MainBanksAccount;
};

const StatItem = (props: { label: string, value: number, currency: string }) => (
  <div className="stat-grid-item">
    <span className="stat-grid-label">{props.label}</span>
    <span className="stat-grid-value">{props.currency} {asNumString(props.value)}</span>
  </div>
);

export const CreditCardsAndSavings = (props: CreditCardsAndSavingsProps) => {
  const { t } = useTranslation();
  const cards = getAccountCreditCards(props.account);
  const cardsFramework = getCreditCardsFramework(cards);

  const used = getCreditCardsUsed(cardsFramework);
  const mainAccount = props.account?.banks.find((b) => b.isMainAccount) ?? props.account?.banks?.[0];
  const totalSaves = mainAccount?.savings?.totalDepositsCurrentValue || 0;
  const totalLoans = mainAccount?.loans?.summary?.totalBalance || 0;

  return (
    <div className="stat-grid">
      <StatItem label={t('dashboard.first.2')} value={used} currency={props.currency} />
      <StatItem label={t('dashboard.first.5')} value={totalLoans} currency={props.currency} />
      <StatItem label={t('dashboard.first.4')} value={totalSaves} currency={props.currency} />
      <StatItem label={t('dashboard.first.3')} value={0} currency={props.currency} />
    </div>
  );
};