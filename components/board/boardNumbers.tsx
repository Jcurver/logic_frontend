import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BoardLine from './boardLine';
import { IBoardNumbers, IBoardRightNumbersLine } from './interface';
import { MOCK_BOARD } from './mockBoard';

const BoardNumbers = ({ line, position, boardArr }: IBoardNumbers) => {
	
	return (
		<>
			{position === 'right' ? (
				<View style={S.rightView}>
					{Array.from({ length: line }, (_, i) => i).map((nthLine: number) => (
						<View
							key={nthLine}
							style={{
								flex: 10,
								borderWidth: 0.4,
								alignItems: 'flex-end',
								justifyContent: 'center',
								paddingRight: 7,
							}}
						>
							<BoardLine
								line={line}
								nthLine={nthLine}
								position="right"
								boardArr={boardArr}
							/>
						</View>
					))}
				</View>
			) : null}
			{position === 'top' ? (
				<View style={S.topView}>
					{Array.from({ length: line }, (_, i) => i).map((nthLine: number) => (
						<View
							key={nthLine}
							style={{
								flex: 10,
								borderWidth: 0.4,
								alignItems: 'center',
								justifyContent: 'flex-end',
								paddingBottom: 7,
							}}
						>
							<BoardLine
								line={line}
								nthLine={nthLine}
								position="top"
								boardArr={boardArr}
							/>
						</View>
					))}
				</View>
			) : null}
		</>
	);
};

export default BoardNumbers;

const S = StyleSheet.create({
	rightView: {
		flex: 1,
		backgroundColor: '#eeeeee',
	},
	topView: {
		flex: 3,
		flexDirection: 'row',
		backgroundColor: '#eeeeee',
	},
});
