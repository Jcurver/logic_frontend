import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
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
import { Background, useHeaderHeight } from '@react-navigation/elements';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableArea from './TouchableArea';
import { TouchMode, TouchState } from './interface';
import { TouchCase } from './TouchCase';
import { MOCK_BOARD } from './mockBoard';
import { CustomModal } from '../CustomModal';
import BoardNumbers from './boardNumbers';
import { IBoard } from './interface';

const MOCK_BOARD1 = MOCK_BOARD.map((v) => [...v]);
const MOCK_BOARD2 = MOCK_BOARD.map((v) => [...v]);

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
	const [touchFinal, setTouchFinal] = useState({ x: 0, y: 0 });
	const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
	const [savePointModalVisible, setSavePointModalVisible] =
		useState<boolean>(false);
	const [touched, setTouched] = useState(false);
	const [savePointArr, setSavePointArr] = useState<TouchState[][]>();

	let BoardTargetedX = 0;
	let BoardTargetedY = 0;

	const clearArr = new Array(line)
		.fill('white')
		.map(() => new Array(line).fill('white'));
	const [boardArr, setBoardArr] = useState<TouchState[][]>(
		MOCK_BOARD1 ? MOCK_BOARD1 : clearArr
	);
	console.log('boardArr:: ',boardArr)

	const [boardArrStack, setBoardArrStack] = useState<TouchState[][][]>(
		MOCK_BOARD2 ? [MOCK_BOARD2] : [clearArr]
	);
	// console.log('boardArrStack:: ', boardArrStack);
	// console.log('boardArrStack:: ', boardArrStack.length);

	const [touchMode, setTouchMode] = useState<TouchMode>('black');

	const changeButton = (touchMode: TouchMode) => {
		if (touchMode === 'black' || touchMode === 'removeBlack') {
			setTouchMode('x');
		} else {
			setTouchMode('black');
		}
	};
	const clearBoard = () => {
		setBoardArr(clearArr);
		setDeleteModalVisible(false);
	};
	const goBack = () => {
		if (boardArrStack.length === 1) {
			return;
		}
		const stackCopy = boardArrStack.map((v) => [...v.map((i) => [...i])]);

		setBoardArrStack(stackCopy.slice(0, stackCopy.length - 1));

		setBoardArr(stackCopy[stackCopy.length - 2]);
		setTouched(true);

		// setBoardArr(boardArrStack[stackNum - 2]);
	};
	const savePoint = () => {
		const boardArrCopy = boardArr.map((v) => [...v]);
		const savePointArrCopy = savePointArr?.map((v) => [...v]);

		if (savePointArrCopy) {
			setBoardArr(savePointArrCopy);
			setBoardArrStack([savePointArrCopy]);
			setSavePointArr(undefined);
		} else {
			setSavePointArr(boardArrCopy);
			setBoardArrStack([boardArrCopy]);
		}
		setSavePointModalVisible(false);
	};

	const boardTouch = (touchX: number, touchY: number, mode: TouchMode) => {
		if (touchY < 0 || touchY > line - 1) return;
		setBoardArr((boardArr) => {
			boardArr[touchY].splice(
				touchX,
				1,
				TouchCase(boardArr[touchY][touchX], mode)
			);
			return boardArr;
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
					setTouchFinal({ x: touchFinalX, y: touchFinalY });

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
									setBoardArr(boardArr);
								}
								if (boardArr[y][x] === 'newX') {
									boardArr[y].splice(x, 1, 'white');
									setBoardArr(boardArr);
								}
							}
						}
						// console.log('sss:: ');
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
						setPanResponderStart({ x0, y0 });
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
					if (
						panResponderStart.y0 >= boardStartYpx &&
						panResponderStart.y0 <= boardStartYpx + touchableBoardWidth &&
						panResponderStart.x0 >= boardStartXpx
					) {
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

						const copy = boardArr.map((v) => [...v]);
						const stackCopy = boardArrStack.map((v) => [
							...v.map((i) => [...i]),
						]);
						setBoardArrStack([...stackCopy, copy]);
					}
				},
			}),
		[panResponderStart, touchMode]
	);

	return (
		<View>
			<View
				{...panResponder.panHandlers}
				// {...panResponder.panHandlers}
				// useNativeDriver={true}
				style={[{ width: windowWidth, height: windowWidth }, S.board]}
			>
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<View style={{ flex: 1, backgroundColor: 'yellow' }}></View>

					<BoardNumbers line={line} position="top" boardArr={boardArr} />
				</View>
				<View style={{ flex: 3, flexDirection: 'row' }}>
					<BoardNumbers line={line} position="right" boardArr={boardArr} />
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
				<TouchableOpacity onPress={() => goBack()}>
					<Icon
						name="return-up-back"
						size={40}
						color={boardArrStack.length <= 1 ? 'gray' : 'black'}
					/>
				</TouchableOpacity>

				<TouchableOpacity onPress={() => setSavePointModalVisible(true)}>
					<Icon name="flag-outline" size={40} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
					<Icon name="trash-outline" size={40} />
				</TouchableOpacity>
			</View>

			<CustomModal
				isVisible={deleteModalVisible}
				setVisible={setDeleteModalVisible}
				submit={() => clearBoard()}
				text="정말로 삭제하시겠어요?"
			/>
			<CustomModal
				isVisible={savePointModalVisible}
				setVisible={setSavePointModalVisible}
				submit={() => savePoint()}
				text={
					savePointArr
						? '세이브포인트로 돌아가시겠어요?'
						: '세이브포인트로 설정하시겠어요?'
				}
			/>
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
	deleteModalButton: {
		paddingHorizontal: 10,
		paddingVertical: 10,
		borderWidth: 1,
		borderRadius: 10,
		marginHorizontal: 5,
		marginTop: 10,
	},
});
