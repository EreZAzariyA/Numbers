import { CreditCardFrameworkType, CreditCardType } from "./types";

export const calculateCreditCardsUsage = (creditCards: CreditCardType[]): number => {
  let used = 0;

  for (const card of creditCards) {
    used += card?.cardFrameworkUsed || 0;
  }

  return used;
};

export const getCreditCardsFramework = (creditCards: CreditCardType[]): CreditCardFrameworkType => {
  const cards: CreditCardFrameworkType = {};

  for (const card of creditCards) {
    if (card.cardStatusCode === 9) {
      continue;
    }
    cards[card.cardNumber] = {
      cardFramework: card.cardFramework,
      cardFrameworkUsed: card.cardFrameworkUsed,
    }
  }

  return cards;
};