import { IBoardRightNumbersLine, TouchState } from './interface';
import React, { useEffect, useState } from 'react';
import { MOCK_ANSWER_BOARD, MOCK_BOARD } from './mockBoard';
import { View, Text, StyleSheet } from 'react-native';
import {
	LeftLineFinish,
	TopLineFinish,
	TouchModeAtom,
} from '../../utils/Jotai';
import { useAtom, useAtomValue } from 'jotai';

const makeLineArr = (line: number, answerBoardLine: string[]) => {
	const arr = [];
	let number = 0;
	let beforeAddedBlack = false;
	for (let i = 0; i < line; i++) {
		if (answerBoardLine[i] !== 'oldBlack' && !beforeAddedBlack) {
			beforeAddedBlack = false;
		} else if (answerBoardLine[i] !== 'oldBlack' && beforeAddedBlack) {
			beforeAddedBlack = false;

			if (number > 0) {
				arr.push(number);
				number = 0;
			} else {
				continue;
			}
		} else if (answerBoardLine[i] === 'oldBlack') {
			number++;
			beforeAddedBlack = true;
		}
	}
	if (number > 0) {
		arr.push(number);
	}
	if (!arr.length) {
		arr.push(0);
	}
	return arr;
};

const getLineArr = (
	line: number,
	nthLine: number,
	position: 'left' | 'top',
	boardArr: TouchState[][]
) => {
	let arrLine: TouchState[] = [];
	if (position === 'left') {
		arrLine = boardArr[nthLine];
	}
	if (position === 'top') {
		for (let i = 0; i < line; i++) {
			arrLine.push(boardArr[i][nthLine]);
		}
	}
	return arrLine;
};

const lineString = (
	line: number,
	nthLine: number,
	position: 'left' | 'top',
	boardArr: TouchState[][],
	setBoardArr: React.Dispatch<React.SetStateAction<TouchState[][]>>
) => {
	const [leftLineFinishArr, setLeftLineFinishArr] = useAtom(LeftLineFinish);
	const [topLineFinishArr, setTopLineFinishArr] = useAtom(TopLineFinish);
	const touchMode = useAtomValue(TouchModeAtom);
	const answerBoardLine = getLineArr(
		line,
		nthLine,
		position,
		MOCK_ANSWER_BOARD
	);

	const answerArr = makeLineArr(line, answerBoardLine);

	if (touchMode === 'black') {
		const nowLine = getLineArr(line, nthLine, position, boardArr);
		const nowArr = makeLineArr(line, nowLine);

		// setIsArrSame(JSON.stringify(nowArr) === JSON.stringify(answerArr));
		let isArrSame = JSON.stringify(nowArr) === JSON.stringify(answerArr);
		if (position === 'top') {
			topLineFinishArr.splice(nthLine, 1, isArrSame);
			setTopLineFinishArr(topLineFinishArr);
		}
		if (position === 'left') {
			leftLineFinishArr.splice(nthLine, 1, isArrSame);
			setLeftLineFinishArr(leftLineFinishArr);
		}
		// for (let x = 0; x < line; x++) {
		// 	if (leftLineFinishArr[x]) {
		// 		for (let y = 0; y < line; y++) {
		// 			if (boardArr[x][y] === 'white') {
		// 				boardArr[x].splice(y, 1, 'oldX');
		// 				setBoardArr(boardArr.map((v) => [...v]));
		// 			}
		// 		}
		// 	}
		// }
		// for (let x = 0; x < line; x++) {
		// 	if (topLineFinishArr[x]) {
		// 		for (let y = 0; y < line; y++) {
		// 			if (boardArr[y][x] === 'white') {
		// 				boardArr[y].splice(x, 1, 'oldX');
		// 				setBoardArr(boardArr.map((v) => [...v]));
		// 			}
		// 		}
		// 	}
		// }
	}
	if (position === 'left') {
		return answerArr.join(' ');
	}
	if (position === 'top') {
		return answerArr.join('\n');
	}
};
const BoardLine = ({
	line,
	nthLine,
	position,
	boardArr,
	setBoardArr,
}: IBoardRightNumbersLine) => {
	const [leftLineFinishArr, setLeftLineFinishArr] = useAtom(LeftLineFinish);
	const [topLineFinishArr, setTopLineFinishArr] = useAtom(TopLineFinish);
	// const [isArrSame, setIsArrSame] = useState(false);

	const lineNumber = lineString(line, nthLine, position, boardArr,setBoardArr);

	return (
		<View
			style={[
				{
					width: '100%',
					height: '100%',
				},
				position === 'top'
					? {
							alignItems: 'center',
							justifyContent: 'flex-end',
							paddingBottom: 7,
							backgroundColor: topLineFinishArr[nthLine] ? 'gray' : '#cccccc',
					  }
					: {
							alignItems: 'flex-end',
							justifyContent: 'center',
							paddingRight: 7,
							backgroundColor: leftLineFinishArr[nthLine] ? 'gray' : '#cccccc',
					  },
			]}
		>
			{position === 'top' ? (
				<Text
					style={[
						line === 10 ? { fontSize: 14 } : { fontSize: 11 },
						topLineFinishArr[nthLine] ? { fontWeight: 'bold' } : null,
					]}
				>
					{lineNumber}
				</Text>
			) : null}
			{position === 'left' ? (
				<Text
					style={[
						line === 10 ? { fontSize: 14 } : { fontSize: 11 },
						leftLineFinishArr[nthLine] ? { fontWeight: 'bold' } : null,
					]}
				>
					{lineNumber}
				</Text>
			) : null}
		</View>
	);
};

export default BoardLine;
