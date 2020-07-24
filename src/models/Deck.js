import { State, getContainer } from '../lib/state';
import { CARD_RANKS, CARD_SUITS } from '../constants';

function getDeck() {
  const suitNames = Object.keys(CARD_SUITS);
  const cards = [];

  suitNames.forEach(suitName => {
    CARD_RANKS.forEach(rankInfo => {
      cards.push({
        suit: CARD_SUITS[suitName],
        rank: rankInfo
      });
    });
  });

  return cards;
}

function getShuffledDeck() {
  return getDeck().sort(() => Math.random() - 0.5);
}

export default class Deck {
  constructor() {
    this.state = new State({
      cards: [],
    });
    this.ContainerComponent = getContainer(this.state);
    this.fill();
  }

  get cards() {
    return this.state.cards;
  }

  fill = () => this.state.cards = getShuffledDeck();

  drawCard = () => {
    return this.drawFewCards(1)[0];
  }

  drawFewCards = requiredCardsQuantity => {
    if (requiredCardsQuantity > this.cards.length) {
      console.warn('not enough cards in a deck');

      return [];
    }

    const cardsToGive = this.cards.slice(0, requiredCardsQuantity);

    this.state.cards = this.cards.slice(requiredCardsQuantity);

    return cardsToGive;
  }
}
