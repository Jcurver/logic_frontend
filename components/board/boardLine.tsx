import { IBoardRightNumbersLine, TouchState } from './interface';
import React, { useEffect, useState } from 'react';
import { MOCK_ANSWER_BOARD, MOCK_BOARD } from './mockBoard';
import { View, Text, StyleSheet } from 'react-native';

const lineString = (
	line: number,
	nthLine: number,
	position: string,
	boardArr: TouchState[][]
) => {
	let myLine: string[] = [];
	if (position === 'right') {
		myLine = MOCK_ANSWER_BOARD[nthLine];
	}
	if (position === 'top') {
		for (let i = 0; i < line; i++) {
			myLine.push(MOCK_ANSWER_BOARD[i][nthLine]);
		}
	}

	const arr = [];
	let number = 0;
	let beforeAddedBlack = false;
	// const [number, setNumber] = useState(0);
	// const [beforeAddedBlack, setBeforeAddedBlack] = useState(false);
	for (let i = 0; i < line; i++) {
		if (myLine[i] !== 'oldBlack' && !beforeAddedBlack) {
			beforeAddedBlack = false;
		} else if (myLine[i] !== 'oldBlack' && beforeAddedBlack) {
			beforeAddedBlack = false;

			if (number > 0) {
				arr.push(number);
				number = 0;
			} else {
				continue;
			}
		} else if (myLine[i] === 'oldBlack') {
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

	console.log('arr:: ', arr);
	if (position === 'right') {
		return arr.join(' ');
	}
	if (position === 'top') {
		return arr.join('\n');
	}
};

const BoardLine = ({
	line,
	nthLine,
	position,
	boardArr,
}: IBoardRightNumbersLine) => {
	return (
		<View>
			<Text style={line === 10 ? { fontSize: 14 } : { fontSize: 11 }}>
				{lineString(line, nthLine, position, boardArr)}
			</Text>
		</View>
	);
};

export default BoardLine;
