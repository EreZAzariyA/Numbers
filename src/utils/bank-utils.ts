import { BankAccountModel } from "../models/bank-model";
import { CardsPastOrFutureDebitType, CardStatusCode, CreditCardFrameworkType, CreditCardType } from "./types";

export const calculateCreditCardsUsage = (bank: CardsPastOrFutureDebitType): number => {
  let used = 0;
  used += bank?.accountFrameworkUsed || 0;

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
  const { cardsPastOrFutureDebit } = bank;
  const cards = cardsPastOrFutureDebit?.cardsBlock || [];
  const activeCards = [];

  for (let card of cards) {
    if (!card.cardStatusCode || card.cardStatusCode === CardStatusCode.Active) {
      activeCards.push(card);
    }
  }
  return activeCards;
};