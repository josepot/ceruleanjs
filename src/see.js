const constants = require('./constants');
const utils = require('./utils');

var PIECE_VALUES = [];
PIECE_VALUES[constants.PIECE_P] = 1;
PIECE_VALUES[constants.PIECE_N] = 3;
PIECE_VALUES[constants.PIECE_B] = 3;
PIECE_VALUES[constants.PIECE_R] = 5;
PIECE_VALUES[constants.PIECE_Q] = 9;
PIECE_VALUES[constants.PIECE_K] = 50;

var DELTA_BY_DIFFERENCE = [];

for (var diff = 1; diff <= 112; diff++) {
    var delta;

    if (diff < 8) {
        delta = 1;
    } else if (diff % 14 === 0) {
        delta = 14;
    } else if (diff % 15 === 0) {
        delta = 15;
    } else if (diff % 16 === 0) {
        delta = 16;
    }

    DELTA_BY_DIFFERENCE[diff] = delta;
}

var PIECE_BY_DELTA = [];
PIECE_BY_DELTA[1]  = constants.PIECE_R;
PIECE_BY_DELTA[14] = constants.PIECE_B;
PIECE_BY_DELTA[15] = constants.PIECE_R;
PIECE_BY_DELTA[16] = constants.PIECE_B;

// Static exchange evaluation
// Ideas in this file inspired by Mediocre's implementation of SEE
function staticExchangeEvaluation(board, move) {
    var captured = utils.moveCaptured(move);

    if (captured === 0) {
        return 0;
    }

    var to = utils.moveTo(move);
    var from = utils.moveFrom(move);
    var attackers = [[], []];
    var newMove, deltas, deltaPiece, j, k;

    // Pawns
    for (var turn = 0; turn < 2; turn++) {
        for (j = 0; j < 2; j++) {
            newMove = to + (14 + 2 * j) * (turn ? 1 : -1);
            if (board.board[newMove] &&
                newMove !== from &&
                board.board[newMove] % 2 === turn &&
                (board.board[newMove] & constants.JUST_PIECE) === constants.PIECE_P) {
                attackers[turn].push(newMove);
            }
        }
    }

    // Delta attacks
    for (k = 2; k < 4; k++) {
        deltas = constants.DELTA_MAP[k][0];
        deltaPiece = constants.DELTA_MAP[k][1];

        for (j = 0; j < 8; j++) {
            newMove = deltas[j] + to;
            if (board.board[newMove] &&
                newMove !== from &&
                (board.board[newMove] & constants.JUST_PIECE) === deltaPiece) {
                turn = board.board[newMove] % 2;
                attackers[turn].push(newMove);
            }
        }
    }

    // Sliding attacks
    for (k = 0; k < 2; k++) {
        deltas = constants.DELTA_MAP[k][0];
        deltaPiece = constants.DELTA_MAP[k][1];

        for (j = 0; j < 4; j++) {
            newMove = to + deltas[j];

            while (board.board[newMove] && board.board[newMove] === constants.PIECE_EMPTY) {
                newMove += deltas[j];
            }

            if (newMove !== from &&
                (board.board[newMove] & constants.JUST_PIECE) === deltaPiece ||
                (board.board[newMove] & constants.JUST_PIECE) === constants.PIECE_Q) {
                turn = board.board[newMove] % 2;
                attackers[turn].push(newMove);
            }
        }
    }

    var score = PIECE_VALUES[captured];
    var turnToMove = board.turn ^ 1;
    var turnDifferential = -1;
    var attackersCount = [0, 0];
    var lowestValue, lowestValueIndex;
    var swap;
    var attackerPieceIndex = from;
    var attackerPiece = board.board[attackerPieceIndex] & constants.JUST_PIECE;
    var attackerPieceValue = PIECE_VALUES[attackerPiece]

    while (attackers[turnToMove].length > attackersCount[turnToMove]) {
        score += turnDifferential * attackerPieceValue;

        // Determine delta to get to attackerPieceIndex (and TO)
        var hiddenDelta = DELTA_BY_DIFFERENCE[Math.abs(to - attackerPieceIndex)];

        if (hiddenDelta) {
            deltaPiece = PIECE_BY_DELTA[hiddenDelta];
            // Moving away from to/attackerPieceIndex
            hiddenDelta *= to < attackerPieceIndex ? 1 : -1;
            newMove = attackerPieceIndex + hiddenDelta;

            // Add sliding (hidden) pieces
            while (board.board[newMove] && board.board[newMove] === constants.PIECE_EMPTY) {
                newMove += hiddenDelta;
            }

            if ((board.board[newMove] & constants.JUST_PIECE) === deltaPiece ||
                (board.board[newMove] & constants.JUST_PIECE) === constants.PIECE_Q) {
                turn = board.board[newMove] % 2;
                attackers[turn].push(newMove);
            }
        }

        // Find new lowest
        lowestValue = PIECE_VALUES[board.board[attackers[turnToMove][attackersCount[turnToMove]]] & constants.JUST_PIECE];
        lowestValueIndex = attackersCount[turnToMove];
        for (j = attackersCount[turnToMove] + 1; j < attackers[turnToMove].length; j++) {
            if (PIECE_VALUES[board.board[attackers[turnToMove][j]] + 7] < lowestValue) {
                lowestValueIndex = j;
                lowestValue = PIECE_VALUES[board.board[attackers[turnToMove][j]] & constants.JUST_PIECE];
            }
        }

        // Swap
        if (lowestValueIndex !== attackersCount[turnToMove]) {
            swap = attackers[turnToMove][lowestValueIndex];
            attackers[turnToMove][lowestValueIndex] = attackers[turnToMove][attackersCount[turnToMove]];
            attackers[turnToMove][attackersCount[turnToMove]] = swap;
        }

        // New attacked value
        attackerPieceIndex = attackers[turnToMove][attackersCount[turnToMove]];
        attackerPiece = board.board[attackerPieceIndex] & constants.JUST_PIECE;
        attackerPieceValue = PIECE_VALUES[attackerPiece];
        attackersCount[turnToMove]++;

        // Increment turn values
        turnToMove ^= 1;
        turnDifferential *= -1;
    }

    return Math.max(score, 0);
}

module.exports = staticExchangeEvaluation;