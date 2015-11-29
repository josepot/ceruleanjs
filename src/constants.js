'use strict';

/*
 * Constant generators
 */
function fileDistance() {

}

function squareDistance() {

}

function knightIncrement() {

}

function queenIncrement() {

}

/*
 * Constants
 */
const WHITE = 0;
const BLACK = 1;
const WIDTH = 15;
const HEIGHT = 12;
const FEN_BOARD_REGEX = /^\s*([rnbqkpRNBQKP1-8]+\/){7}([rnbqkpRNBQKP1-8]+)\s[bw]\s(-|K?Q?k?q?)\s(-|[a-h‌​][36])/;
const FILE_DISTANCE = fileDistance();
const SQUARE_DISTANCE = squareDistance();
const QUEEN_INCREMENT = queenIncrement();
const KNIGHT_INCREMENT = knightIncrement();
const JUST_PIECE = 126; // 1111110
const JUST_TURN = 1;
const PIECE_MAP = {
    'p': 2,
    'n': 4,
    'b': 8,
    'r': 16,
    'q': 32,
    'k': 64,
    'empty': 128
};

const INVERSE_PIECE_MAP = {
    2: 'p',
    4: 'n',
    8: 'b',
    16: 'r',
    32: 'q',
    64: 'k'
};

const PIECE_DISPLAY_MAP = [
    {
        2: '♙',
        4: '♘',
        8: '♗',
        16: '♖',
        32: '♕',
        64: '♔'
    },
    {
        2: '♟',
        4: '♞',
        8: '♝',
        16: '♜',
        32: '♛',
        64: '♚'
    }
];

const CASTLING = {
    K: 0,
    Q: 1,
    k: 2,
    q: 3
};

const INVERSE_CASTLING = [
    'K',
    'Q',
    'k',
    'q'
];

const DELTA_KNIGHT = [
    -31,
    -29,
    -17,
    -13,
    13,
    17,
    29,
    31
];

const DELTA_KING = [
    -16,
    -15,
    -14,
    -1,
    1,
    14,
    15,
    16
];

const DELTA_BISHOP = [
    -16,
    -14,
    14,
    16
];

const DELTA_ROOK = [
    -15,
    -1,
    1,
    15
];

module.exports = {
    WHITE,
    BLACK,
    WIDTH,
    HEIGHT,
    FEN_BOARD_REGEX,
    FILE_DISTANCE,
    SQUARE_DISTANCE,
    QUEEN_INCREMENT,
    KNIGHT_INCREMENT,
    PIECE_MAP,
    JUST_PIECE,
    JUST_TURN,
    INVERSE_PIECE_MAP,
    PIECE_DISPLAY_MAP,
    CASTLING,
    INVERSE_CASTLING,
    DELTA_KNIGHT,
    DELTA_KING,
    DELTA_BISHOP,
    DELTA_ROOK
};