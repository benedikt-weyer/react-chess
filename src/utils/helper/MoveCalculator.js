import PieceType from '../enums/PieceType'


const rowCount = 8;

//--position heper--
const isSquareEmpty = (gameState, boardX, boardY) => {
    return gameState.pieces.find(piece => piece.boardX === boardX && piece.boardY === boardY) === undefined;
}

const isSquareFriendly = (gameState, boardX, boardY, isWhite) => {
    return gameState.pieces.find(piece => piece.boardX === boardX && piece.boardY === boardY)?.isWhite === isWhite;
}

const isSquareOnBoard = (boardX, boardY) => {
    return boardX >= 0 && boardX <= rowCount-1 && boardY >= 0 && boardY <= rowCount-1;
}

/*const isKingInCheck = (gameState, isWhite) => {
    const kingToTestInCheck =  gameState.pieces.find(piece => piece.isWhite === isWhite && piece.type === PieceType.King);
    const attackingPieces = gameState.pieces.filter(piece => piece.isWhite === !isWhite);

    return attackingPieces.some(piece => {
        const pieceMoves = getLegalMoves(gameState, piece, false);

        return pieceMoves.some(move => move.newBoardX === kingToTestInCheck.boardX && move.newBoardY === kingToTestInCheck.boardY);
    });
}*/


const scanLineForLegalMoves = (gameState, piece, xIncrement, yIncrement) => {

    const legalMoves = [];

    let x = piece.boardX + xIncrement;
    let y = piece.boardY + yIncrement;

    while(isSquareOnBoard(x, y)){

        if(isSquareEmpty(gameState, x, y)){
            legalMoves.push({newBoardX: x, newBoardY: y})
        }else{
            if(!isSquareFriendly(gameState, x, y, piece.isWhite)){
                legalMoves.push({newBoardX: x, newBoardY: y})
            }
            break;
        }
        
        x += xIncrement;
        y += yIncrement;
    }

    return legalMoves;

}


class MoveCalculator{

    

