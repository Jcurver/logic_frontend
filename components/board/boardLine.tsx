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

const BoardLine = ({
	line,
	nthLine,
	position,
	boardArr,
}: IBoardRightNumbersLine) => {
	const [leftLineFinishArr, setLeftLineFinishArr] = useAtom(LeftLineFinish);
	const [topLineFinishArr, setTopLineFinishArr] = useAtom(TopLineFinish);
	// const [isArrSame, setIsArrSame] = useState(false);

	const lineString = (
		line: number,
		nthLine: number,
		position: 'left' | 'top',
		boardArr: TouchState[][]
	) => {
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
				setTopLineFinishArr((a) => {
					a.splice(nthLine, 1, isArrSame);

					return a;
				});
			}
			if (position === 'left') {
				leftLineFinishArr.splice(nthLine, 1, isArrSame);
				setLeftLineFinishArr(leftLineFinishArr);
			}
		}
		if (position === 'left') {
			return answerArr.join(' ');
		}
		if (position === 'top') {
			return answerArr.join('\n');
		}
	};

	lineString(line, nthLine, position, boardArr);

	return (
		<View style={{ backgroundColor: 'yellow' }}>
			{position === 'top' ? (
				<Text
					style={[
						line === 10 ? { fontSize: 14 } : { fontSize: 11 },
						topLineFinishArr[nthLine] ? { fontWeight: 'bold' } : null,
					]}
				>
					{lineString(line, nthLine, position, boardArr)}
				</Text>
			) : null}
			{position === 'left' ? (
				<Text
					style={[
						line === 10 ? { fontSize: 14 } : { fontSize: 11 },
						leftLineFinishArr[nthLine] ? { fontWeight: 'bold' } : null,
					]}
				>
					{lineString(line, nthLine, position, boardArr)}
				</Text>
			) : null}
		</View>
	);
};

export default BoardLine;
