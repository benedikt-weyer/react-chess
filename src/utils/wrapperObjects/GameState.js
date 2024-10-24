class GameState{

    constructor(pieces, turnColor){
        this.pieces = pieces;
        this.turnColor = turnColor;
    }

    //pieces
    addPiece = (piece) => {
        this.pieces.push(piece)
    }

    addPieces = (pieces) => {
        this.pieces.push(...pieces)
    }

    setPieces = (pieces) => {
        this.pieces = pieces;
    }

    getPieceAtTile = (boardX, boardY) => {
        return this.pieces.find(piece => piece.boardX === boardX && piece.boardY === boardY);
    }

    hasPieceAtTile = (boardX, boardY) => {
        return this.pieces.find(piece => piece.boardX === boardX && piece.boardY === boardY) !== undefined;
    }




    //turn
    setTurnColor = (pieceColor) => {
        this.turnColor = pieceColor;
    }
}

export default GameState;