import { CreditCardType } from "./types";

export const calculateCreditCardsUsage = (creditCards: CreditCardType[]): number => {
  let used = 0;

  for (const card of creditCards) {
    used += card?.cardFrameworkUsed || 0;
  }

  return used;
};