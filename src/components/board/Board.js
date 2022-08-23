import React, { useState } from 'react'
import { Circle, Group, Image, Layer, Rect, Stage } from 'react-konva'
import useImage from 'use-image';

import pieceAtlasSrc from '../../assets/piece-atlas.png'
import PieceColor from '../../utils/enums/PieceColor';
import PieceType from '../../utils/enums/PieceType';
import MoveCalculator from '../../utils/helper/MoveCalculator'

const Board = ({ gameState, boardOrientation}) => {
    const boardSize = 800;
    const rowCount = 8;
    const pieceSize = boardSize / rowCount * 0.9;

    const darkColor = "#234";
    const lightColor = "#def";
    const legalMoveIndicatorColor = '#9ab'

    const [pieceAtlas] = useImage(pieceAtlasSrc);

    const [selectedSquare, setSelectedSquare] = useState();


    const getSpriteImageByPiece = (piece, size) => {

        let cropX;

        switch (piece.type) {
            case PieceType.King: cropX = 0; break;
            case PieceType.Queen: cropX = 1; break;
            case PieceType.Bishop: cropX = 2; break;
            case PieceType.Knight: cropX = 3; break;
            case PieceType.Rook: cropX = 4; break;
            case PieceType.Pawn: cropX = 5; break;
    
            default: cropX = -1; break;
        }

        const pieceWidth = pieceAtlas?.naturalWidth / 6;
        const pieceHeight = pieceAtlas?.naturalHeight / 2;

        return (
            <Image
                image={pieceAtlas} 
                x={0} 
                y={0} 
                height={size} 
                width={size} 
                crop={{x: cropX * pieceWidth, y: piece.isWhite ? 0 : pieceHeight, width: pieceWidth, height: pieceHeight}}
            />
        );
    }

    


    const handleSelectSquare = (boardX, boardY) => {

        setSelectedSquare(prevSelectedSquare => {
            if(prevSelectedSquare){
                if(prevSelectedSquare.boardX === boardX && prevSelectedSquare.boardY === boardY){
                    return undefined;
                }else{

                    /*const piece = gameState.pieces.find(piece => piece.boardX === prevSelectedSquare.boardX && piece.boardY === prevSelectedSquare.boardY);
                    if(piece){

                        const legalMoves = getLegalMoves(gameState, piece);

                        if(legalMoves.some(legalMove => legalMove.newBoardX === boardX && legalMove.newBoardY === boardY)){
                            //move piece
                            //piece.boardX = boardX;
                            //piece.boardY = boardY;
                            handlePieceMove(piece, boardX, boardY)

                            return undefined;
                        }
                    }*/
                }                
            }

            return {boardX: boardX, boardY: boardY}
        });

    }


    const renderBoard = (boardSize) => {
        //return null if gamestate is not set
        if(!gameState) return null;

        const rectsJSX = []
        const piecesJSX = []
        const moveIndicatorJSX = []

        //get legal moves
        let legalMoveIndicators = [];
        if(selectedSquare){
            legalMoveIndicators = MoveCalculator.getLegalMoves(gameState, selectedSquare.boardX, selectedSquare.boardY);
        }

        //iterate over board
        for(let y=0; y<rowCount; y++) {
            for(let x=0; x<rowCount; x++) {

                //rects
                rectsJSX.push(
                    <Rect
                        key={`rect-${x}-${y}`}
                        x={boardSize / rowCount * x}
                        y={boardSize / rowCount * y}
                        width={boardSize / rowCount}
                        height={boardSize / rowCount}
                        fill={(x+y) % 2 === (boardOrientation === PieceColor.WHITE ? 1 : 0) ? darkColor : lightColor}
                        onClick={() => { handleSelectSquare(x, y); }}
                    />
                );


                //pieces
                const currentPiece = gameState.pieces.find(piece => piece.boardX === x && piece.boardY === y);

                if(currentPiece){
                    const x = boardSize / rowCount * (boardOrientation === PieceColor.WHITE ? rowCount - 1 - currentPiece.boardX : currentPiece.boardX) + (boardSize / rowCount - pieceSize) / 2;
                    const y = boardSize / rowCount * (boardOrientation === PieceColor.WHITE ? rowCount - 1 - currentPiece.boardY : currentPiece.boardY) + (boardSize / rowCount - pieceSize) / 2;

                    piecesJSX.push(
                        <Group 
                            x={x} 
                            y={y} 
                            onClick={() => { handleSelectSquare(currentPiece.boardX, currentPiece.boardY); }}
                        >
                            { getSpriteImageByPiece(currentPiece, pieceSize) }
                        </Group>
                    );
                }


                //legal move indicators
                const isLegalMoveIndicatorPresent = legalMoveIndicators.some(legalMoveIndicator => legalMoveIndicator.newBoardX === x && legalMoveIndicator.newBoardY === y);

                if(isLegalMoveIndicatorPresent){
                    const radius = boardSize / rowCount / 2 / 4;
                    moveIndicatorJSX.push(
                        <Circle
                            key={`moveIndicator-${x}-${y}`}
                            x={boardSize / rowCount * ((boardOrientation === PieceColor.WHITE ? rowCount - 1 - x : x) + 0.5)}
                            y={boardSize / rowCount * ((boardOrientation === PieceColor.WHITE ? rowCount - 1 - y : y) + 0.5)}
                            radius={radius}

                            fill={legalMoveIndicatorColor}
                            onClick={() => { handleSelectSquare(x, y); }}
                        />
                    );
                }
            }
        }

        return (
            <Group>
                <Group>
                    { rectsJSX }
                </Group>
                <Group>
                    { piecesJSX }
                </Group>
                <Group>
                    { moveIndicatorJSX }
                </Group>

            </Group>
        );
    }

    return (
        <Stage className='cursor-pointer' width={boardSize} height={boardSize}>
            <Layer>
                { renderBoard(boardSize) }
            </Layer>
        </Stage>
    )
}

export default Board