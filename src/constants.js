export const CARD_TYPES = {
  two: { name: 'two', symbol: '2', value: 2 },
  three: { name: 'three', symbol: '3', value: 3 },
  four: { name: 'four', symbol: '4', value: 4 },
  five: { name: 'five', symbol: '5', value: 5 },
  six: { name: 'six', symbol: '6', value: 6 },
  seven: { name: 'seven', symbol: '7', value: 7 },
  eight: { name: 'eight', symbol: '8', value: 8 },
  nine: { name: 'nine', symbol: '9', value: 9 },
  ten: { name: 'ten', symbol: '10', value: 10 },
  jack: { name: 'jack', symbol: 'J', value: 11 },
  queen: { name: 'queen', symbol: 'Q', value: 12 },
  king: { name: 'king', symbol: 'K', value: 13 },
  ace: { name: 'ace', symbol: 'A', value: 14 }
};
export const CARD_TYPES_BY_VALUE = {
  2: CARD_TYPES.two,
  3: CARD_TYPES.three,
  4: CARD_TYPES.four,
  5: CARD_TYPES.five,
  6: CARD_TYPES.six,
  7: CARD_TYPES.seven,
  8: CARD_TYPES.eight,
  9: CARD_TYPES.nine,
  10: CARD_TYPES.ten,
  11: CARD_TYPES.jack,
  12: CARD_TYPES.queen,
  13: CARD_TYPES.king,
  14: CARD_TYPES.ace
};
export const CARD_RANKS = [
  CARD_TYPES.two,
  CARD_TYPES.three,
  CARD_TYPES.four,
  CARD_TYPES.five,
  CARD_TYPES.six,
  CARD_TYPES.seven,
  CARD_TYPES.eight,
  CARD_TYPES.nine,
  CARD_TYPES.ten,
  CARD_TYPES.jack,
  CARD_TYPES.queen,
  CARD_TYPES.king,
  CARD_TYPES.ace,
];
export const CARD_SUITS_NAMES = {
  HEARTS: 'hearts',
  DIAMONDS: 'diamonds',
  CLUBS: 'clubs',
  SPADES: 'spades',
};
export const CARD_SUITS = {
  [CARD_SUITS_NAMES.HEARTS]: {
    name: CARD_SUITS_NAMES.HEARTS,
    color: '#f00',
    symbol: '♥'
  },
  [CARD_SUITS_NAMES.DIAMONDS]: {
    name: CARD_SUITS_NAMES.DIAMONDS,
    color: '#f00',
    symbol: '♦'
  },
  [CARD_SUITS_NAMES.CLUBS]: {
    name: CARD_SUITS_NAMES.CLUBS,
    color: '#000',
    symbol: '♣'
  },
  [CARD_SUITS_NAMES.SPADES]: {
    name: CARD_SUITS_NAMES.SPADES,
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

