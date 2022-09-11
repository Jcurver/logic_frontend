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

type Imode = 'black' | 'x';

export const Board10 = ({ ...props }) => {
	const windowWidth = Dimensions.get('window').width;
	const touchableBoardWidth = (windowWidth * 3) / 4;
	const headerHeight = useHeaderHeight();
	const firstY = windowWidth / 4 + headerHeight;
	const firstX = windowWidth / 4;
	const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
	const [clickMode, setClickMode] = useState<Imode>('black');
	const [panResponderStart, setPanResponderStart] = useState({
		x0: 0,
		y0: 0,
	});
	const [boardTargetedAxis, setBoardTargetedAxis] = useState({
		boardX: 0,
		boardY: 0,
	});
	let BoardTargetedX = 0;
	let go = [''];
	let BoardTargetedY = -1;

	const arr = new Array(10).fill(0).map(() => new Array(10).fill(0));
	const [boardArr, setBoardArr] = useState(arr);
	const [boardChangingArr, setBoardChangingArr] = useState(arr);
	// const [go, setGo] = useState('');

	const boardTouch = useMemo(
		() => (touchX: number, touchY: number, mode: Imode) => {
			if (mode === 'black') {
				setBoardArr((boardArr) => {
					boardArr[touchY].splice(
						touchX,
						1,
						boardArr[touchY][touchX] === 0 ? 1 : 0
					);
					return [...boardArr];
				});
			}
		},
		[boardTargetedAxis]
	);
	const maxNum = useRef(true);
	const panResponder: PanResponderInstance = useMemo(
		() =>
			PanResponder.create({
				onStartShouldSetPanResponder: () => true,
				onPanResponderMove: (_, { dx, dy }) => {
					position.setValue({ x: dx, y: dy });
					let newBoardX = Math.floor(
						(panResponderStart.x0 + dx - firstX) / (touchableBoardWidth / 10)
					);
					// console.log('BoardTargetedX:: ', BoardTargetedX);

					// const touchY = Math.floor(
					// 	(panResponderStart.y0 - firstY) / (touchableBoardWidth / 10)
					// );
					const touchX = Math.floor(
						(panResponderStart.x0 - firstX) / (touchableBoardWidth / 10)
					);
					const touchX2 = Math.floor(
						(panResponderStart.x0 - firstX) / (touchableBoardWidth / 10)
					);

					if (
						panResponderStart.y0 >= firstY &&
						panResponderStart.y0 <= firstY + touchableBoardWidth &&
						panResponderStart.x0 >= firstX &&
						newBoardX !== BoardTargetedX
						// newBoardX !== touchX
					) {
						const oldgo = [...go];
						console.log('oldgo:: ', oldgo);
						if (newBoardX === touchX) {
							boardTouch(touchX, boardTargetedAxis.boardY, 'black');
							if (
								oldgo[0] == 'left' &&
								boardArr[boardTargetedAxis.boardY][touchX]
							) {
								boardTouch(touchX, boardTargetedAxis.boardY, 'black');
							}
						}
						if (newBoardX > BoardTargetedX) {
							if (go[0]='right')
							go = ['right'];
							boardTouch(newBoardX, boardTargetedAxis.boardY, 'black');
						} else {
							go = ['left'];
							boardTouch(newBoardX + 1, boardTargetedAxis.boardY, 'black');
						}
						// else if (newBoardX < BoardTargetedX) {
						// 	go = ['right'];
						// 	boardTouch(newBoardX, boardTargetedAxis.boardY, 'black');
						// } else {
						// 	go = ['left'];
						// 	boardTouch(newBoardX + 1, boardTargetedAxis.boardY, 'black');
						// }

						BoardTargetedX = newBoardX;
						console.log('render::DD ');
					}
				},
				onPanResponderStart: (_, { x0, y0 }) => {
					if (
						y0 >= firstY &&
						y0 <= firstY + touchableBoardWidth &&
						x0 >= firstX
					) {
						const touchY = Math.floor(
							(y0 - firstY) / (touchableBoardWidth / 10)
						);
						const touchX = Math.floor(
							(x0 - firstX) / (touchableBoardWidth / 10)
						);
						boardTouch(touchX, touchY, 'black');
						setPanResponderStart({ x0, y0 });
						setBoardTargetedAxis({ boardX: touchX, boardY: touchY });
						BoardTargetedX = touchX;
					}
				},
			}),
		[panResponderStart]
	);
	// const pressHandler = (e) => {
	// 	console.log(e.nativeEvent.pageX);
	// 	console.log(e.nativeEvent.pageY);
	// 	// this.animation.play();
	// };
	useEffect(() => {
		console.log('rendering');
	}, [boardTouch, setBoardArr, boardTargetedAxis, setBoardTargetedAxis]);
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
											boardArr[x][y] === 1 ? 'black' : 'white'
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
