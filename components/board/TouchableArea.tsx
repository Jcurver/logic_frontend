import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ITouchableArea } from './interface';

const TouchableArea = ({ boardArr, line }: ITouchableArea) => {
	return (
		<View style={{ flex: 3 }}>
			{Array.from({ length: line }, (_, i) => i).map((x: number) => (
				<View
					key={x}
					style={{ flex: 10, borderWidth: 0.4, flexDirection: 'row' }}
				>
					{Array.from({ length: line }, (_, i) => i).map((y: number) => (
						<View
							key={y}
							style={{
								flex: line,
								borderWidth: 0.4,
								justifyContent: 'center',
								alignItems: 'center',
								backgroundColor: `${
									boardArr[x][y] === 'oldBlack'
										? 'gray'
										: boardArr[x][y] === 'newBlack'
										? 'black'
										: 'white'
								}`,
							}}
						>
							{boardArr[x][y] === 'oldX' ? (
								<Icon name="close" size={12} color="gray" />
							) : boardArr[x][y] === 'newX' ? (
								<Icon name="close" size={12} color="red" />
							) : null}
						</View>
					))}
				</View>
			))}
		</View>
	);
};

export default TouchableArea;