    static getLegalMoves = (gameState, piece, withCheckCheck=true) => {
        //add pieces überall

        const legalMoves = [];

        if(piece.type === PieceType.Pawn){
            if(piece.isWhite){
                //if no at end of board
                if(piece.boardY < rowCount-1){                 

                    //move 2 forward
                    if(piece.boardY === 1){
                        if(isSquareEmpty(gameState, piece.boardX, piece.boardY+1) && isSquareEmpty(gameState, piece.boardX, piece.boardY+2)){
                            legalMoves.push({newBoardX: piece.boardX, newBoardY: piece.boardY + 2});
                        }
                    }

                    //move 1
                    //move forward
                    if(isSquareEmpty(gameState, piece.boardX, piece.boardY+1)){
                        legalMoves.push({newBoardX: piece.boardX, newBoardY: piece.boardY + 1});
                    }

                    if(piece.boardX - 1 > 0){
                        //capture left

                        if(!isSquareEmpty(gameState, piece.boardX - 1, piece.boardY + 1) && !isSquareFriendly(gameState, piece.boardX - 1, piece.boardY + 1, true)){
                            legalMoves.push({newBoardX: piece.boardX - 1, newBoardY: piece.boardY + 1});
                        }

                    }else if(piece.boardX + 1 <= rowCount-1){
                        //capture right

                        if(!isSquareEmpty(gameState, piece.boardX + 1, piece.boardY + 1) && !isSquareFriendly(gameState, piece.boardX + 1, piece.boardY + 1, true)){
                            legalMoves.push({newBoardX: piece.boardX + 1, newBoardY: piece.boardY + 1});
                        }
                    }

                }

            }else{
                //if no at end of board
                if(piece.boardY > 0){                 

                    //move 2 forward
                    if(piece.boardY === rowCount-1-1){
                        if(isSquareEmpty(gameState, piece.boardX, piece.boardY-1) && isSquareEmpty(gameState, piece.boardX, piece.boardY-2)){
                            legalMoves.push({newBoardX: piece.boardX, newBoardY: piece.boardY - 2});
                        }
                    }

                    //move 1
                    //move forward
                    if(isSquareEmpty(gameState, piece.boardX, piece.boardY-1)){
                        legalMoves.push({newBoardX: piece.boardX, newBoardY: piece.boardY - 1});
                    }

                    if(piece.boardX - 1 > 0){
                        //capture left

                        if(!isSquareEmpty(gameState, piece.boardX - 1, piece.boardY - 1) && !isSquareFriendly(gameState, piece.boardX - 1, piece.boardY - 1, false)){
                            legalMoves.push({newBoardX: piece.boardX - 1, newBoardY: piece.boardY - 1});
                        }

                    }else if(piece.boardX + 1 <= rowCount-1){
                        //capture right

                        if(!isSquareEmpty(gameState, piece.boardX + 1, piece.boardY - 1) && !isSquareFriendly(gameState, piece.boardX + 1, piece.boardY - 1, false)){
                            legalMoves.push({newBoardX: piece.boardX + 1, newBoardY: piece.boardY - 1});
                        }
                    }

                }
            }
        }else if(piece.type === PieceType.Knight){
            const theoritacalKnightMoves = [
                {newBoardX: piece.boardX - 1, newBoardY: piece.boardY + 2},
                {newBoardX: piece.boardX + 1, newBoardY: piece.boardY + 2},
                {newBoardX: piece.boardX + 2, newBoardY: piece.boardY + 1},
                {newBoardX: piece.boardX + 2, newBoardY: piece.boardY - 1},
                {newBoardX: piece.boardX + 1, newBoardY: piece.boardY - 2},
                {newBoardX: piece.boardX - 1, newBoardY: piece.boardY - 2},
                {newBoardX: piece.boardX - 2, newBoardY: piece.boardY - 1},
                {newBoardX: piece.boardX - 2, newBoardY: piece.boardY + 1},
            ];

            const possibleKnightMoves = theoritacalKnightMoves
                .filter(tkm => isSquareOnBoard(tkm.newBoardX, tkm.newBoardY))
                .filter(tkm => isSquareEmpty(gameState, tkm.newBoardX, tkm.newBoardY) || !isSquareFriendly(gameState, tkm.newBoardX, tkm.newBoardY, piece.isWhite));

            legalMoves.push(...possibleKnightMoves)


        }else if(piece.type === PieceType.Rook){

            legalMoves.push(...scanLineForLegalMoves(gameState, piece, 1, 0));
            legalMoves.push(...scanLineForLegalMoves(gameState, piece, -1, 0));
            legalMoves.push(...scanLineForLegalMoves(gameState, piece, 0, 1));
            legalMoves.push(...scanLineForLegalMoves(gameState, piece, 0, -1));

        }else if(piece.type === PieceType.Bishop){

            legalMoves.push(...scanLineForLegalMoves(gameState, piece, 1, 1));
            legalMoves.push(...scanLineForLegalMoves(gameState, piece, -1, 1));
            legalMoves.push(...scanLineForLegalMoves(gameState, piece, 1, -1));
            legalMoves.push(...scanLineForLegalMoves(gameState, piece, -1, -1));

        }else if(piece.type === PieceType.King){

            const theoritacalKingMoves = [
                {newBoardX: piece.boardX, newBoardY: piece.boardY + 1},
                {newBoardX: piece.boardX - 1, newBoardY: piece.boardY + 1},
                {newBoardX: piece.boardX - 1, newBoardY: piece.boardY},
                {newBoardX: piece.boardX - 1, newBoardY: piece.boardY - 1},
                {newBoardX: piece.boardX, newBoardY: piece.boardY - 1},
                {newBoardX: piece.boardX + 1, newBoardY: piece.boardY - 1},
                {newBoardX: piece.boardX + 1, newBoardY: piece.boardY},
                {newBoardX: piece.boardX + 1, newBoardY: piece.boardY + 1},
            ];

            const possibleKingMoves = theoritacalKingMoves
                .filter(tkm => isSquareOnBoard(tkm.newBoardX, tkm.newBoardY))
                .filter(tkm => isSquareEmpty(gameState, tkm.newBoardX, tkm.newBoardY) || !isSquareFriendly(gameState, tkm.newBoardX, tkm.newBoardY, piece.isWhite));

            legalMoves.push(...possibleKingMoves)

        }else if(piece.type === PieceType.Queen){

            legalMoves.push(...scanLineForLegalMoves(gameState, piece, 1, 0));
            legalMoves.push(...scanLineForLegalMoves(gameState, piece, -1, 0));
            legalMoves.push(...scanLineForLegalMoves(gameState, piece, 0, 1));
            legalMoves.push(...scanLineForLegalMoves(gameState, piece, 0, -1));

            legalMoves.push(...scanLineForLegalMoves(gameState, piece, 1, 1));
            legalMoves.push(...scanLineForLegalMoves(gameState, piece, -1, 1));
            legalMoves.push(...scanLineForLegalMoves(gameState, piece, 1, -1));
            legalMoves.push(...scanLineForLegalMoves(gameState, piece, -1, -1));

        }

        /*if(withCheckCheck){
            
            //filter legal moves where king is in check
            return legalMoves.filter(move => {

                const theoreticalBoardState = pieces.map(p => {return {...p}});

                const toMovePiece = theoreticalBoardState.find(p => p.boardX === piece.boardX && p.boardY === p.boardY);
                toMovePiece.boardX = move.newBoardX;
                toMovePiece.boardY = move.newBoardY;

                return !isKingInCheck(theoreticalBoardState, toMovePiece.isWhite);

            });
        }else{
            console.log(legalMoves)

            return legalMoves;
        }*/
        
        return legalMoves;
        
    };

}

export default MoveCalculator