export default class Piece {

    constructor(boardX, boardY, type, isWhite, apPossible = false){
        this.boardX = boardX;
        this.boardY = boardY;
        this.type = type;
        this.isWhite = isWhite;

        this.apPossible = apPossible;
    }
    
}