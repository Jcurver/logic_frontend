import { SetStateAction } from 'react';
type Line = 10 | 15 | 20;
interface IBoard {
	line: Line;
}

interface IBoardNumbers {
	line: number;
  position: 'left' | 'top';
  boardArr:TouchState[][]
  setBoardArr:  React.Dispatch<React.SetStateAction<TouchState[][]>>;
}

type TouchState = 'newBlack' | 'oldBlack' | 'newX' | 'oldX' | 'white';
type TouchMode = 'black' | 'x' | 'removeBlack' | 'removeX';

interface ITouchableArea {
	boardArr: string[][];
	line: 10 | 15 | 20;
}

interface IBoardRightNumbersLine extends IBoardNumbers {
  nthLine: number;
}

export type {
	Line,
	IBoard,
	IBoardNumbers,
	TouchState,
	TouchMode,
	ITouchableArea,
	IBoardRightNumbersLine,
};
