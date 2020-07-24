import { State } from '../lib/state';

export default class Player {
  constructor({
    name= '',
    money = 0
  }) {
    this.name = name;
    this.state = new State({
      cards: [],
      name,
      money
    });
  }

  dropCards() {
    this.state.cards = [];
  }

  takeCard(card) {
    if (this.state.cards.length > 1) {
      return;
    }

    this.state.cards = this.state.cards.concat(card);
  }

  get hand() {
    return this.state.cards;
  }
}
