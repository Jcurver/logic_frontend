import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	PanResponder,
	Animated,
	PanResponderInstance,
	Button,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableArea from './TouchableArea';
import { TouchCase, TouchMode } from './TouchCase';

interface IBoard {
	line: 10 | 15 | 20;
}

export const Board = ({ line }: IBoard) => {
	const windowWidth = Dimensions.get('window').width;
	const touchableBoardWidth = (windowWidth * 3) / 4;
	const headerHeight = useHeaderHeight();
	const boardStartYpx = windowWidth / 4 + headerHeight;
	const boardStartXpx = windowWidth / 4;
	const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
	const [panResponderStart, setPanResponderStart] = useState({
		x0: 0,
		y0: 0,
	});

	let BoardTargetedX = 0;
	let BoardTargetedY = 0;

	const arr = new Array(line)
		.fill('white')
		.map(() => new Array(line).fill('white'));
	const [boardArr, setBoardArr] = useState(arr);
	const [touchMode, setTouchMode] = useState<TouchMode>('black');

	const changeButton = (touchMode: TouchMode) => {
		if (touchMode === 'black' || touchMode === 'removeBlack') {
			setTouchMode('x');
		} else {
			setTouchMode('black');
		}
	};

	const boardTouch = (touchX: number, touchY: number, mode: TouchMode) => {
		if (touchY < 0 || touchY > line - 1) return;
		setBoardArr((boardArr) => {
			boardArr[touchY].splice(
				touchX,
				1,
				TouchCase(boardArr[touchY][touchX], mode)
			);
			return [...boardArr];
		});
	};

	const panResponder: PanResponderInstance = useMemo(
		() =>
			PanResponder.create({
				onStartShouldSetPanResponder: () => true,
				onPanResponderMove: (_, { dx, dy }) => {
					const touchStartX = Math.floor(
						(panResponderStart.x0 - boardStartXpx) /
							(touchableBoardWidth / line)
					);
					const touchFinalX = Math.floor(
						(panResponderStart.x0 + dx - boardStartXpx) /
							(touchableBoardWidth / line)
					);
					const touchStartY = Math.floor(
						(panResponderStart.y0 - boardStartYpx) /
							(touchableBoardWidth / line)
					);
					const touchFinalY = Math.floor(
						(panResponderStart.y0 + dy - boardStartYpx) /
							(touchableBoardWidth / line)
					);

					if (
						touchFinalX >= 0 &&
						touchFinalX < line &&
						touchFinalY >= 0 &&
						touchFinalY < line &&
						panResponderStart.y0 >= boardStartYpx &&
						panResponderStart.y0 <= boardStartYpx + touchableBoardWidth &&
						panResponderStart.x0 >= boardStartXpx &&
						(touchFinalX !== BoardTargetedX || touchFinalY !== BoardTargetedY)
					) {
						for (let x = 0; x < line; x++) {
							for (let y = 0; y < line; y++) {
								if (boardArr[y][x] === 'newBlack') {
									boardArr[y].splice(x, 1, 'white');
									setBoardArr([...boardArr]);
								}
								if (boardArr[y][x] === 'newX') {
									boardArr[y].splice(x, 1, 'white');
									setBoardArr([...boardArr]);
								}
							}
						}
						if (Math.abs(dx) > Math.abs(dy)) {
							for (
								let i = 0;
								i < Math.abs(touchFinalX - touchStartX) + 1;
								i++
							) {
								if (touchFinalX < touchStartX) {
									boardTouch(touchStartX - i, touchStartY, touchMode);
								} else {
									boardTouch(touchStartX + i, touchStartY, touchMode);
								}
							}
						} else {
							for (
								let i = 0;
								i < Math.abs(touchFinalY - touchStartY) + 1;
								i++
							) {
								if (touchFinalY < touchStartY) {
									boardTouch(touchStartX, touchStartY - i, touchMode);
								} else {
									boardTouch(touchStartX, touchStartY + i, touchMode);
								}
							}
						}
						BoardTargetedX = touchFinalX;
						BoardTargetedY = touchFinalY;
					}
				},
				onPanResponderStart: (_, { x0, y0 }) => {
					if (
						y0 >= boardStartYpx &&
						y0 <= boardStartYpx + touchableBoardWidth &&
						x0 >= boardStartXpx
					) {
						const touchY = Math.floor(
							(y0 - boardStartYpx) / (touchableBoardWidth / line)
						);
						const touchX = Math.floor(
							(x0 - boardStartXpx) / (touchableBoardWidth / line)
						);
						setPanResponderStart({ x0, y0 });
						boardTouch(touchX, touchY, touchMode);
						BoardTargetedX = touchX;

						if (
							boardArr[touchY][touchX] === 'oldBlack' &&
							touchMode === 'black'
						) {
							boardTouch(touchX, touchY, 'removeBlack');
							setTouchMode('removeBlack');
						} else if (
							boardArr[touchY][touchX] === 'oldX' &&
							touchMode === 'x'
						) {
							boardTouch(touchX, touchY, 'removeX');
							setTouchMode('removeX');
						}
					} else {
						setPanResponderStart({ x0: 0, y0: 0 });
					}
				},
				onPanResponderRelease: () => {
					for (let x = 0; x < line; x++) {
						for (let y = 0; y < line; y++) {
							if (boardArr[y][x] === 'newBlack') {
								boardArr[y].splice(x, 1, 'oldBlack');
								setBoardArr([...boardArr]);
							}
							if (boardArr[y][x] === 'newX') {
								boardArr[y].splice(x, 1, 'oldX');
								setBoardArr([...boardArr]);
							}
						}
					}
					if (touchMode === 'removeBlack') {
						setTouchMode('black');
					}
					if (touchMode === 'removeX') {
						setTouchMode('x');
					}
				},
			}),
		[panResponderStart, touchMode]
	);

	return (
		<View>
			<View
				{...panResponder.panHandlers}
				style={[{ width: windowWidth, height: windowWidth }, S.board]}
			>
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<View style={{ flex: 1, backgroundColor: 'yellow' }}></View>
					<View style={{ flex: 3, backgroundColor: 'green' }}></View>
				</View>
				<View style={{ flex: 3, flexDirection: 'row' }}>
					<View style={{ flex: 1, backgroundColor: 'blue' }}></View>
					<TouchableArea boardArr={boardArr} line={line} />
				</View>
			</View>
			<View style={S.changeButton}>
				<TouchableOpacity onPress={() => changeButton(touchMode)}>
					<Icon
						name={
							touchMode === 'black' || touchMode === 'removeBlack'
								? 'brush'
								: 'close'
						}
						size={40}
						color={
							touchMode === 'removeBlack' || touchMode === 'removeX'
								? 'red'
								: 'gray'
						}
					/>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => changeButton(touchMode)}>
					<Icon
						name="return-up-back"
						size={40}
						color={
							touchMode === 'removeBlack' || touchMode === 'removeX'
								? 'red'
								: 'gray'
						}
					/>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => changeButton(touchMode)}>
					<Icon
						name="return-up-forward"
						size={40}
						color={
							touchMode === 'removeBlack' || touchMode === 'removeX'
								? 'red'
								: 'gray'
						}
					/>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => changeButton(touchMode)}>
					<Icon
						name="flag-outline"
						size={40}
						color={
							touchMode === 'removeBlack' || touchMode === 'removeX'
								? 'red'
								: 'gray'
						}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const S = StyleSheet.create({
	screen: {
		flex: 1,
	},
	board: { backgroundColor: 'orange' },
	changeButton: {
		// flex:1 ,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
});
