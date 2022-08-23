class GameState{

    constructor(pieces, turnColor){
        this.pieces = pieces;
        this.turnColor = turnColor;
    }

    //pieces
    addPiece = (piece) =>{
        this.pieces.push(piece)
    }

    addPieces = (pieces) =>{
        this.pieces.push(...pieces)
    }

    setPieces = (pieces) =>{
        this.pieces = pieces;
    }


    //turn
    setTurnColor = (pieceColor) => {
        this.turnColor = pieceColor;
    }
}

export default GameState;