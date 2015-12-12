'use strict';

const MersenneTwister = require('mersennetwister');

let rankFileToIndex = (rankIndex, fileIndex) => rankIndex * 15 + fileIndex + 17;

let generateZobristKeys = () => {
    let mt = new MersenneTwister(3141592654);
    let fortyEightBitFloat = number => Math.floor(mt.rndHiRes() * 0.75 * Math.pow(2, 48));
    let SQUARES = [];
    let EN_PASSANT = [];
    let CASTLING = []
    let TURN = fortyEightBitFloat();

    for (let rankIndex = 1; rankIndex <= 8; rankIndex++) {
        for (let fileIndex = 1; fileIndex <= 8; fileIndex++) {
            let index = rankFileToIndex(fileIndex, rankIndex);

            for (let turn = 0; turn < 2; turn++) {
                for (let piece = 0; piece < 6; piece++) {
                    if (!SQUARES[turn]) {
                        SQUARES[turn] = [];
                    }

                    if (!SQUARES[turn][index]) {
                        SQUARES[turn][index] = [];
                    }

                    SQUARES[turn][index][piece] = fortyEightBitFloat();
                }
            }

            EN_PASSANT[index] = fortyEightBitFloat();
        }
    }

    for (let castling = 0; castling < 4; castling++) {
        CASTLING.push(fortyEightBitFloat());
    }

    return {
        SQUARES,
        EN_PASSANT,
        CASTLING,
        TURN
    };
};

module.exports = generateZobristKeys();