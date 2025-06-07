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
    const selectColor = "#9ab";
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

    
    const handlePieceMove = (piece, newBoardX, newBoardY) => {
        //if there is a piece at the new location, capture it
        if(gameState.getPieceAtTile(newBoardX, newBoardY)){
            //capture enemy piece
            gameState.removePiece(gameState.getPieceAtTile(newBoardX, newBoardY));
        }
        

        //move piece
        piece.boardX = newBoardX;
        piece.boardY = newBoardY;

        
    }


    const handleSelectSquare = (boardX, boardY) => {

        setSelectedSquare(prevSelectedSquare => {
            
            if(prevSelectedSquare){
                if(prevSelectedSquare.boardX === boardX && prevSelectedSquare.boardY === boardY){
                    return undefined;
                }else{
                    console.log('select new')
                    const piece = gameState.pieces.find(piece => piece.boardX === prevSelectedSquare.boardX && piece.boardY === prevSelectedSquare.boardY);
                    if(piece){

                        const legalMoves = MoveCalculator.getLegalMoves(gameState, piece);

                        if(legalMoves.some(legalMove => legalMove.newBoardX === boardX && legalMove.newBoardY === boardY)){

                            //move piece
                            handlePieceMove(piece, boardX, boardY);

                            return undefined;
                        }
                    }
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
            if(gameState.hasPieceAtTile(selectedSquare.boardX, selectedSquare.boardY)){

                const selectedPiece = gameState.getPieceAtTile(selectedSquare.boardX, selectedSquare.boardY)

                legalMoveIndicators = MoveCalculator.getLegalMoves(gameState, selectedPiece);
            }
        }

        //iterate over board with screen coordinates
        for(let screenY=0; screenY<rowCount; screenY++) {
            for(let screenX=0; screenX<rowCount; screenX++) {

                const currentBoardX = boardOrientation === PieceColor.BLACK ? rowCount - 1 - screenX : screenX;
                const currentBoardY = boardOrientation === PieceColor.BLACK ? rowCount - 1 - screenY : screenY;

                //determine tile color
                let tileColor = (currentBoardX+currentBoardY) % 2 === 0 ? lightColor : darkColor;



                if(selectedSquare && selectedSquare.boardX === currentBoardX && selectedSquare.boardY === currentBoardY){
                    tileColor = selectColor;
                }

                //rects
                rectsJSX.push(
                    <Rect
                        key={`rect-${screenX}-${screenY}`}
                        x={boardSize / rowCount * screenX}
                        y={boardSize / rowCount * screenY}
                        width={boardSize / rowCount}
                        height={boardSize / rowCount}
                        fill={tileColor}
                        onClick={() => { handleSelectSquare(currentBoardX, currentBoardY); }}
                    />
                );


                //pieces
                const currentPiece = gameState.pieces.find(piece => piece.boardX === currentBoardX && piece.boardY === currentBoardY);

                if(currentPiece){
                    const xPixelPosition = boardSize / rowCount * screenX + (boardSize / rowCount - pieceSize) / 2;
                    const yPixelPosition = boardSize / rowCount * screenY + (boardSize / rowCount - pieceSize) / 2;

                    piecesJSX.push(
                        <Group 
                            key={`piece-${screenX}-${screenY}`}
                            x={xPixelPosition} 
                            y={yPixelPosition} 
                            onClick={() => { handleSelectSquare(currentBoardX, currentBoardY); }}
                        >
                            { getSpriteImageByPiece(currentPiece, pieceSize) }
                        </Group>
                    );
                }


                //legal move indicators
                const isLegalMoveIndicatorPresent = legalMoveIndicators.some(legalMoveIndicator => legalMoveIndicator.newBoardX === screenX && legalMoveIndicator.newBoardY === screenY);

                if(isLegalMoveIndicatorPresent){
                    const radius = boardSize / rowCount / 2 / 4;
                    moveIndicatorJSX.push(
                        <Circle
                            key={`moveIndicator-${screenX}-${screenY}`}
                            x={boardSize / rowCount * ((boardOrientation === PieceColor.WHITE ? rowCount - 1 - screenX : screenX) + 0.5)}
                            y={boardSize / rowCount * ((boardOrientation === PieceColor.WHITE ? rowCount - 1 - screenY : screenY) + 0.5)}
                            radius={radius}

                            fill={legalMoveIndicatorColor}
                            onClick={() => { handleSelectSquare(screenX, screenY); }}
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