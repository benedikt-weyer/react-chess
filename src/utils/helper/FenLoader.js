import React from 'react'
import GameState from '../wrapperObjects/GameState';
import Piece from '../wrapperObjects/Piece';
import PieceColor from '../enums/PieceColor';
import PieceType from '../enums/PieceType'

const fenPieceTypeMap = new Map();
fenPieceTypeMap.set('p', PieceType.Pawn);
fenPieceTypeMap.set('n', PieceType.Knight);
fenPieceTypeMap.set('b', PieceType.Bishop);
fenPieceTypeMap.set('r', PieceType.Rook);
fenPieceTypeMap.set('q', PieceType.Queen);
fenPieceTypeMap.set('k', PieceType.King);

const rowCount = 8;

class FenLoader{

    static getGameStateFromFenString = (fenString) => {
        //rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

        const positionString = fenString.split(' ')[0];
        const turnColorChar = fenString.split(' ')[1];
        const castleRightString = fenString.split(' ')[2];
        const turns1 = fenString.split(' ')[4];
        const turns2 = fenString.split(' ')[5];

        const pieces = [];

        //position 
        let pointer = 0;
        [...positionString].forEach(char => {
            
            if(char !== '/'){

                if(char >= '0' && char <= '9'){

                    pointer += char - '0';
                }else{

                    const pieceType = fenPieceTypeMap.get(char.toLowerCase());
                    const isWhite = char == char.toLowerCase();
    
                    const newPiece = new Piece(pointer % rowCount, Math.floor(pointer / rowCount), pieceType, isWhite);
                    pieces.push(newPiece)
                    //gameState.addPiece(newPiece);
    
                    pointer++;
                }
                
                
            }

        });


        const turnColor = turnColorChar === 'w' ? PieceColor.WHITE : PieceColor.BLACK

        const gameState = new GameState(pieces, turnColor);

        //TODO Castle, anpassant, turn-count

        return gameState;
    }
}

export default FenLoader