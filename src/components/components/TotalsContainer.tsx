import { useAppSelector } from "../../redux/store";
import transactionsServices, { TransactionsResp } from "../../services/transactions";
import { TotalAmountInput } from "./TotalAmount";
import { TotalAmountType } from "../../utils/enums";
import { Flex, Grid } from "antd";
import { queryFiltering } from "../../utils/helpers";
import { TransactionsType, TransType } from "../../utils/transactions";
import { useQuery } from "@tanstack/react-query";

export const TotalsContainer = (props: { filterState: {}, type: TransType }) => {
  const screen = Grid.useBreakpoint();
  const isCardTransactions = props.type === TransactionsType.CARD_TRANSACTIONS;
  const query = queryFiltering(props.filterState);

  const user = useAppSelector((state) => state.auth.user);
  const { data, isSuccess } = useQuery<TransactionsResp>({
    queryKey: ['transactions', user?._id, props.filterState],
    queryFn: () => transactionsServices.fetchTransactions(user?._id, query, props.type),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return (
    <Flex align="center" justify="flex-end" gap={10} wrap={screen.xs}>
      <TotalAmountInput transactions={isSuccess ? data.transactions : []} type={TotalAmountType.SPENT} style={{ width: 100 }} />
      {!isCardTransactions && (
        <TotalAmountInput transactions={isSuccess ? data.transactions : []} type={TotalAmountType.INCOME} style={{ width: 100 }} />
      )}
    </Flex>
  );
};