import React, { useEffect, useState } from 'react'
import Board from '../../components/board/Board';
import PieceColor from '../../utils/enums/PieceColor';
import FenLoader from '../../utils/helper/FenLoader';

const SinglePlayerGamePage = () => {

    const startPositionFenString = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    const [gameState, setGameState] = useState();

    useEffect(() => {
        const startGameState = FenLoader.getGameStateFromFenString(startPositionFenString);
        //set game state
        setGameState(startGameState);
    }, []);

    useEffect(() => {
        console.log('changed gs')
        console.log(gameState)
    }, [gameState]);

    /*const handlePieceMove = (piece, newBoardX, newBoardY) => {

        console.log('move piece');

        setGameState(oldGameState => {

        const newPieces = [...oldGameState.pieces]

        const movePiece = newPieces.find(newPiece => newPiece.boardX === piece.boardX && newPiece.boardY === piece.boardY);
        movePiece.boardX = newBoardX;
        movePiece.boardY = newBoardY;

        const newGameState = new GameState(newPieces, oldGameState.turnColor === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE);


        return newGameState;

        })

    }*/

    return (
        <div className="text-center text-3xl bg-secondary h-screen p-3">
            <h1 className='mb-3'>Single Player Chess</h1>
            
            <div className='flex justify-center'>
                <Board
                    gameState={gameState} 
                    boardOrientation={PieceColor.BLACK} 
                />
            </div>
        
        </div>
    );

}

export default SinglePlayerGamePage