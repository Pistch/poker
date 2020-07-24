export const CARD_RANKS = [
  { name: 'two', symbol: '2', value: 2 },
  { name: 'three', symbol: '3', value: 3 },
  { name: 'four', symbol: '4', value: 4 },
  { name: 'five', symbol: '5', value: 5 },
  { name: 'six', symbol: '6', value: 6 },
  { name: 'seven', symbol: '7', value: 7 },
  { name: 'eight', symbol: '8', value: 8 },
  { name: 'nine', symbol: '9', value: 9 },
  { name: 'ten', symbol: '10', value: 10 },
  { name: 'jack', symbol: 'J', value: 11 },
  { name: 'queen', symbol: 'Q', value: 12 },
  { name: 'king', symbol: 'K', value: 13 },
  { name: 'ace', symbol: 'A', value: 14 }
];
export const CARD_SUITS = {
  hearts: {
    name: 'hearts',
    color: '#f00',
    symbol: '♥'
  },
  diamonds: {
    name: 'diamonds',
    color: '#f00',
    symbol: '♦'
  },
  clubs: {
    name: 'clubs',
    color: '#000',
    symbol: '♣'
  },
  spades: {
    name: 'spades',
    color: '#000',
    symbol: '♠'
  }
};
export const COMBINATION_NAMES = {
  ROYAL_FLUSH: 'ROYAL_FLUSH',
  STRAIGHT_FLUSH: 'STRAIGHT_FLUSH',
  FOUR_OF_A_KIND: 'FOUR_OF_A_KIND',
  FULL_HOUSE: 'FULL_HOUSE',
  FLUSH: 'FLUSH',
  STRAIGHT: 'STRAIGHT',
  SET: 'SET',
  TWO_PAIRS: 'TWO_PAIRS',
  PAIR: 'PAIR',
  KICKER: 'KICKER'
};
export const COMBINATIONS_RANKING = [
  COMBINATION_NAMES.ROYAL_FLUSH,
  COMBINATION_NAMES.STRAIGHT_FLUSH,
  COMBINATION_NAMES.FOUR_OF_A_KIND,
  COMBINATION_NAMES.FULL_HOUSE,
  COMBINATION_NAMES.FLUSH,
  COMBINATION_NAMES.STRAIGHT,
  COMBINATION_NAMES.SET,
  COMBINATION_NAMES.TWO_PAIRS,
  COMBINATION_NAMES.PAIR,
  COMBINATION_NAMES.KICKER
];
export const PLAYER_ACTIONS = {
  RAISE: 'raise',
  CALL: 'call',
  CHECK: 'check',
  FOLD: 'fold'
};

