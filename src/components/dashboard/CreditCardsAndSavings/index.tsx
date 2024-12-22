import React from "react";
import { useTranslation } from "react-i18next";
import { MainBanksAccount } from "../../../models/bank-model";
import { asNumString } from "../../../utils/helpers";
import { getAccountCreditCards, getCreditCardsFramework, getCreditCardsUsed } from "../../../utils/bank-utils";
import { Card, Divider, Flex, Typography } from "antd";
import { GoCreditCard } from "react-icons/go";
import "./CreditCardsAndSavings.css";

interface CreditCardsAndSavingsProps {
  currency: string;
  account: MainBanksAccount;
};

const { Text, Title } = Typography;

const CardBlock = (props: { title: string, icon: React.ReactNode, value: number, currency: string }) => (
  <Flex vertical>
    <Flex gap={5} align="center" wrap={false}>
      {props.icon}
      <Text>{props.title}</Text>
    </Flex>
    <Title level={4}>{props.currency} {asNumString(props.value)}</Title>
  </Flex>
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
    <Flex className="inner-card-container">
      <Card.Grid hoverable={false} className="box">
        <CardBlock title={t('dashboard.first.2')} icon={<GoCreditCard />} value={used} currency={props.currency} />
        <Divider className="custom-divider" />
        <CardBlock title={t('dashboard.first.4')} icon={<GoCreditCard />} value={totalSaves} currency={props.currency} />
      </Card.Grid>
      <Card.Grid hoverable={false} className="box">
        <CardBlock title={t('dashboard.first.5')} icon={<GoCreditCard />} value={totalLoans} currency={props.currency} />
        <Divider className="custom-divider" />
        <CardBlock title={t('dashboard.first.3')} icon={<GoCreditCard />} value={0} currency={props.currency} />
      </Card.Grid>
    </Flex>
  );
};