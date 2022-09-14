import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
interface ICustomModal {
	isVisible: boolean;
	setVisible: Dispatch<SetStateAction<boolean>>;
	submit: () => void;
	text: string;
}

export const CustomModal = ({
	isVisible,
	setVisible,
	submit,
	text,
}: ICustomModal) => {
	return (
		<Modal
			isVisible={isVisible}
			useNativeDriver={true}
			hideModalContentWhileAnimating={true}
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<View
				style={{
					backgroundColor: 'white',
					// width: 200,
					// height: 100,
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: 20,
					padding: 20,
				}}
			>
				<Text>{text}</Text>

				<View style={{ flexDirection: 'row' }}>
					<TouchableOpacity
						style={S.deleteModalButton}
						onPress={() => setVisible(false)}
					>
						<Text>아니오</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={S.deleteModalButton}
						onPress={() => submit()}
					>
						<Text>네</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
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
