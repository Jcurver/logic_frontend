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
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

type TouchMode = 'black' | 'x' | 'removeBlack' | 'removeX';
type ButtonState = 'newBlack' | 'oldBlack' | 'newX' | 'oldX' | 'white';
type swipeDirection = 'xAxis' | 'yAxis';

export const Board10 = ({ ...props }) => {
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
	const [panResponderMove, setPanResponderMove] = useState({ dx: 0, dy: 0 });
	// const [boardTargetedAxis, setBoardTargetedAxis] = useState({
	// 	boardX: 0,
	// 	boardY: 0,
	// });

	let BoardTargetedX = 0;
	let BoardTargetedY = 0;

	let go = [''];

	const arr = new Array(10)
		.fill('white')
		.map(() => new Array(10).fill('white'));

	const [boardArr, setBoardArr] = useState(arr);
	const [touchMode, setTouchMode] = useState<TouchMode>('black');

	const TouchCase = (touchState: ButtonState, mode: TouchMode) => {
		console.log('modeEEE:: ', mode);
		switch (mode) {
			case 'black':
				if (touchState === 'white') return 'newBlack';
				if (touchState === 'oldBlack') return 'oldBlack';
				if (touchState === 'newBlack') return 'white';
			case 'removeBlack':
				if (touchState === 'white') return 'white';
				if (touchState === 'oldBlack') return 'white';
		}
	};

	const boardTouch = (touchX: number, touchY: number, mode: TouchMode) => {
		if (touchY < 0 || touchY > 9) return;
		setBoardArr((boardArr) => {
			boardArr[touchY].splice(
				touchX,
				1,
				TouchCase(boardArr[touchY][touchX], touchMode)
			);
			return [...boardArr];
		});
	};

	const panResponder: PanResponderInstance = useMemo(
		() =>
			PanResponder.create({
				onStartShouldSetPanResponder: () => true,
				onPanResponderMove: (_, { dx, dy }) => {
					// position.setValue({ x: dx, y: dy });
					const touchStartX = Math.floor(
						(panResponderStart.x0 - boardStartXpx) / (touchableBoardWidth / 10)
					);
					const touchFinalX = Math.floor(
						(panResponderStart.x0 + dx - boardStartXpx) /
							(touchableBoardWidth / 10)
					);
					const touchStartY = Math.floor(
						(panResponderStart.y0 - boardStartYpx) / (touchableBoardWidth / 10)
					);
					const touchFinalY = Math.floor(
						(panResponderStart.y0 + dy - boardStartYpx) /
							(touchableBoardWidth / 10)
					);
					console.log('touchFinalX:: ', touchFinalX);

					if (
						touchFinalX >= 0 &&
						touchFinalX < 10 &&
						touchFinalY >= 0 &&
						touchFinalY < 10 &&
						panResponderStart.y0 >= boardStartYpx &&
						panResponderStart.y0 <= boardStartYpx + touchableBoardWidth &&
						panResponderStart.x0 >= boardStartXpx &&
						(touchFinalX !== BoardTargetedX || touchFinalY !== BoardTargetedY)
					) {
						for (let x = 0; x < 10; x++) {
							for (let y = 0; y < 10; y++) {
								if (boardArr[y][x] === 'newBlack') {
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
									console.log('touchMode:: ', touchMode);
									boardTouch(touchStartX - i, touchStartY, touchMode);
								} else {
									console.log('touchMode:: ', touchMode);

									boardTouch(touchStartX + i, touchStartY, touchMode);
								}
								console.log('i:: ', i);
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
							(y0 - boardStartYpx) / (touchableBoardWidth / 10)
						);
						const touchX = Math.floor(
							(x0 - boardStartXpx) / (touchableBoardWidth / 10)
						);
						setPanResponderStart({ x0, y0 });
						// setBoardTargetedAxis({ boardX: touchX, boardY: touchY });
						boardTouch(touchX, touchY, touchMode);
						BoardTargetedX = touchX;
						if (
							boardArr[touchY][touchX] === 'oldBlack' &&
							touchMode === 'black'
						) {
							boardTouch(touchX, touchY, 'removeBlack');
							setTouchMode('removeBlack');
							boardArr[touchY].splice(touchX, 1, 'white');
							setBoardArr([...boardArr]);
						}
					}
				},
				onPanResponderRelease: () => {
					for (let x = 0; x < 10; x++) {
						for (let y = 0; y < 10; y++) {
							if (boardArr[y][x] === 'newBlack') {
								boardArr[y].splice(x, 1, 'oldBlack');
								setBoardArr([...boardArr]);
							}
						}
					}
					if (touchMode === 'removeBlack') {
						setTouchMode('black');
					}
				},
			}),
		[panResponderStart, touchMode]
	);
	// const pressHandler = (e) => {
	// 	console.log(e.nativeEvent.pageX);
	// 	console.log(e.nativeEvent.pageY);
	// 	// this.animation.play();
	// };
	useEffect(() => {
		console.log('rendering');
	}, [boardTouch, setBoardArr]);
	return (
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
				<View style={{ flex: 3 }}>
					{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((x: number) => (
						<View
							key={x}
							style={{ flex: 10, borderWidth: 0.4, flexDirection: 'row' }}
						>
							{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((y: number) => (
								<View
									key={y}
									style={{
										flex: 10,
										borderWidth: 0.4,
										backgroundColor: `${
											boardArr[x][y] === 'oldBlack'
												? 'gray'
												: boardArr[x][y] === 'newBlack'
												? 'black'
												: 'white'
										}`,
									}}
								></View>
							))}
						</View>
					))}
				</View>
			</View>
		</View>
	);
};

const S = StyleSheet.create({
	screen: {
		flex: 1,
	},
	board: { backgroundColor: 'orange' },
});
