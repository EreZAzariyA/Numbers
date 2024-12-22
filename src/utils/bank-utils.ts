import { BankAccountModel, MainBanksAccount } from "../models/bank-model";
import { asNumber, isArrayAndNotEmpty } from "./helpers";
import { CardsPastOrFutureDebitType, CardStatusCode, CreditCardFrameworkType, CreditCardType } from "./types";

export const calculateCreditCardsUsage = (bank: CardsPastOrFutureDebitType): number => {
  let used = 0;
  used += bank?.accountFrameworkUsed || 0;

  return used;
};

export const getCreditCardsFramework = (creditCards: CreditCardType[]): CreditCardFrameworkType => {
  const cards: CreditCardFrameworkType = {};

  for (const card of creditCards) {
    const { cardNumber, cardFramework = 0, cardFrameworkUsed = 0, cardFrameworkNotUsed = 0 } = card;
    if (card.cardStatusCode && card.cardStatusCode === CardStatusCode.Disable) {
      continue;
    }

    if (!cards[cardNumber]) {
      cards[cardNumber] = {
        cardFramework: 0,
        cardFrameworkUsed: 0,
      };
    }

    cards[cardNumber].cardFramework += cardFramework;
    cards[cardNumber].cardFrameworkUsed += cardFrameworkUsed || asNumber(cardFramework - cardFrameworkNotUsed, 2);
  }

  return cards;
};

export const getCreditCardsUsed = (cardsFramework: CreditCardFrameworkType): number => {
  let used = 0;
  Object.entries(cardsFramework).forEach(([cardNumber, cardsFramework]) => {
    used += cardsFramework.cardFrameworkUsed || 0;
  });

  return used;
}

export const getAccountCreditCards = (mainAccount: MainBanksAccount): CreditCardType[] => {
  const banks = mainAccount?.banks;
  if (!isArrayAndNotEmpty(banks)) {
    return [];
  }

  const creditCards: CreditCardType[] = [];
  for (const bank of banks) {
    const cards = getBankCreditCards(bank);
    if (isArrayAndNotEmpty(cards)) {
      cards.forEach((card) => {
        creditCards.push(card);
      });
    }
  }

  return creditCards;
}

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