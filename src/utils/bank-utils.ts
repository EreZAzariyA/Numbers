import { BankAccountModel } from "../models/bank-model";
import { CardStatusCode, CreditCardFrameworkType, CreditCardType } from "./types";

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
    const { cardNumber, cardFramework, cardFrameworkUsed } = card;
    if (card.cardStatusCode === CardStatusCode.Disable) {
      continue;
    }
    cards[cardNumber] = {
      cardFramework: cardFramework,
      cardFrameworkUsed: cardFrameworkUsed,
    }
  }

  return cards;
};

export const getBankCreditCards = (bank: BankAccountModel): CreditCardType[] => {
  const creditCards = bank?.creditCards || [];
  const activeCards = [];

  for (let card of creditCards) {
    if (card.cardStatusCode === CardStatusCode.Active) {
      activeCards.push(card);
    }
  }
  return activeCards;
};